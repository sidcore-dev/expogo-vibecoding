import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  Wrench,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Loader2,
  ShoppingCart,
  ShoppingBag,
  Zap,
  CalendarRange,
  PhoneCall,
  SquarePlay,
  ListChecks,
  ChevronDown,
} from "lucide-react";
import { diagnoseProblem } from "@/lib/diagnose.functions";
import type { Diagnosis, Cause } from "@/lib/diagnose.functions";
import { getHomeContent } from "@/lib/site.functions";
import {
  BTN_ACCENT_AMBER,
  BTN_DESTRUCTIVE,
  BTN_PRIMARY,
  BTN_SECONDARY,
  CARD,
  CHIP_AMBER,
  CHIP_RED,
  INPUT,
} from "@/lib/ui";

type Difficulty = "5-Minute DIY" | "Weekend Project" | "Call a Pro";

const DEFAULT_SUGGESTION_COUNT = 5;

function suggestionScore(query: string, suggestion: string): number {
  const q = query.toLowerCase().trim();
  const s = suggestion.toLowerCase();
  if (!q) return 0;
  if (s.includes(q)) return 100;
  const queryWords = q.split(/\s+/).filter((w) => w.length > 2);
  return queryWords.reduce(
    (score, w) => (s.includes(w) ? score + 1 : score),
    0,
  );
}

