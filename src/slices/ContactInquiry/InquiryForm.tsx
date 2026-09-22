"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { validateInquiryField, type InquiryField } from "./validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { isFilled, type Content } from "@prismicio/client";


type Labels = Pick<Content.ContactInquirySlice["primary"],
  "name_label" | "gender_label" | "phone_number_label" | "email_label" | "message_label" | "submit_label">;

export default function InquiryForm({ labels }: { labels: Labels }) {
  const id = useId();
  const [errors, setErrors] = useState<Partial<Record<InquiryField, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  function checkField(name: InquiryField, value: string) {
    setErrors((previous) => ({ ...previous, [name]: validateInquiryField(name, value) }));
  }

  function validationProps(name: InquiryField) {
    return {
      required: name !== "gender",
      disabled: isSubmitting,
      "aria-invalid": Boolean(errors[name]),
      "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
      onBlur: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        checkField(name, event.currentTarget.value);
      },
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setStatus(null);
        if (errors[name] !== undefined) checkField(name, event.currentTarget.value);
      },
    };
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    setStatus(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors: Partial<Record<InquiryField, string>> = {};
    const names: InquiryField[] = ["name", "gender", "phone", "email", "message"];
    for (const name of names) {
      if (data.has(name)) {
        const error = validateInquiryField(name, String(data.get(name) ?? ""));
        if (error) nextErrors[name] = error;
      }
    }
    setErrors(nextErrors);
    const firstInvalid = names.find((name) => nextErrors[name]);
    if (firstInvalid) {
      const input = form.elements.namedItem(firstInvalid);
      if (input instanceof HTMLElement) input.focus();
      return;
    }
    submitting.current = true;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      const result = await response.json() as {
        ok?: boolean;
        error?: string;
        errors?: Partial<Record<InquiryField, string>>;
      };
      if (!response.ok || !result.ok) {
        if (result.errors) {
          setErrors(result.errors);
          const invalid = names.find((name) => result.errors?.[name]);
          const input = invalid ? form.elements.namedItem(invalid) : null;
          if (input instanceof HTMLElement) input.focus();
        }
        throw new Error(result.error || "Unable to send your message. Please try again.");
      }
      form.reset();
      setErrors({});
      setStatus({ kind: "success", message: "Thank you. Your message has been sent." });
    } catch (error) {
      setStatus({ kind: "error", message: error instanceof Error ? error.message : "Unable to send your message. Please try again." });
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  }

  return (
          <form className="flex flex-col gap-4" noValidate onSubmit={submit} aria-busy={isSubmitting}>
            <FieldGroup>
              {isFilled.keyText(labels.name_label) && (
                <Field data-invalid={Boolean(errors.name)}>
                  <FieldLabel htmlFor={`${id}-name`}>
                    {labels.name_label}
                  </FieldLabel>
                  <Input
                    id={`${id}-name`}
                    name="name"
                    {...validationProps("name")}
                    type="text"
                    autoComplete="name"
                  />
                  {errors.name && (
                    <FieldError id={`${id}-name-error`}>{errors.name}</FieldError>
                  )}
                </Field>
              )}
              {isFilled.keyText(labels.gender_label) && (
                <Field data-invalid={Boolean(errors.gender)}>
                  <FieldLabel htmlFor={`${id}-gender`}>
                    {labels.gender_label}
                  </FieldLabel>
                  <Input
                    id={`${id}-gender`}
                    name="gender"
                    {...validationProps("gender")}
                    type="text"
                    autoComplete="sex"
                  />
                  {errors.gender && (
                    <FieldError id={`${id}-gender-error`}>{errors.gender}</FieldError>
                  )}
                </Field>
              )}
              {isFilled.keyText(labels.phone_number_label) && (
                <Field data-invalid={Boolean(errors.phone)}>
                  <FieldLabel htmlFor={`${id}-phone`}>
                    {labels.phone_number_label}
                  </FieldLabel>
                  <Input
                    id={`${id}-phone`}
                    name="phone"
                    {...validationProps("phone")}
                    type="tel"
                    autoComplete="tel"
                  />
                  {errors.phone && (
                    <FieldError id={`${id}-phone-error`}>{errors.phone}</FieldError>
                  )}
                </Field>
              )}
              {isFilled.keyText(labels.email_label) && (
                <Field data-invalid={Boolean(errors.email)}>
                  <FieldLabel htmlFor={`${id}-email`}>
                    {labels.email_label}
                  </FieldLabel>
                  <Input
                    id={`${id}-email`}
                    name="email"
                    {...validationProps("email")}
                    type="email"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <FieldError id={`${id}-email-error`}>{errors.email}</FieldError>
                  )}
                </Field>
              )}
              {isFilled.keyText(labels.message_label) && (
                <Field data-invalid={Boolean(errors.message)}>
                  <FieldLabel htmlFor={`${id}-message`}>
                    {labels.message_label}
                  </FieldLabel>
                  <Textarea
                    id={`${id}-message`}
                    name="message"
                    {...validationProps("message")}
                    rows={5}
                  />
                  {errors.message && (
                    <FieldError id={`${id}-message-error`}>{errors.message}</FieldError>
                  )}
                </Field>
              )}
            </FieldGroup>

            <Button
              type="submit"
              disabled={isSubmitting}
              variant="accent"
              className="mt-2 h-auto min-h-16 w-full gap-3 rounded-2xl px-6 py-4 text-center text-md font-bold whitespace-normal shadow-md hover:shadow-lg sm:col-span-2"
            >
              {isSubmitting ? "Sending message…" : labels.submit_label}
            </Button>
            {status && (
              <p role={status.kind === "error" ? "alert" : "status"} className="text-sm text-foundation-body">
                {status.message}
              </p>
            )}
          </form>
  );
}
