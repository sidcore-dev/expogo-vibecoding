import { createServerFn } from "@tanstack/react-start";
import { getContent, setContent } from "@/lib/db.server";

export interface FaqEntry {
  keywords: string[];
  answer: string;
}

export interface BobSettings {
  greeting: string;
  fallback: string;
  ludicrousReply: string;
}

const DEFAULT_FAQ: FaqEntry[] = [
  {
    keywords: ["hi", "hello", "hey", "yo", "sup"],
    answer:
      "Hey, I'm Bob! Ask me a home-safety or how-to question, or something you're unsure is the right thing to do — I'll give you my best honest answer.",
  },
  {
    keywords: ["who are you", "what are you", "what can you do", "your name"],
    answer:
      "I'm Bob, the helper for Fix-It First. I answer general home-safety, how-to, and \"is this the right thing to do\" questions in plain language. For a specific broken thing, use the diagnosis box above instead — that's where the detailed step-by-step guides live.",
  },
  {
    keywords: ["electrical work myself", "diy electrical", "wire my own", "do my own wiring"],
    answer:
      "Small stuff like swapping an outlet cover or resetting a breaker is fine. Anything involving the breaker panel, running new wire, or working while the power's on isn't worth the risk — hire a licensed electrician. Shocks and house fires are the failure mode here, not just wasted time.",
  },
  {
    keywords: ["gas line", "smell gas", "gas leak", "diy gas"],
    answer:
      "Never DIY anything involving gas lines. If you smell gas, leave the house, don't flip any switches, and call your gas company's emergency line or 911 from outside. This one isn't a judgment call — it's always call a pro.",
  },
  {
    keywords: ["tell my landlord", "hide the damage", "landlord about damage", "should i report"],
    answer:
      "Tell your landlord. Small damage reported early is usually cheap to fix and keeps trust intact; hidden damage that gets discovered later tends to cost you more (repair costs plus deposit disputes) and looks a lot worse than the original accident did.",
  },
  {
    keywords: ["selling my house", "disclose", "home sale", "hide a repair"],
    answer:
      "Disclose it. Most places legally require sellers to disclose known defects, and buyers usually find out anyway during inspection — at which point it looks like you were hiding something. Honest disclosure protects you from a lawsuit later, too.",
  },
  {
    keywords: ["permit", "without a permit", "need a permit"],
    answer:
      "For small cosmetic fixes, you're usually fine without one. For anything structural, or most electrical/plumbing beyond a simple swap, check your local permit rules first — skipping a required permit can cause problems if you ever sell the house or if something goes wrong and insurance asks questions.",
  },
  {
    keywords: ["diy or hire", "diy or pro", "should i hire", "call a professional", "hire someone"],
    answer:
      "Good rule of thumb: if a mistake could hurt someone, involves gas or main electrical, or costs more to redo than to hire out from the start — call a pro. If it's reversible, low-risk, and the part is cheap — try it yourself first.",
  },
  {
    keywords: ["tools should every homeowner", "basic tool kit", "starter tools", "tool kit"],
    answer:
      "A solid starter kit: adjustable wrench, multi-bit screwdriver, hammer, tape measure, utility knife, voltage tester, and a flashlight. That covers most of the \"5-Minute DIY\" fixes you'll run into.",
  },
  {
    keywords: ["main water valve", "shut off water", "water shutoff"],
    answer:
      "It's usually where the main line enters the house — basement, crawlspace, garage, or a utility closet. Look for a wheel valve or lever on the pipe. Turning it clockwise shuts the water off. Worth locating it now, before you actually need it in an emergency.",
  },
  {
    keywords: ["breaker box", "find my breaker", "electrical panel", "circuit breaker"],
    answer:
      "Usually in a basement, garage, or utility closet — a metal box with a row of switches. Each breaker should be labeled for the room or circuit it controls (if not, that's a good weekend project to label them).",
  },
  {
    keywords: ["small leak", "ignore a leak", "minor leak"],
    answer:
      "Don't ignore it. Even a slow drip can rot wood, grow mold, or spike your water bill over time, and it's almost always cheaper to fix now than after it's caused water damage.",
  },
  {
    keywords: ["thank", "thanks", "appreciate"],
    answer: "Anytime! Good luck with the fix.",
  },
  {
    keywords: ["bye", "goodbye", "see you", "later"],
    answer: "Take care — come back if anything else comes up.",
  },
];

const DEFAULT_SETTINGS: BobSettings = {
  greeting:
    "Hi, I'm Bob! Ask me a home-safety or how-to question, or run something by me if you're not sure it's the right call.",
  fallback:
    "I don't have a solid answer stored for that one yet — I'm a lightweight helper, so I only know what's in my FAQ list. Try rephrasing, or ask about home safety, DIY-vs-pro decisions, or a right-thing-to-do question. For a specific broken item, use the diagnosis box above instead.",
  ludicrousReply:
    "That one's a bit outside my wheelhouse — I'm here for home repair and safety questions, not that. Try me with something like \"is it safe to DIY electrical work?\"",
};

// Trigger phrases for questions that aren't real home-repair questions —
// checked before FAQ matching so Bob deflects instead of guessing.
const DEFAULT_LUDICROUS_KEYWORDS: string[] = [
  "meaning of life",
  "are you sentient",
  "are you conscious",
  "do you dream",
  "marry me",
  "i love you",
  "aliens",
  "time travel",
  "lottery numbers",
  "who would win in a fight",
  "yo mama",
  "your mom",
  "tell me a joke",
  "what's the weather on mars",
  "how many licks",
  "what is love",
];

function score(query: string, keywords: string[]): number {
  const q = query.toLowerCase();
  return keywords.reduce((acc, kw) => (q.includes(kw) ? acc + kw.split(" ").length : acc), 0);
}

export const askBob = createServerFn({ method: "POST" })
  .validator((message: string) => message)
  .handler(async ({ data: message }) => {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const faq = getContent("bob.faq", DEFAULT_FAQ);
    const settings = getContent("bob.settings", DEFAULT_SETTINGS);
    const ludicrousKeywords = getContent("bob.ludicrousKeywords", DEFAULT_LUDICROUS_KEYWORDS);

    const trimmed = message.trim();
    if (!trimmed) return settings.fallback;

    if (score(trimmed, ludicrousKeywords) > 0) {
      return settings.ludicrousReply;
    }

    let best: { entry: FaqEntry; score: number } | null = null;
    for (const entry of faq) {
      const s = score(trimmed, entry.keywords);
      if (s > 0 && (!best || s > best.score)) {
        best = { entry, score: s };
      }
    }

    return best ? best.entry.answer : settings.fallback;
  });

export const getBobSettings = createServerFn().handler(async () => {
  return getContent("bob.settings", DEFAULT_SETTINGS);
});

export const getBobContent = createServerFn().handler(async () => {
  return {
    faq: getContent("bob.faq", DEFAULT_FAQ),
    settings: getContent("bob.settings", DEFAULT_SETTINGS),
    ludicrousKeywords: getContent("bob.ludicrousKeywords", DEFAULT_LUDICROUS_KEYWORDS),
  };
});

export const saveBobContent = createServerFn({ method: "POST" })
  .validator((d: { faq: FaqEntry[]; settings: BobSettings; ludicrousKeywords: string[] }) => d)
  .handler(async ({ data }) => {
    setContent("bob.faq", data.faq);
    setContent("bob.settings", data.settings);
    setContent("bob.ludicrousKeywords", data.ludicrousKeywords);
  });
