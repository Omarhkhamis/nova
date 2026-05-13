import { LockKeyhole, Mail } from "lucide-react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { loginAdmin } from "./actions";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect("/nv-admin/dashboard");
  }

  const params = searchParams ? await searchParams : {};
  const error = params.error === "invalid";

  return (
    <main className="admin-login-shell">
      <section className="admin-login-card" aria-labelledby="admin-login-title">
        <div className="admin-login-card__brand">
          <span>NAS</span>
          <div>
            <p>Admin area</p>
            <h1 id="admin-login-title">Dashboard login</h1>
          </div>
        </div>

        {error ? (
          <p className="admin-login-alert">Invalid admin email or password.</p>
        ) : null}

        <form className="admin-login-form" action={loginAdmin}>
          <label>
            <span>Email</span>
            <div>
              <Mail size={17} aria-hidden="true" />
              <input name="email" type="email" autoComplete="email" required />
            </div>
          </label>

          <label>
            <span>Password</span>
            <div>
              <LockKeyhole size={17} aria-hidden="true" />
              <input name="password" type="password" autoComplete="current-password" required />
            </div>
          </label>

          <button type="submit">Login</button>
        </form>
      </section>
    </main>
  );
}
