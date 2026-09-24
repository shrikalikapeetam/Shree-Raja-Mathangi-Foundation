"use client";
import { useState, type FormEvent } from "react";
import { toast } from "@/components/ui/toast";
import { updateStatus } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
export default function AdminStatusForm({
  id,
  kind,
  status,
}: {
  id: string;
  kind: "donation" | "contact";
  status: string;
}) {
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    setPending(true);
    try {
      await updateStatus(data);
      toast.add({ type: "success", title: "Follow-up status updated" });
    } catch {
      toast.add({
        type: "error",
        title: "Unable to update status",
        description:
          "Please try again or sign in again if your session expired.",
      });
    } finally {
      setPending(false);
    }
  }
  return (
    <form
      onSubmit={submit}
      aria-busy={pending}
      className="flex flex-wrap items-center gap-2"
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="kind" value={kind} />
      <label htmlFor={`status-${id}`} className="sr-only">
        Follow-up status
      </label>
      <select
        id={`status-${id}`}
        name="status"
        disabled={pending}
        defaultValue={status}
        className="rounded-lg border bg-white p-2"
      >
        {["new", "contacted", "closed"].map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <Button type="submit" size="sm" variant="brand" disabled={pending}>
        {pending ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
