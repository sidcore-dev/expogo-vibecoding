import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { Plus, Trash2 } from "lucide-react";
import { BTN_PRIMARY, BTN_SECONDARY, CARD, INPUT } from "@/lib/ui";

export function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <div className={"p-5 " + CARD}>
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      {children}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={"w-full px-3.5 py-2.5 text-sm text-foreground " + INPUT} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={"w-full px-3.5 py-2.5 text-sm text-foreground " + INPUT} />;
}

export function StringListEditor({
  values,
  onChange,
  placeholder,
  addLabel,
}: {
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  addLabel: string;
}) {
  return (
    <div className="space-y-2">
      {values.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={v}
            placeholder={placeholder}
            onChange={(e) => onChange(values.map((existing, idx) => (idx === i ? e.target.value : existing)))}
            className={"flex-1 px-3.5 py-2 text-sm text-foreground " + INPUT}
          />
          <button
            type="button"
            aria-label="Remove"
            onClick={() => onChange(values.filter((_, idx) => idx !== i))}
            className={"px-2.5 " + BTN_SECONDARY}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...values, ""])}
        className={"px-3 py-1.5 text-xs " + BTN_SECONDARY}
      >
        <Plus className="h-3.5 w-3.5" /> {addLabel}
      </button>
    </div>
  );
}

export function SaveBar({
  onSave,
  saving,
  saved,
}: {
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={onSave} disabled={saving} className={"px-5 py-2.5 " + BTN_PRIMARY}>
        {saving ? "Saving…" : "Save changes"}
      </button>
      {saved && <span className="text-xs font-medium text-muted-foreground">Saved</span>}
    </div>
  );
}
