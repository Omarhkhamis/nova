import "server-only";
import { Pool } from "pg";
import type { QueryResultRow } from "pg";

declare global {
  var novaPool: Pool | undefined;
}

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalThis.novaPool) {
    globalThis.novaPool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  return globalThis.novaPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
) {
  const result = await getPool().query<T>(text, params);
  return result.rows;
}

export async function tryQuery<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
) {
  try {
    return await query<T>(text, params);
  } catch (error) {
    console.warn(error);
    return [];
  }
}
