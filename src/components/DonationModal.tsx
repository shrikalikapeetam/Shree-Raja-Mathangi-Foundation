"use client";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Heart, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { PrismicRichText } from "@prismicio/react";
import { getSevaOptions, type DonationContent } from "@/lib/donation-content";
import { cn } from "@/lib/utils";

export const DONATION_MODAL_ID = "donation-modal";

export default function DonationModal({
  content,
}: {
  content: DonationContent;
}) {
  const causes = getSevaOptions(content);
  const initialCause = causes[0]?.id ?? "";
  const configured = Boolean(
    content.modal_subtitle && content.modal_submit_text && causes.length,
  );
  const amounts = [
    ...new Set(
      (content.modal_amounts ?? []).flatMap((item) =>
        typeof item.amount === "number" &&
        Number.isFinite(item.amount) &&
        item.amount >= 1 &&
        item.amount <= 1000000
          ? [item.amount]
          : [],
      ),
    ),
  ];
  const initialAmount = String(amounts[1] ?? amounts[0] ?? "");
  const id = useId();
  const [open, setOpen] = useState(false);
  const [selectedCause, setCause] = useState(initialCause);
  const [amount, setAmount] = useState(initialAmount);
  const [custom, setCustom] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const requestId = useRef("");
  const lock = useRef(false);
  const trigger = useRef<HTMLElement | null>(null);
  useEffect(() => {
    function showModal() {
      if (lock.current) return;
      trigger.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      requestId.current = crypto.randomUUID();
      setSuccess(false);
      setError("");
      setCause(initialCause);
      setAmount(initialAmount);
      setCustom(false);
      setOpen(true);
    }
    function onHashChange() {
      if (window.location.hash === `#${DONATION_MODAL_ID}`) showModal();
    }
    function onClick(event: MouseEvent) {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest("a[href]")
          : null;
      if (
        !(link instanceof HTMLAnchorElement) ||
        link.hasAttribute("download") ||
        (link.target && link.target !== "_self")
      )
        return;
      const url = new URL(link.href);
      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        url.search !== window.location.search ||
        url.hash !== `#${DONATION_MODAL_ID}`
      )
        return;
      event.preventDefault();
      showModal();
      trigger.current = link;
    }
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", onHashChange);
    onHashChange();
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [initialCause, initialAmount]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const notification = toast.add({
      type: "loading",
      title: content.modal_submitting_text,
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
        title: content.modal_success_title,
        description: content.modal_success_description,
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
        if (!next && window.location.hash === `#${DONATION_MODAL_ID}`) {
          window.history.replaceState(
            window.history.state,
            "",
            window.location.pathname + window.location.search,
          );
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm" />
        <Dialog.Popup
          id={DONATION_MODAL_ID}
          finalFocus={trigger}
          className="fixed left-1/2 top-1/2 z-[71] max-h-[94dvh] w-[calc(100%_-_1.5rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-foundation-gold bg-white shadow-2xl"
        >
          <header className="relative bg-foundation-ink p-6 pr-14 text-white sm:p-8 sm:pr-16">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-foundation-gold">
              <Heart className="size-5" aria-hidden="true" />
              {content.modal_title}
            </p>
            <Dialog.Title className="text-2xl text-foundation-cream sm:text-3xl">
              {configured
                ? content.modal_subtitle
                : "Donation form unavailable"}
            </Dialog.Title>
            <Dialog.Description className="mt-3 text-base text-white/80">
              {content.modal_description}
            </Dialog.Description>
            <Dialog.Close
              aria-label={content.modal_close_label || "Close"}
              disabled={busy}
              className="absolute right-5 top-5 rounded p-2 focus-visible:outline-2"
            >
              <X />
            </Dialog.Close>
          </header>
          {!configured ? (
            <p role="status" className="p-8">
              Please contact the foundation to arrange your contribution.
            </p>
          ) : success ? (
            <div role="status" className="space-y-5 p-8 text-center">
              <CheckCircle2 className="mx-auto size-12 text-green-700" />
              <h2 className="text-foundation-ink">
                {content.modal_success_title}
              </h2>
              <p>{content.modal_success_description}</p>
              <Dialog.Close render={<Button variant="brand" />}>
                {content.modal_done_label}
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
                  {content.modal_seva_title}
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
                  {content.modal_donation_amount_title}
                </legend>
                <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {amounts.map((value) => (
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
                  {content.modal_enter_amount_label}
                </label>
                <Input
                  className="h-12"
                  id={`${id}-amount`}
                  type="number"
                  min="1"
                  max="1000000"
                  step="0.01"
                  inputMode="decimal"
                  placeholder={content.modal_enter_amount_label ?? undefined}
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
                  {content.modal_donor_information_title}
                </legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  {[
                    {
                      name: "name",
                      label: content.modal_full_name_label,
                      type: "text",
                      autoComplete: "name",
                      maxLength: 120,
                    },
                    {
                      name: "email",
                      label: content.modal_email_label,
                      type: "email",
                      autoComplete: "email",
                      maxLength: 254,
                    },
                    {
                      name: "phone",
                      label: content.modal_phone_label,
                      type: "tel",
                      autoComplete: "tel",
                      maxLength: 25,
                    },
                    {
                      name: "pan",
                      label: content.modal_pan_label,
                      type: "text",
                      autoComplete: "off",
                      maxLength: 10,
                    },
                  ].map((field) => (
                    <div key={field.name}>
                      <label
                        htmlFor={`${id}-${field.name}`}
                        className="mb-2 block text-sm font-medium"
                      >
                        {field.label}
                      </label>
                      <Input
                        className="h-12"
                        name={field.name}
                        type={field.type}
                        autoComplete={field.autoComplete}
                        placeholder={field.label ?? undefined}
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
                  {content.modal_info_title}
                </h3>
                <PrismicRichText
                  field={content.modal_info}
                  components={{
                    list: ({ children }) => (
                      <ul className="grid gap-2 text-sm sm:grid-cols-2">
                        {children}
                      </ul>
                    ),
                    listItem: ({ children }) => (
                      <li className="flex gap-2">
                        <CheckCircle2
                          className="size-4 shrink-0 text-green-700"
                          aria-hidden="true"
                        />
                        <span>{children}</span>
                      </li>
                    ),
                  }}
                />
              </div>
              <p className="text-sm text-foundation-body">
                {content.modal_highlight_text}
              </p>
              {error && (
                <p role="alert" className="text-red-700">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                variant="accent"
                disabled={busy || !amount || !selectedCause}
                className="h-auto min-h-12 w-full whitespace-normal px-4 py-4"
              >
                <Heart className="size-5" aria-hidden="true" />
                {busy
                  ? content.modal_submitting_text
                  : `${content.modal_submit_text ?? ""} (₹${Number(amount || 0).toLocaleString("en-IN")})`}
              </Button>
            </form>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
