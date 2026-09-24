"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = sent
        ? await authClient.signIn.emailOtp({ email, otp })
        : await authClient.emailOtp.sendVerificationOtp({
            email,
            type: "sign-in",
          });
      if (result.error)
        throw new Error(result.error.message || "Unable to sign in.");
      if (sent) {
        toast.add({ type: "success", title: "Signed in successfully" });
        router.replace("/admin");
        router.refresh();
      } else {
        setSent(true);
        toast.add({
          type: "info",
          title: "Check your email",
          description:
            "If this email is authorized, a sign-in code has been sent. It expires in 5 minutes.",
        });
      }
    } catch (e) {
      toast.add({
        type: "error",
        title: "Unable to sign in",
        description: e instanceof Error ? e.message : "Please try again.",
      });
      setError(
        e instanceof Error ? e.message : "Unable to sign in. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form
      onSubmit={submit}
      className="w-full max-w-md space-y-5 rounded-2xl border border-foundation-border bg-white p-8 shadow-sm"
    >
      <p className="text-sm uppercase tracking-widest text-foundation-accent">
        Foundation administration
      </p>
      <h1 className="text-3xl text-foundation-ink">Welcome back</h1>
      <p className="text-sm">
        Sign in using the code sent to your approved admin email.
      </p>
      <div>
        <label htmlFor="admin-email">Email address</label>
        <Input
          id="admin-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          disabled={busy || sent}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {sent && (
        <div>
          <p role="status" className="mb-3 text-sm">
            If this email is authorized, a code has been sent. It expires in 5
            minutes.
          </p>
          <label htmlFor="admin-code">Sign-in code</label>
          <Input
            id="admin-code"
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            value={otp}
            disabled={busy}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
      )}
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
      <Button type="submit" variant="brand" className="w-full" disabled={busy}>
        {busy
          ? "Please wait…"
          : sent
            ? "Verify and sign in"
            : "Email me a code"}
      </Button>
      {sent && (
        <Button
          type="button"
          variant="ghost"
          disabled={busy}
          onClick={() => {
            setSent(false);
            setOtp("");
            setError("");
          }}
        >
          Change email or resend code
        </Button>
      )}
    </form>
  );
}
