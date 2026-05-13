"use server";

import { redirect } from "next/navigation";
import { clearAdminSession, createAdminSession, verifyAdminCredentials } from "@/lib/auth";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function loginAdmin(formData: FormData) {
  const admin = await verifyAdminCredentials(str(formData, "email"), str(formData, "password"));

  if (!admin) {
    redirect("/nv-admin?error=invalid");
  }

  await createAdminSession(admin.id);
  redirect("/nv-admin/dashboard");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/nv-admin");
}
