"use client";
import { Button } from "@/components/ui/button";
export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div className="rounded-2xl border bg-white p-8">
      <h2 className="text-xl">Unable to load admin data</h2>
      <p className="my-4">
        Please try again. If the issue continues, check that the database is
        connected and migrations have run.
      </p>
      <Button onClick={reset} variant="brand">
        Try again
      </Button>
    </div>
  );
}
