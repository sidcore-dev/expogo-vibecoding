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
import { diagnoseProblem, type Diagnosis, type Cause } from "@/lib/diagnose.functions";
import { GLASS_AMBER, GLASS_DESTRUCTIVE, GLASS_NEUTRAL, GLASS_PRIMARY, GLASS_RED } from "@/lib/ui";

type Difficulty = "5-Minute DIY" | "Weekend Project" | "Call a Pro";

const FREQUENT_QUESTIONS = [
  "My kitchen faucet drips even when off",
  "Bathroom outlet stopped working",
  "Dryer runs but clothes stay wet",
  "Ceiling fan wobbles on high",
  "Small hole in drywall from doorknob",
  "Toilet won't stop running",
  "Toilet tank keeps refilling by itself",
  "AC is running but not cooling the house",
  "Thermostat screen is blank",
  "Furnace is blowing cold air",
  "Outdoor GFCI outlet keeps tripping",
  "Bathtub faucet won't stop dripping",
  "Dryer is making a loud squealing noise",
  "Ceiling fan makes a clicking noise on low",
];

const DEFAULT_SUGGESTION_COUNT = 5;

function suggestionScore(query: string, suggestion: string): number {
  const q = query.toLowerCase().trim();
  const s = suggestion.toLowerCase();
  if (!q) return 0;
  if (s.includes(q)) return 100;
  const queryWords = q.split(/\s+/).filter((w) => w.length > 2);
  return queryWords.reduce((score, w) => (s.includes(w) ? score + 1 : score), 0);
}

const CLAY_CARD =
  "rounded-3xl border border-border/50 bg-gradient-to-b from-card to-card/70 shadow-xl shadow-black/10 ring-1 ring-white/40";

const AMAZON_CHIP = GLASS_AMBER + " group flex items-center justify-between gap-2 px-3.5 py-2.5 text-sm";

const VIDEO_CHIP = GLASS_RED + " group flex items-center justify-between gap-2 px-3.5 py-2.5 text-sm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fix-It First — AI household repair triage" },
      { name: "description", content: "Describe what's broken. AI gives you the 3 most likely causes, difficulty, cost, safety red flags, and shopping links for parts." },
      { property: "og:title", content: "Fix-It First — AI household repair triage" },
      { property: "og:description", content: "AI-powered repair triage with cost, difficulty, and parts links." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function CloudBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-28 -top-28 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-secondary/50 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-secondary/30 blur-3xl" />
    </div>
  );
}

