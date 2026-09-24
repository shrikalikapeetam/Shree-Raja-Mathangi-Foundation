"use client";
import { useId, useRef, useState, type FormEvent } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Heart, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { causes, type Cause } from "@/lib/donations";
import { cn } from "@/lib/utils";

export default function DonationModal({
  children,
  cause = "go-samrakshnam",
  className,
  variant = "accent",
  onOpen,
}: {
  children: React.ReactNode;
  cause?: Cause;
  className?: string;
  variant?: "accent" | "brand" | "cream";
  onOpen?: () => void;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [selectedCause, setCause] = useState<Cause>(cause);
  const [amount, setAmount] = useState("1100");
  const [custom, setCustom] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const requestId = useRef("");
  const lock = useRef(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const notification = toast.add({
      type: "loading",
      title: "Saving your seva pledge…",
      timeout: 0,
    });
    let failureType: "warning" | "error" = "error";
    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          cause: selectedCause,
          amount: Math.round(Number(amount) * 100),
          requestId: requestId.current,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        failureType = [400, 429].includes(response.status)
          ? "warning"
          : "error";
        throw new Error(result.error || "Unable to save your pledge.");
      }
      setSuccess(true);
      toast.update(notification, {
        type: "success",
        title: "Seva pledge received",
        description:
          "Our team will contact you. No payment has been collected.",
        timeout: 6000,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Please try again.";
      setError(message);
      toast.update(notification, {
        type: failureType,
        title:
          failureType === "warning"
            ? "Please check your pledge"
            : "Unable to save pledge",
        description: message,
        timeout: 8000,
      });
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (busy) return;
        setOpen(next);
        if (next) {
          requestId.current = crypto.randomUUID();
          setSuccess(false);
          setError("");
          setCause(cause);
          onOpen?.();
        }
      }}
    >
      <Dialog.Trigger
        render={<Button variant={variant} className={className} />}
      >
        {children}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-[71] max-h-[94dvh] w-[calc(100%_-_1.5rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-foundation-gold bg-white shadow-2xl">
          <header className="relative bg-foundation-ink p-6 pr-14 text-white sm:p-8 sm:pr-16">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-foundation-gold">
              <Heart className="size-5" aria-hidden="true" />
              Support sacred seva
            </p>
            <Dialog.Title className="text-2xl text-foundation-cream sm:text-3xl">
              Donate to Shree Raja Mathangi Foundation
            </Dialog.Title>
            <Dialog.Description className="mt-3 text-base text-white/80">
              Every contribution preserves ancient Vedas, cares for sacred Desi
              cows, and restores historic temples.
            </Dialog.Description>
            <Dialog.Close
              aria-label="Close donation form"
              disabled={busy}
              className="absolute right-5 top-5 rounded p-2 focus-visible:outline-2"
            >
              <X />
            </Dialog.Close>
          </header>
          {success ? (
            <div role="status" className="space-y-5 p-8 text-center">
              <CheckCircle2 className="mx-auto size-12 text-green-700" />
              <h2 className="text-foundation-ink">
                Thank you for your seva pledge
              </h2>
              <p>
                Our team will contact you to arrange your contribution. No
                payment has been collected.
              </p>
              <Dialog.Close render={<Button variant="brand" />}>
                Done
              </Dialog.Close>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="space-y-7 p-5 sm:p-8"
              aria-busy={busy}
            >
              <fieldset disabled={busy}>
                <legend className="mb-3 font-semibold uppercase tracking-wide text-foundation-ink">
                  Select seva cause
                </legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  {causes.map((c) => (
                    <label
                      key={c.id}
                      className={cn(
                        "cursor-pointer rounded-2xl border p-4",
                        selectedCause === c.id
                          ? "border-foundation-accent bg-legacy-surface ring-1 ring-foundation-accent"
                          : "border-foundation-border",
                      )}
                    >
                      <input
                        className="mr-2 accent-foundation-accent"
                        type="radio"
                        name="seva-cause"
                        checked={selectedCause === c.id}
                        onChange={() => setCause(c.id)}
                        value={c.id}
                      />
                      <span className="font-semibold">{c.name}</span>
                      <span className="mt-2 block text-sm text-foundation-body">
                        {c.description}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset disabled={busy}>
                <legend className="mb-3 font-semibold uppercase tracking-wide text-foundation-ink">
                  Select donation amount (₹)
                </legend>
                <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[501, 1100, 2100, 5100].map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant={
                        !custom && amount === String(value)
                          ? "brand"
                          : "outline"
                      }
                      aria-pressed={!custom && amount === String(value)}
                      onClick={() => {
                        setAmount(String(value));
                        setCustom(false);
                      }}
                    >
                      ₹{value.toLocaleString("en-IN")}
                    </Button>
                  ))}
                </div>
                <label htmlFor={`${id}-amount`} className="sr-only">
                  Custom amount in rupees
                </label>
                <Input
                  className="h-12"
                  id={`${id}-amount`}
                  type="number"
                  min="1"
                  max="1000000"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="₹ Enter custom amount"
                  value={custom ? amount : ""}
                  required={custom}
                  onChange={(event) => {
                    setCustom(true);
                    setAmount(event.target.value);
                  }}
                />
              </fieldset>
              <fieldset
                disabled={busy}
                className="border-t border-foundation-border pt-5"
              >
                <legend className="font-semibold uppercase tracking-wide text-foundation-ink">
                  Donor information
                </legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  {[
                    {
                      name: "name",
                      label: "Full name",
                      type: "text",
                      autoComplete: "name",
                      placeholder: "Your full name",
                      maxLength: 120,
                    },
                    {
                      name: "email",
                      label: "Email address",
                      type: "email",
                      autoComplete: "email",
                      placeholder: "you@example.com",
                      maxLength: 254,
                    },
                    {
                      name: "phone",
                      label: "Phone number",
                      type: "tel",
                      autoComplete: "tel",
                      placeholder: "+91 98765 43210",
                      maxLength: 25,
                    },
                    {
                      name: "pan",
                      label: "PAN number (optional)",
                      type: "text",
                      autoComplete: "off",
                      placeholder: "ABCDE1234F",
                      maxLength: 10,
                    },
                  ].map((field) => (
                    <div key={field.name}>
                      <label
                        htmlFor={`${id}-${field.name}`}
                        className="mb-2 block text-sm font-medium"
                      >
                        {field.label}
                        {field.name !== "pan" && " *"}
                      </label>
                      <Input
                        className="h-12"
                        name={field.name}
                        type={field.type}
                        autoComplete={field.autoComplete}
                        placeholder={field.placeholder}
                        maxLength={field.maxLength}
                        id={`${id}-${field.name}`}
                        required={field.name !== "pan"}
                        pattern={
                          field.name === "pan"
                            ? "[A-Za-z]{5}[0-9]{4}[A-Za-z]"
                            : undefined
                        }
                      />
                    </div>
                  ))}
                </div>
              </fieldset>
              <div className="rounded-2xl border border-foundation-gold bg-legacy-surface p-5">
                <h3 className="mb-3 text-lg text-foundation-ink">
                  How your seva transforms lives
                </h3>
                <ul className="grid gap-2 text-sm sm:grid-cols-2">
                  {[
                    "Educates future Vedic scholars",
                    "Protects & feeds indigenous cows",
                    "Preserves sacred temples & traditions",
                    "Supports teachers, students & seva",
                    "Promotes heritage research & archives",
                    "Builds sustainable preservation infrastructure",
                  ].map((text) => (
                    <li key={text} className="flex gap-2">
                      <CheckCircle2
                        className="size-4 shrink-0 text-green-700"
                        aria-hidden="true"
                      />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-foundation-body">
                Submit a pledge and our team will contact you about payment and
                receipt arrangements. PAN is optional and used only for receipt
                processing.
              </p>
              {error && (
                <p role="alert" className="text-red-700">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                variant="accent"
                disabled={busy || !amount}
                className="h-auto min-h-12 w-full whitespace-normal px-4 py-4"
              >
                <Heart className="size-5" aria-hidden="true" />
                {busy
                  ? "Saving your pledge…"
                  : `Submit seva pledge (₹${Number(amount || 0).toLocaleString("en-IN")})`}
              </Button>
            </form>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
