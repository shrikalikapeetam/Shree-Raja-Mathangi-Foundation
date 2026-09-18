import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { Building2, Globe, Mail, MapPin, Phone } from "lucide-react";
import InquiryForm from "./InquiryForm";

export default function ContactInquiry({
  slice,
}: SliceComponentProps<Content.ContactInquirySlice>) {
  const p = slice.primary;
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div>
        <aside>
          <h2>
            <Building2 aria-hidden="true" />
            {p.office_title}
          </h2>

          <div>
            <span>
              <Mail aria-hidden="true" />
            </span>
          </div>
          <div>
            <span>
              <Phone aria-hidden="true" />
            </span>
          </div>
        </aside>
        <div>
          <h2>{p.form_title}</h2>
          <p>{p.form_description}</p>
        </div>
      </div>
    </section>
  );
}
