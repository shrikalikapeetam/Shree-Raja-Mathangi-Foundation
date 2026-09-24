# Donation modal content

The shared modal uses `#donation-modal`. Its content comes from the Layout singleton's **Modal** tab.

- **Title**: Support sacred seva (small heading).
- **Subtitle**: Donate to Shree Raja Mathangi Foundation (main heading).
- **Description**: introductory sentence.
- **Seva** heading and repeatable **Seva** group: stable Seva ID, Title, Subtitle.
- **Donation Amount Title** and repeatable **Amounts** group containing a Number field **Amount**, in rupees.
- **Enter Amount Label**, **Donor Information Title**, and donor field labels.
- **Info Title** and **Info** Rich Text list.
- **Highlight Text**, **Submit Text**, and loading/success/close labels.

Required asterisks and the optional PAN note are included in the editable label text. Input names and validation remain code-controlled. Keep Seva IDs stable after receiving pledges; titles/subtitles may be edited freely. The API validates submitted causes against the current Prismic list. Admin records retain their stored ID when a cause is removed from Prismic.

Initial content is prepared in `scripts/prismic/modal-content.mjs`. It is not a client-side fallback. Publish the populated Layout before relying on the CMS-driven modal. Model fields are generated through the Prismic CLI; `prismicio-types.d.ts` is regenerated from the local model.
