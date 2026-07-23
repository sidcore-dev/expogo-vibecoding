import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { saveDiagnosisContent } from "@/lib/diagnose.functions";
import type { Cause, Diagnosis, Difficulty, Profile } from "@/lib/diagnose.functions";
import { BTN_SECONDARY, INPUT } from "@/lib/ui";
import { Field, SaveBar, Section, StringListEditor, TextArea, TextInput } from "@/components/admin/shared";

const DIFFICULTIES: Difficulty[] = ["5-Minute DIY", "Weekend Project", "Call a Pro"];

const BLANK_CAUSE: Cause = {
  title: "",
  why: "",
  difficulty: "5-Minute DIY",
  difficultyReason: "",
  tools: [],
  diyCost: "",
  proCost: "",
  steps: [],
  hasVideo: true,
};

const BLANK_DIAGNOSIS: Diagnosis = {
  category: "",
  title: "",
  redFlags: [],
  causes: [],
};

interface EditableProfile {
  keywordsText: string;
  diagnosis: Diagnosis;
}

function toEditableProfiles(profiles: Profile[]): EditableProfile[] {
  return profiles.map((p) => ({ keywordsText: p.keywords.join(", "), diagnosis: p.diagnosis }));
}

function toProfiles(entries: EditableProfile[]): Profile[] {
  return entries
    .map((e) => ({
      keywords: e.keywordsText
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
      diagnosis: e.diagnosis,
    }))
    .filter((p) => p.keywords.length > 0 && p.diagnosis.title.trim().length > 0);
}

function CauseFieldsEditor({ cause, onChange }: { cause: Cause; onChange: (c: Cause) => void }) {
  return (
    <div className="space-y-2.5">
      <Field label="Title">
        <TextInput value={cause.title} onChange={(e) => onChange({ ...cause, title: e.target.value })} />
      </Field>
      <Field label="Why (shown under the cause title)">
        <TextArea rows={2} value={cause.why} onChange={(e) => onChange({ ...cause, why: e.target.value })} />
      </Field>
      <Field label="Difficulty">
        <select
          value={cause.difficulty}
          onChange={(e) => onChange({ ...cause, difficulty: e.target.value as Difficulty })}
          className={"w-full px-3.5 py-2.5 text-sm text-foreground " + INPUT}
        >
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Difficulty reason">
        <TextInput
          value={cause.difficultyReason}
          onChange={(e) => onChange({ ...cause, difficultyReason: e.target.value })}
        />
      </Field>
      <div className="grid grid-cols-2 gap-2.5">
        <Field label="DIY cost">
          <TextInput value={cause.diyCost} onChange={(e) => onChange({ ...cause, diyCost: e.target.value })} />
        </Field>
        <Field label="Pro cost">
          <TextInput value={cause.proCost} onChange={(e) => onChange({ ...cause, proCost: e.target.value })} />
        </Field>
      </div>
      <Field label="Tools / parts needed">
        <StringListEditor
          values={cause.tools}
          addLabel="Add tool"
          onChange={(tools) => onChange({ ...cause, tools })}
        />
      </Field>
      <Field label="Step-by-step instructions">
        <StringListEditor
          values={cause.steps}
          addLabel="Add step"
          onChange={(steps) => onChange({ ...cause, steps })}
        />
      </Field>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={cause.hasVideo !== false}
          onChange={(e) => onChange({ ...cause, hasVideo: e.target.checked })}
        />
        Show "watch video" link for this cause
      </label>
    </div>
  );
}

