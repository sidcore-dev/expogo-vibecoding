import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { saveSiteCopy } from "@/lib/site.functions";
import type { SiteCopy } from "@/lib/site.functions";
import { Field, SaveBar, Section, TextArea, TextInput } from "@/components/admin/shared";

export function SiteCopyEditor({ initial }: { initial: SiteCopy }) {
  const [copy, setCopy] = useState(initial);
  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: SiteCopy) => saveSiteCopy({ data }),
    onSuccess: () => setSaved(true),
  });

  const set = <TKey extends keyof SiteCopy>(key: TKey, value: SiteCopy[TKey]) => {
    setSaved(false);
    setCopy((c) => ({ ...c, [key]: value }));
  };

  return (
    <Section title="Site copy" description="Branding, page title, meta tags, and the homepage's on-screen text.">
      <Field label="Brand name">
        <TextInput value={copy.brandName} onChange={(e) => set("brandName", e.target.value)} />
      </Field>
      <Field label="Page title (browser tab / SEO)">
        <TextInput value={copy.pageTitle} onChange={(e) => set("pageTitle", e.target.value)} />
      </Field>
      <Field label="Meta description">
        <TextArea rows={2} value={copy.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} />
      </Field>
      <Field label="Open Graph title">
        <TextInput value={copy.ogTitle} onChange={(e) => set("ogTitle", e.target.value)} />
      </Field>
      <Field label="Open Graph description">
        <TextArea rows={2} value={copy.ogDescription} onChange={(e) => set("ogDescription", e.target.value)} />
      </Field>
      <Field label="Hero heading">
        <TextInput value={copy.heroHeading} onChange={(e) => set("heroHeading", e.target.value)} />
      </Field>
      <Field label="Hero subtext">
        <TextArea rows={2} value={copy.heroSubtext} onChange={(e) => set("heroSubtext", e.target.value)} />
      </Field>
      <Field label="Diagnosis error message">
        <TextInput value={copy.errorMessage} onChange={(e) => set("errorMessage", e.target.value)} />
      </Field>
      <Field label="Footer text">
        <TextArea rows={2} value={copy.footerText} onChange={(e) => set("footerText", e.target.value)} />
      </Field>
      <SaveBar saving={mutation.isPending} saved={saved} onSave={() => mutation.mutate(copy)} />
    </Section>
  );
}
