"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
export default function AdminSignOut() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div>
      <Button
        disabled={busy}
        variant="outline"
        onClick={async () => {
          setBusy(true);
          setError("");
          try {
            const result = await authClient.signOut();
            if (result.error) throw Error("Sign out failed. Try again.");
            toast.add({ type: "success", title: "Signed out" });
            router.replace("/sign-in");
            router.refresh();
          } catch {
            setError("Sign out failed. Try again.");
            toast.add({
              type: "error",
              title: "Sign out failed",
              description: "Please try again.",
            });
          } finally {
            setBusy(false);
          }
        }}
      >
        Sign out
      </Button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