function DiagnosisFieldsEditor({ diagnosis, onChange }: { diagnosis: Diagnosis; onChange: (d: Diagnosis) => void }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Category">
          <TextInput value={diagnosis.category} onChange={(e) => onChange({ ...diagnosis, category: e.target.value })} />
        </Field>
        <Field label="Title">
          <TextInput value={diagnosis.title} onChange={(e) => onChange({ ...diagnosis, title: e.target.value })} />
        </Field>
      </div>
      <Field label="Red flags (stop — call a pro)">
        <StringListEditor
          values={diagnosis.redFlags}
          addLabel="Add red flag"
          onChange={(redFlags) => onChange({ ...diagnosis, redFlags })}
        />
      </Field>

      <div>
        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Causes</div>
        <div className="space-y-2.5">
          {diagnosis.causes.map((cause, i) => (
            <details key={i} className="rounded-xl border border-border p-3.5">
              <summary className="cursor-pointer text-sm font-semibold text-foreground">
                {cause.title || `Cause ${i + 1}`}
              </summary>
              <div className="mt-3">
                <CauseFieldsEditor
                  cause={cause}
                  onChange={(c) =>
                    onChange({
                      ...diagnosis,
                      causes: diagnosis.causes.map((existing, idx) => (idx === i ? c : existing)),
                    })
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    onChange({ ...diagnosis, causes: diagnosis.causes.filter((_, idx) => idx !== i) })
                  }
                  className={"mt-3 px-3 py-1.5 text-xs " + BTN_SECONDARY}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove cause
                </button>
              </div>
            </details>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...diagnosis, causes: [...diagnosis.causes, { ...BLANK_CAUSE }] })}
          className={"mt-2.5 px-3 py-1.5 text-xs " + BTN_SECONDARY}
        >
          <Plus className="h-3.5 w-3.5" /> Add cause
        </button>
      </div>
    </div>
  );
}

export function DiagnosisEditor({ initial }: { initial: { profiles: Profile[]; generic: Diagnosis } }) {
  const [profiles, setProfiles] = useState<EditableProfile[]>(toEditableProfiles(initial.profiles));
  const [generic, setGeneric] = useState<Diagnosis>(initial.generic);
  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: { profiles: Profile[]; generic: Diagnosis }) => saveDiagnosisContent({ data }),
    onSuccess: () => setSaved(true),
  });

  const updateProfile = (i: number, patch: Partial<EditableProfile>) => {
    setSaved(false);
    setProfiles((list) => list.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  };

  return (
    <Section
      title="Diagnosis content"
      description="The repair profiles matched against what a user types, plus the fallback shown when nothing matches."
    >
      <div className="space-y-2.5">
        {profiles.map((profile, i) => (
          <details key={i} className="rounded-xl border border-border p-4">
            <summary className="cursor-pointer text-sm font-semibold text-foreground">
              {profile.diagnosis.title || `Profile ${i + 1}`}
              <span className="ml-2 font-normal text-muted-foreground">({profile.diagnosis.category || "no category"})</span>
            </summary>
            <div className="mt-3 space-y-3">
              <Field label="Match keywords (comma-separated — matched against what the user types)">
                <TextInput
                  value={profile.keywordsText}
                  onChange={(e) => updateProfile(i, { keywordsText: e.target.value })}
                />
              </Field>
              <DiagnosisFieldsEditor
                diagnosis={profile.diagnosis}
                onChange={(diagnosis) => updateProfile(i, { diagnosis })}
              />
              <button
                type="button"
                onClick={() => {
                  setSaved(false);
                  setProfiles((list) => list.filter((_, idx) => idx !== i));
                }}
                className={"px-3 py-1.5 text-xs " + BTN_SECONDARY}
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove profile
              </button>
            </div>
          </details>
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          setSaved(false);
          setProfiles((list) => [...list, { keywordsText: "", diagnosis: { ...BLANK_DIAGNOSIS } }]);
        }}
        className={"px-3 py-1.5 text-xs " + BTN_SECONDARY}
      >
        <Plus className="h-3.5 w-3.5" /> Add profile
      </button>

      <details className="rounded-xl border border-border p-4">
        <summary className="cursor-pointer text-sm font-semibold text-foreground">
          Fallback diagnosis (shown when nothing matches)
        </summary>
        <div className="mt-3">
          <DiagnosisFieldsEditor
            diagnosis={generic}
            onChange={(d) => {
              setSaved(false);
              setGeneric(d);
            }}
          />
        </div>
      </details>

      <SaveBar
        saving={mutation.isPending}
        saved={saved}
        onSave={() => {
          const cleaned = toProfiles(profiles);
          setProfiles(toEditableProfiles(cleaned));
          mutation.mutate({ profiles: cleaned, generic });
        }}
      />
    </Section>
  );
}
