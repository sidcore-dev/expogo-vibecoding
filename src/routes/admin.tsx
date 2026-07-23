import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, MessageSquareText, Sparkles, Wrench } from "lucide-react";
import { getDiagnosisContent } from "@/lib/diagnose.functions";
import { getBobContent } from "@/lib/bob.functions";
import { getHomeContent } from "@/lib/site.functions";
import { BTN_PRIMARY, BTN_SECONDARY } from "@/lib/ui";
import { SiteCopyEditor } from "@/components/admin/SiteCopyEditor";
import { FrequentQuestionsEditor } from "@/components/admin/FrequentQuestionsEditor";
import { BobEditor } from "@/components/admin/BobEditor";
import { DiagnosisEditor } from "@/components/admin/DiagnosisEditor";

export const Route = createFileRoute("/admin")({
  loader: async () => {
    const [home, bob, diagnosis] = await Promise.all([
      getHomeContent(),
      getBobContent(),
      getDiagnosisContent(),
    ]);
    return { home, bob, diagnosis };
  },
  head: () => ({
    meta: [{ title: "Admin — Fix-It First" }],
  }),
  component: AdminPage,
});

const TABS = [
  { id: "site", label: "Site copy", icon: Sparkles },
  { id: "questions", label: "Frequent questions", icon: MessageSquareText },
  { id: "bob", label: "Bob", icon: MessageSquareText },
  { id: "diagnosis", label: "Diagnosis content", icon: Wrench },
] as const;

type TabId = (typeof TABS)[number]["id"];

function AdminPage() {
  const { home, bob, diagnosis } = Route.useLoaderData();
  const [tab, setTab] = useState<TabId>("site");

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary">
              <Wrench className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wide uppercase text-primary">Admin panel</div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Site control</h1>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-600/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-foreground">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-none text-amber-600" />
            <span>
              This page has no login yet — anyone with the URL can edit site content. Add authentication before
              sharing this link or deploying publicly.
            </span>
          </div>
        </header>

        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={"px-4 py-2 text-sm " + (tab === t.id ? BTN_PRIMARY : BTN_SECONDARY)}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          {tab === "site" && <SiteCopyEditor initial={home.siteCopy} />}
          {tab === "questions" && <FrequentQuestionsEditor initial={home.frequentQuestions} />}
          {tab === "bob" && <BobEditor initial={bob} />}
          {tab === "diagnosis" && <DiagnosisEditor initial={diagnosis} />}
        </div>
      </div>
    </div>
  );
}
