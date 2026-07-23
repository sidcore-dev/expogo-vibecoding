import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { saveFrequentQuestions } from "@/lib/site.functions";
import { SaveBar, Section, StringListEditor } from "@/components/admin/shared";

export function FrequentQuestionsEditor({ initial }: { initial: string[] }) {
  const [questions, setQuestions] = useState(initial);
  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: string[]) => saveFrequentQuestions({ data }),
    onSuccess: () => setSaved(true),
  });

  return (
    <Section
      title="Frequent questions"
      description="Suggestion chips shown on the homepage and matched as the user types."
    >
      <StringListEditor
        values={questions}
        addLabel="Add question"
        placeholder="e.g. My kitchen faucet drips even when off"
        onChange={(next) => {
          setSaved(false);
          setQuestions(next);
        }}
      />
      <SaveBar
        saving={mutation.isPending}
        saved={saved}
        onSave={() => {
          const cleaned = questions.filter((q) => q.trim().length > 0);
          setQuestions(cleaned);
          mutation.mutate(cleaned);
        }}
      />
    </Section>
  );
}