export const Route = createFileRoute("/")({
  loader: () => getHomeContent(),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.siteCopy.pageTitle ?? "Fix-It First" },
      {
        name: "description",
        content: loaderData?.siteCopy.metaDescription ?? "",
      },
      { property: "og:title", content: loaderData?.siteCopy.ogTitle ?? "" },
      {
        property: "og:description",
        content: loaderData?.siteCopy.ogDescription ?? "",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { siteCopy, frequentQuestions } = Route.useLoaderData();
  const [query, setQuery] = useState("");

  const mutation = useMutation({
    mutationFn: (problem: string) => diagnoseProblem({ data: { problem } }),
  });

  const submit = (text: string) => {
    const t = text.trim();
    if (t.length < 3) return;
    setQuery(t);
    mutation.mutate(t);
  };

  const suggestions = useMemo(() => {
    const q = query.trim();
    if (!q) return frequentQuestions.slice(0, DEFAULT_SUGGESTION_COUNT);
    return frequentQuestions
      .map((s) => ({ s, score: suggestionScore(q, s) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, DEFAULT_SUGGESTION_COUNT)
      .map(({ s }) => s);
  }, [query, frequentQuestions]);

  if (mutation.data) {
    return (
      <Results
        diagnosis={mutation.data}
        original={query}
        onBack={() => mutation.reset()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 pt-10 pb-24 sm:pt-16">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary">
              <Wrench className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold tracking-wide uppercase text-primary">
              {siteCopy.brandName}
            </span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {siteCopy.heroHeading}
          </h1>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            {siteCopy.heroSubtext}
          </p>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(query);
          }}
          className="space-y-3"
        >
          <div className={"relative " + CARD}>
            <Sparkles className="pointer-events-none absolute left-4 top-5 h-5 w-5 text-primary" />
            <textarea
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(query);
                }
              }}
              rows={3}
              placeholder="e.g. My kitchen faucet drips even when turned off — started last week"
              className={
                "w-full resize-none rounded-2xl bg-transparent py-4 pl-12 pr-4 text-base text-foreground " +
                INPUT
              }
            />
          </div>
          <button
            type="submit"
            disabled={mutation.isPending || query.trim().length < 3}
            className={"w-full justify-center py-3 " + BTN_PRIMARY}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Diagnosing…
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" /> Diagnose it
              </>
            )}
          </button>
        </form>

        {mutation.isError && (
          <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-danger-text">
            {siteCopy.errorMessage}
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="mt-8">
            <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {query.trim()
                ? "Frequent questions like this"
                : "Frequent questions"}
            </div>
            <ul className="mt-3 space-y-2">
              {suggestions.map((p) => (
                <li key={p}>
                  <button
                    onClick={() => submit(p)}
                    disabled={mutation.isPending}
                    className={"w-full px-4 py-3 text-left " + BTN_SECONDARY}
                  >
                    {p}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <footer className="mt-16 text-center text-xs text-muted-foreground">
          {siteCopy.footerText}
        </footer>
      </div>
    </div>
  );
}

function amazonUrl(query: string) {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
}

function youtubeUrl(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

function Results({
  diagnosis,
  original,
  onBack,
}: {
  diagnosis: Diagnosis;
  original: string;
  onBack: () => void;
}) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const anyVideo = diagnosis.causes.some((c) => c.hasVideo !== false);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 pt-6 pb-24">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeft className="h-4 w-4" /> New problem
        </button>

        <div className="mt-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-primary">
            {diagnosis.category}
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            {diagnosis.title}
          </h1>
          <p className="mt-2 text-sm italic leading-relaxed text-muted-foreground">
            "{original}"
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={amazonUrl(`${diagnosis.category} repair parts`)}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-xl border border-amber-600/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-amber-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Shop {diagnosis.category.toLowerCase()} parts on Amazon
              <ExternalLink className="h-3 w-3" />
            </a>
            {anyVideo && (
              <a
                href={youtubeUrl(`${diagnosis.title} repair tutorial`)}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-xl border border-red-600/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-red-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <SquarePlay className="h-3.5 w-3.5" />
                Watch videos on YouTube
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        {diagnosis.redFlags.length > 0 && (
          <div
            className="mt-6 rounded-2xl border p-5"
            style={{
              background: "var(--danger-surface)",
              borderColor: "var(--danger-border)",
            }}
          >
            <div className="flex items-center gap-2 font-bold text-danger-text">
              <AlertTriangle className="h-5 w-5" />
              Stop — not DIY if you see this
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-foreground">
              {diagnosis.redFlags.map((f, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-danger-text">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Top {diagnosis.causes.length} likely causes
        </h2>

        <ol className="mt-3 space-y-4">
          {diagnosis.causes.map((c, i) => (
            <CauseCard
              key={i}
              cause={c}
              index={i}
              diagnosisTitle={diagnosis.title}
            />
          ))}
        </ol>

        <div className="mt-8 space-y-3">
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(diagnosis.title + " repair near me")}`}
            target="_blank"
            rel="noreferrer"
            className={"w-full justify-center py-3 " + BTN_PRIMARY}
          >
            Still stuck? Find a local pro <ExternalLink className="h-4 w-4" />
          </a>

          <div className={"p-4 text-center " + CARD}>
            <div className="text-sm text-muted-foreground">
              Was this helpful?
            </div>
            <div className="mt-3 flex justify-center gap-2">
              <button
                onClick={() => setVote("up")}
                className={
                  "px-4 py-2 " + (vote === "up" ? BTN_PRIMARY : BTN_SECONDARY)
                }
              >
                <ThumbsUp className="h-4 w-4" /> Yes
              </button>
              <button
                onClick={() => setVote("down")}
                className={
                  "px-4 py-2 " +
                  (vote === "down" ? BTN_DESTRUCTIVE : BTN_SECONDARY)
                }
              >
                <ThumbsDown className="h-4 w-4" /> Not really
              </button>
            </div>
            {vote && (
              <div className="mt-2 text-xs text-muted-foreground">
                Thanks for the feedback.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CauseCard({
  cause: c,
  index: i,
  diagnosisTitle,
}: {
  cause: Cause;
  index: number;
  diagnosisTitle: string;
}) {
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <li className={"p-5 " + CARD}>
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {i + 1}
        </span>
        <div className="flex-1">
          <div className="font-semibold text-foreground">{c.title}</div>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {c.why}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <DifficultyBadge difficulty={c.difficulty} />
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {c.difficultyReason}
        </p>
      </div>

      {c.hasVideo !== false && (
        <a
          href={youtubeUrl(`${c.title} - ${diagnosisTitle} repair how to`)}
          target="_blank"
          rel="noreferrer noopener"
          className={"mt-3 " + CHIP_RED}
        >
          <span className="flex items-center gap-2">
            <SquarePlay className="h-3.5 w-3.5" />
            Watch how to fix this
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
            YouTube →
          </span>
        </a>
      )}

      {c.steps.length > 0 && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setGuideOpen((open) => !open)}
            className={"w-full justify-between px-3.5 py-2.5 " + BTN_SECONDARY}
          >
            <span className="flex items-center gap-2">
              <ListChecks className="h-3.5 w-3.5" />
              Step-by-step guide
            </span>
            <ChevronDown
              className={
                "h-4 w-4 transition-transform duration-200 " +
                (guideOpen ? "rotate-180" : "")
              }
            />
          </button>
          {guideOpen && (
            <ol className="mt-2.5 space-y-2 rounded-xl border border-border bg-secondary/40 p-4">
              {c.steps.map((step, stepIndex) => (
                <li
                  key={stepIndex}
                  className="flex gap-3 text-sm leading-relaxed text-foreground"
                >
                  <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                    {stepIndex + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {c.tools.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            What you'd need · tap to buy
          </div>
          <ul className="mt-2 space-y-1.5">
            {c.tools.map((t) => (
              <li key={t}>
                <a
                  href={amazonUrl(t)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={CHIP_AMBER}
                >
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="h-3.5 w-3.5" />
                    {t}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
                    Amazon →
                  </span>
                </a>
              </li>
            ))}
          </ul>
          {c.tools.length > 1 && (
            <a
              href={amazonUrl(c.tools.join(" "))}
              target="_blank"
              rel="noreferrer noopener"
              className={
                "mt-2.5 w-full justify-center py-2.5 text-xs " +
                BTN_ACCENT_AMBER
              }
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Shop all {c.tools.length} parts on Amazon
            </a>
          )}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl border border-border bg-secondary/40 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            DIY cost
          </div>
          <div className="mt-0.5 font-semibold text-foreground">
            {c.diyCost}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-secondary/40 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            Hire a pro
          </div>
          <div className="mt-0.5 font-semibold text-foreground">
            {c.proCost}
          </div>
        </div>
      </div>
    </li>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const styles: Record<
    Difficulty,
    { bg: string; fg: string; border: string; icon: typeof Zap }
  > = {
    "5-Minute DIY": {
      bg: "oklch(0.92 0.08 150)",
      fg: "oklch(0.28 0.06 150)",
      border: "oklch(0.65 0.15 150)",
      icon: Zap,
    },
    "Weekend Project": {
      bg: "oklch(0.94 0.09 75)",
      fg: "oklch(0.3 0.06 60)",
      border: "oklch(0.75 0.16 75)",
      icon: CalendarRange,
    },
    "Call a Pro": {
      bg: "oklch(0.94 0.05 27)",
      fg: "oklch(0.35 0.15 27)",
      border: "oklch(0.65 0.2 27)",
      icon: PhoneCall,
    },
  };
  const s = styles[difficulty];
  const Icon = s.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
      style={{ backgroundColor: s.bg, color: s.fg, borderColor: s.border }}
    >
      <Icon className="h-3 w-3" />
      {difficulty}
    </span>
  );
}
