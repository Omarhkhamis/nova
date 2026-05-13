import "server-only";
import { createHmac, randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { query } from "@/lib/db";

const scrypt = promisify(nodeScrypt);
const SESSION_COOKIE = "nova_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
const PASSWORD_KEY_LENGTH = 64;

export type AdminSession = {
  id: number;
  email: string;
  name: string;
};

export type AdminListItem = AdminSession & {
  created_at: string;
  updated_at: string;
};

type AdminPasswordRow = AdminSession & {
  password_hash: string;
};

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET ?? process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? process.env.DATABASE_URL;

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET or DATABASE_URL is required for admin sessions.");
  }

  return secret;
}

function signSessionPayload(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
}

function signaturesMatch(left: string, right: string) {
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function parseSession(value?: string) {
  if (!value) {
    return null;
  }

  const [adminId, issuedAt, signature] = value.split(".");
  const issuedAtNumber = Number(issuedAt);
  const idNumber = Number(adminId);

  if (!Number.isInteger(idNumber) || !Number.isFinite(issuedAtNumber) || !signature) {
    return null;
  }

  const payload = `${adminId}.${issuedAt}`;
  const expectedSignature = signSessionPayload(payload);

  if (!signaturesMatch(signature, expectedSignature)) {
    return null;
  }

  if (Date.now() - issuedAtNumber > SESSION_MAX_AGE_SECONDS * 1000) {
    return null;
  }

  return { adminId: idNumber };
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scrypt(password, salt, PASSWORD_KEY_LENGTH)) as Buffer;

  return `scrypt$${salt}$${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, hash] = storedHash.split("$");

  if (algorithm !== "scrypt" || !salt || !hash) {
    return false;
  }

  const storedBuffer = Buffer.from(hash, "hex");
  const hashBuffer = (await scrypt(password, salt, storedBuffer.length)) as Buffer;

  return storedBuffer.length === hashBuffer.length && timingSafeEqual(storedBuffer, hashBuffer);
}

export async function verifyAdminCredentials(email: string, password: string) {
  const [admin] = await query<AdminPasswordRow>(
    `SELECT id, email, name, password_hash
     FROM admins
     WHERE LOWER(email) = LOWER($1)
     LIMIT 1`,
    [email],
  );

  if (!admin || !(await verifyPassword(password, admin.password_hash))) {
    return null;
  }

  return { id: admin.id, email: admin.email, name: admin.name };
}

export async function createAdminSession(adminId: number) {
  const issuedAt = Date.now();
  const payload = `${adminId}.${issuedAt}`;
  const cookieStore = await cookies();

  cookieStore.set({
    name: SESSION_COOKIE,
    value: `${payload}.${signSessionPayload(payload)}`,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const parsedSession = parseSession(cookieStore.get(SESSION_COOKIE)?.value);

  if (!parsedSession) {
    return null;
  }

  const [admin] = await query<AdminSession>(
    `SELECT id, email, name
     FROM admins
     WHERE id = $1
     LIMIT 1`,
    [parsedSession.adminId],
  );

  return admin ?? null;
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    notFound();
  }

  return admin;
}

export async function listAdmins() {
  await requireAdmin();

  return query<AdminListItem>(
    `SELECT id, email, name, created_at::text, updated_at::text
     FROM admins
     ORDER BY id`,
  );
}
