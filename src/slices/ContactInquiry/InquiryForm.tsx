"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import {
  genderOptions,
  validateInquiryField,
  type InquiryField,
} from "./validation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { Textarea } from "@/components/ui/textarea";
import { type Content } from "@prismicio/client";

type Labels = Pick<
  Content.ContactInquirySlice["primary"],
  | "name_label"
  | "gender_label"
  | "phone_number_label"
  | "email_label"
  | "message_label"
  | "submit_label"
>;

export default function InquiryForm({ labels }: { labels: Labels }) {
  const id = useId();
  const [gender, setGender] = useState<string | null>(null);
  const genderTrigger = useRef<HTMLButtonElement>(null);
  const [errors, setErrors] = useState<Partial<Record<InquiryField, string>>>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);

  function checkField(name: InquiryField, value: string) {
    setErrors((previous) => ({
      ...previous,
      [name]: validateInquiryField(name, value),
    }));
  }

  function validationProps(name: InquiryField) {
    return {
      required: true,
      disabled: isSubmitting,
      "aria-invalid": Boolean(errors[name]),
      "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
      onBlur: (
        event: React.FocusEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => {
        checkField(name, event.currentTarget.value);
      },
      onChange: (
        event: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => {
        if (errors[name] !== undefined)
          checkField(name, event.currentTarget.value);
      },
    };
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors: Partial<Record<InquiryField, string>> = {};
    const names: InquiryField[] = [
      "name",
      "gender",
      "phone",
      "email",
      "message",
    ];
    for (const name of names) {
      const error = validateInquiryField(name, String(data.get(name) ?? ""));
      if (error) nextErrors[name] = error;
    }
    setErrors(nextErrors);
    const firstInvalid = names.find((name) => nextErrors[name]);
    if (firstInvalid) {
      toast.add({
        type: "warning",
        title: "Please check your details",
        description: "Correct the highlighted fields before submitting.",
      });
      const input = form.elements.namedItem(firstInvalid);
      if (firstInvalid === "gender") genderTrigger.current?.focus();
      else if (input instanceof HTMLElement) input.focus();
      return;
    }
    submitting.current = true;
    setIsSubmitting(true);
    const notification = toast.add({
      type: "loading",
      title: "Sending your message…",
      timeout: 0,
    });
    let failureType: "warning" | "error" = "error";
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        errors?: Partial<Record<InquiryField, string>>;
      };
      if (!response.ok || !result.ok) {
        failureType = [400, 429].includes(response.status)
          ? "warning"
          : "error";
        if (result.errors) {
          setErrors(result.errors);
          const invalid = names.find((name) => result.errors?.[name]);
          const input = invalid ? form.elements.namedItem(invalid) : null;
          if (invalid === "gender") genderTrigger.current?.focus();
          else if (input instanceof HTMLElement) input.focus();
        }
        throw new Error(
          result.error || "Unable to send your message. Please try again.",
        );
      }
      form.reset();
      setGender(null);
      setErrors({});
      toast.update(notification, {
        type: "success",
        title: "Message received",
        description:
          "Thank you. Your inquiry has been received by the foundation.",
        timeout: 5000,
      });
    } catch (error) {
      toast.update(notification, {
        type: failureType,
        title:
          failureType === "warning"
            ? "Please check your submission"
            : "Unable to send message",
        description:
          error instanceof Error ? error.message : "Please try again.",
        timeout: 8000,
      });
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="flex flex-col gap-4"
      noValidate
      onSubmit={submit}
      aria-busy={isSubmitting}
    >
      <FieldGroup>
        <Field data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor={`${id}-name`}>
            {labels.name_label?.trim() || "Full Name"} *
          </FieldLabel>
          <Input
            id={`${id}-name`}
            className="h-16 rounded-2xl px-6"
            name="name"
            {...validationProps("name")}
            type="text"
            autoComplete="name"
          />
          {errors.name && (
            <FieldError id={`${id}-name-error`}>{errors.name}</FieldError>
          )}
        </Field>
        <Field data-invalid={Boolean(errors.gender)}>
          <FieldLabel htmlFor={`${id}-gender`}>Gender *</FieldLabel>
          <Select
            name="gender"
            required
            disabled={isSubmitting}
            autoComplete="sex"
            value={gender}
            onValueChange={(value) => {
              setGender(value);
              if (errors.gender !== undefined)
                checkField("gender", value ?? "");
            }}
          >
            <SelectTrigger
              ref={genderTrigger}
              id={`${id}-gender`}
              aria-required="true"
              aria-invalid={Boolean(errors.gender)}
              aria-describedby={
                errors.gender ? `${id}-gender-error` : undefined
              }
              onBlur={() => checkField("gender", gender ?? "")}
              className="w-full rounded-2xl px-6 data-[size=default]:h-16"
            >
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {genderOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.gender && (
            <FieldError id={`${id}-gender-error`}>{errors.gender}</FieldError>
          )}
        </Field>
        <Field data-invalid={Boolean(errors.phone)}>
          <FieldLabel htmlFor={`${id}-phone`}>
            {labels.phone_number_label?.trim() || "Contact Number"} *
          </FieldLabel>
          <Input
            id={`${id}-phone`}
            className="h-16 rounded-2xl px-6"
            name="phone"
            {...validationProps("phone")}
            type="tel"
            autoComplete="tel"
          />
          {errors.phone && (
            <FieldError id={`${id}-phone-error`}>{errors.phone}</FieldError>
          )}
        </Field>
        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor={`${id}-email`}>
            {labels.email_label?.trim() || "Email ID"} *
          </FieldLabel>
          <Input
            id={`${id}-email`}
            className="h-16 rounded-2xl px-6"
            name="email"
            {...validationProps("email")}
            type="email"
            autoComplete="email"
          />
          {errors.email && (
            <FieldError id={`${id}-email-error`}>{errors.email}</FieldError>
          )}
        </Field>
        <Field data-invalid={Boolean(errors.message)}>
          <FieldLabel htmlFor={`${id}-message`}>
            {labels.message_label?.trim() || "Message"} *
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
      </FieldGroup>

      <Button
        type="submit"
        disabled={isSubmitting}
        variant="accent"
        className="mt-2 h-auto min-h-16 w-full gap-3 rounded-2xl px-6 py-4 text-center text-md font-bold whitespace-normal shadow-md hover:shadow-lg sm:col-span-2"
      >
        {isSubmitting
          ? "Sending message…"
          : labels.submit_label?.trim() || "Submit"}
      </Button>
    </form>
  );
}
