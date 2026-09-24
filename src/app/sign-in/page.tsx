import type { Metadata } from "next";
import AdminLogin from "@/components/AdminLogin";
import { adminConfigured } from "@/lib/auth";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};
export default function SignInPage() {
  return (
    <main
      id="main-content"
      className="flex min-h-[80vh] items-center justify-center bg-legacy-surface px-4 py-24"
    >
      {adminConfigured() ? (
        <AdminLogin />
      ) : (
        <div className="max-w-md rounded-2xl border bg-white p-8">
          <h1 className="text-2xl text-foundation-ink">Admin setup pending</h1>
          <p className="mt-4">
            Admin sign-in will be available once the foundation’s database and
            email service are connected.
          </p>
        </div>
      )}
    </main>
  );
}