function Index() {
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
    if (!q) return FREQUENT_QUESTIONS.slice(0, DEFAULT_SUGGESTION_COUNT);
    return FREQUENT_QUESTIONS.map((s) => ({ s, score: suggestionScore(q, s) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, DEFAULT_SUGGESTION_COUNT)
      .map(({ s }) => s);
  }, [query]);

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
      <CloudBackdrop />
      <div className="mx-auto max-w-2xl px-4 pt-10 pb-24 sm:pt-16">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/30 ring-1 ring-white/30">
              <Wrench className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold tracking-wide uppercase text-primary">
              Fix-It First
            </span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Describe what's broken.
          </h1>
          <p className="mt-2 text-muted-foreground">
            AI gives you the 3 most likely causes, whether it's DIY-safe, and links to buy the parts.
          </p>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(query);
          }}
          className="space-y-3"
        >
          <div className={"relative " + CLAY_CARD}>
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
              className="w-full resize-none rounded-3xl bg-transparent py-4 pl-12 pr-4 text-base text-foreground outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={mutation.isPending || query.trim().length < 3}
            className={"flex w-full items-center justify-center gap-2 py-4 font-semibold " + GLASS_PRIMARY}
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
          <div className="mt-4 rounded-2xl border-2 border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive shadow-inner shadow-black/5">
            Couldn't reach the AI. Try again in a moment.
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="mt-8">
            <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {query.trim() ? "Frequent questions like this" : "Frequent questions"}
            </div>
            <ul className="mt-3 space-y-2">
              {suggestions.map((p) => (
                <li key={p}>
                  <button
                    onClick={() => submit(p)}
                    disabled={mutation.isPending}
                    className={"w-full px-4 py-3 text-left text-sm " + GLASS_NEUTRAL}
                  >
                    {p}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <footer className="mt-16 text-center text-xs text-muted-foreground">
          General AI guidance, not a substitute for a pro. Product links are Amazon searches.
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
      <CloudBackdrop />
      <div className="mx-auto max-w-2xl px-4 pt-6 pb-24 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> New problem
        </button>

        <div className="mt-4">
          <div className="text-xs uppercase tracking-wide text-primary font-semibold">
            {diagnosis.category}
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            {diagnosis.title}
          </h1>
          <p className="mt-2 text-sm italic text-muted-foreground">"{original}"</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={amazonUrl(`${diagnosis.category} repair parts`)}
              target="_blank"
              rel="noreferrer noopener"
              className={"inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold " + GLASS_AMBER}
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
                className={"inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold " + GLASS_RED}
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
            className="mt-6 rounded-3xl border-2 p-5 shadow-xl shadow-destructive/10 ring-1 ring-white/30"
            style={{ background: "var(--danger-surface)", borderColor: "var(--danger-border)" }}
          >
            <div className="flex items-center gap-2 font-bold text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Stop — not DIY if you see this
            </div>
            <ul className="mt-3 space-y-2 text-sm text-foreground">
              {diagnosis.redFlags.map((f, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-destructive">•</span>
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
            <CauseCard key={i} cause={c} index={i} diagnosisTitle={diagnosis.title} />
          ))}
        </ol>

        <div className="mt-8 space-y-3">
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(diagnosis.title + " repair near me")}`}
            target="_blank"
            rel="noreferrer"
            className={"flex w-full items-center justify-center gap-2 py-4 font-semibold " + GLASS_PRIMARY}
          >
            Still stuck? Find a local pro <ExternalLink className="h-4 w-4" />
          </a>

          <div className={"p-4 text-center " + CLAY_CARD}>
            <div className="text-sm text-muted-foreground">Was this helpful?</div>
            <div className="mt-2 flex justify-center gap-2">
              <button
                onClick={() => setVote("up")}
                className={
                  "inline-flex items-center gap-1 px-4 py-2 text-sm font-medium " +
                  (vote === "up" ? GLASS_PRIMARY : GLASS_NEUTRAL)
                }
              >
                <ThumbsUp className="h-4 w-4" /> Yes
              </button>
              <button
                onClick={() => setVote("down")}
                className={
                  "inline-flex items-center gap-1 px-4 py-2 text-sm font-medium " +
                  (vote === "down" ? GLASS_DESTRUCTIVE : GLASS_NEUTRAL)
                }
              >
                <ThumbsDown className="h-4 w-4" /> Not really
              </button>
            </div>
            {vote && (
              <div className="mt-2 text-xs text-muted-foreground">Thanks for the feedback.</div>
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
    <li className={"p-5 " + CLAY_CARD}>
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-sm font-bold text-primary-foreground shadow-md shadow-primary/40 ring-2 ring-white/30">
          {i + 1}
        </span>
        <div className="flex-1">
          <div className="font-semibold text-foreground">{c.title}</div>
          <p className="mt-1 text-sm text-muted-foreground">{c.why}</p>
        </div>
      </div>

      <div className="mt-4">
        <DifficultyBadge difficulty={c.difficulty as Difficulty} />
        <p className="mt-2 text-xs text-muted-foreground">{c.difficultyReason}</p>
      </div>

      {c.hasVideo !== false && (
        <a
          href={youtubeUrl(`${c.title} - ${diagnosisTitle} repair how to`)}
          target="_blank"
          rel="noreferrer noopener"
          className={"mt-3 " + VIDEO_CHIP}
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
            className={"flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-sm font-semibold " + GLASS_PRIMARY}
          >
            <span className="flex items-center gap-2">
              <ListChecks className="h-3.5 w-3.5" />
              Step-by-step guide
            </span>
            <ChevronDown
              className={
                "h-4 w-4 transition-transform duration-200 " + (guideOpen ? "rotate-180" : "")
              }
            />
          </button>
          {guideOpen && (
            <ol className="mt-2.5 space-y-2 rounded-2xl border border-border/40 bg-gradient-to-b from-secondary/60 to-secondary/30 p-4 shadow-inner shadow-black/5">
              {c.steps.map((step, stepIndex) => (
                <li key={stepIndex} className="flex gap-3 text-sm text-foreground">
                  <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-[11px] font-bold text-primary-foreground shadow-sm shadow-primary/30">
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
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              What you'd need · tap to buy
            </div>
          </div>
          <ul className="mt-2 space-y-1.5">
            {c.tools.map((t) => (
              <li key={t}>
                <a
                  href={amazonUrl(t)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={AMAZON_CHIP}
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
              className={"mt-2.5 flex w-full items-center justify-center gap-2 py-2.5 text-xs font-bold " + GLASS_AMBER}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Shop all {c.tools.length} parts on Amazon
            </a>
          )}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-2xl border border-border/40 bg-gradient-to-b from-secondary/70 to-secondary/40 p-3 shadow-inner shadow-black/5">
          <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            DIY cost
          </div>
          <div className="mt-0.5 font-semibold text-foreground">{c.diyCost}</div>
        </div>
        <div className="rounded-2xl border border-border/40 bg-gradient-to-b from-secondary/70 to-secondary/40 p-3 shadow-inner shadow-black/5">
          <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            Hire a pro
          </div>
          <div className="mt-0.5 font-semibold text-foreground">{c.proCost}</div>
        </div>
      </div>
    </li>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const styles: Record<
    Difficulty,
    { bg: string; fg: string; ring: string; icon: typeof Zap }
  > = {
    "5-Minute DIY": { bg: "oklch(0.92 0.08 150)", fg: "oklch(0.28 0.06 150)", ring: "oklch(0.65 0.15 150)", icon: Zap },
    "Weekend Project": { bg: "oklch(0.94 0.09 75)", fg: "oklch(0.3 0.06 60)", ring: "oklch(0.75 0.16 75)", icon: CalendarRange },
    "Call a Pro": { bg: "oklch(0.94 0.05 27)", fg: "oklch(0.35 0.15 27)", ring: "oklch(0.65 0.2 27)", icon: PhoneCall },
  };
  const s = styles[difficulty];
  const Icon = s.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-semibold"
      style={{
        backgroundColor: s.bg,
        color: s.fg,
        borderColor: s.ring,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,.5), 0 6px 16px -6px color-mix(in oklch, ${s.ring} 55%, transparent)`,
      }}
    >
      <Icon className="h-3 w-3" />
      {difficulty}
    </span>
  );
}
