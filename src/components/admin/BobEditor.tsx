import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { saveBobContent } from "@/lib/bob.functions";
import type { BobSettings, FaqEntry } from "@/lib/bob.functions";
import { BTN_SECONDARY, CARD } from "@/lib/ui";
import { Field, SaveBar, Section, StringListEditor, TextArea, TextInput } from "@/components/admin/shared";

interface EditableFaqEntry {
  keywordsText: string;
  answer: string;
}

function toEditable(faq: FaqEntry[]): EditableFaqEntry[] {
  return faq.map((f) => ({ keywordsText: f.keywords.join(", "), answer: f.answer }));
}

function toFaq(entries: EditableFaqEntry[]): FaqEntry[] {
  return entries
    .map((e) => ({
      keywords: e.keywordsText
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
      answer: e.answer.trim(),
    }))
    .filter((e) => e.keywords.length > 0 && e.answer.length > 0);
}

export function BobEditor({
  initial,
}: {
  initial: { faq: FaqEntry[]; settings: BobSettings; ludicrousKeywords: string[] };
}) {
  const [settings, setSettings] = useState(initial.settings);
  const [entries, setEntries] = useState<EditableFaqEntry[]>(toEditable(initial.faq));
  const [ludicrousKeywords, setLudicrousKeywords] = useState(initial.ludicrousKeywords);
  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: { faq: FaqEntry[]; settings: BobSettings; ludicrousKeywords: string[] }) =>
      saveBobContent({ data }),
    onSuccess: () => setSaved(true),
  });

  const updateEntry = (i: number, patch: Partial<EditableFaqEntry>) => {
    setSaved(false);
    setEntries((list) => list.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  };

  return (
    <Section title="Bob" description="The chat widget's greeting, fallback reply, and FAQ knowledge base.">
      <Field label="Greeting (first message shown when Bob opens)">
        <TextArea
          rows={2}
          value={settings.greeting}
          onChange={(e) => {
            setSaved(false);
            setSettings((s) => ({ ...s, greeting: e.target.value }));
          }}
        />
      </Field>
      <Field label="Fallback reply (used when nothing in the FAQ matches)">
        <TextArea
          rows={3}
          value={settings.fallback}
          onChange={(e) => {
            setSaved(false);
            setSettings((s) => ({ ...s, fallback: e.target.value }));
          }}
        />
      </Field>
      <Field label="Ludicrous-question reply (used when the trigger list below matches)">
        <TextArea
          rows={2}
          value={settings.ludicrousReply}
          onChange={(e) => {
            setSaved(false);
            setSettings((s) => ({ ...s, ludicrousReply: e.target.value }));
          }}
        />
      </Field>
      <Field label="Ludicrous-question triggers (checked before the FAQ — Bob deflects instead of guessing)">
        <StringListEditor
          values={ludicrousKeywords}
          addLabel="Add trigger phrase"
          placeholder="e.g. meaning of life"
          onChange={(next) => {
            setSaved(false);
            setLudicrousKeywords(next);
          }}
        />
      </Field>

      <div>
        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          FAQ entries
        </div>
        <div className="space-y-3">
          {entries.map((entry, i) => (
            <div key={i} className={"space-y-2 p-3.5 " + CARD}>
              <Field label="Trigger keywords (comma-separated)">
                <TextInput
                  value={entry.keywordsText}
                  onChange={(e) => updateEntry(i, { keywordsText: e.target.value })}
                />
              </Field>
              <Field label="Answer">
                <TextArea rows={2} value={entry.answer} onChange={(e) => updateEntry(i, { answer: e.target.value })} />
              </Field>
              <button
                type="button"
                onClick={() => {
                  setSaved(false);
                  setEntries((list) => list.filter((_, idx) => idx !== i));
                }}
                className={"px-3 py-1.5 text-xs " + BTN_SECONDARY}
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove entry
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            setSaved(false);
            setEntries((list) => [...list, { keywordsText: "", answer: "" }]);
          }}
          className={"mt-3 px-3 py-1.5 text-xs " + BTN_SECONDARY}
        >
          <Plus className="h-3.5 w-3.5" /> Add FAQ entry
        </button>
      </div>

      <SaveBar
        saving={mutation.isPending}
        saved={saved}
        onSave={() => {
          const faq = toFaq(entries);
          const cleanedKeywords = ludicrousKeywords.filter((k) => k.trim().length > 0);
          setEntries(toEditable(faq));
          setLudicrousKeywords(cleanedKeywords);
          mutation.mutate({ faq, settings, ludicrousKeywords: cleanedKeywords });
        }}
      />
    </Section>
  );
}
