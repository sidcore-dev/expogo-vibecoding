export type Difficulty = "5-Minute DIY" | "Weekend Project" | "Call a Pro";

export interface Cause {
  title: string;
  why: string;
  difficulty: Difficulty;
  difficultyReason: string;
  tools: string[];
  diyCost: string;
  proCost: string;
}

export interface Diagnosis {
  category: string;
  title: string;
  causes: Cause[];
  redFlags: string[];
}

interface Profile {
  keywords: string[];
  diagnosis: Diagnosis;
}

const PROFILES: Profile[] = [
  {
    keywords: ["faucet", "drip", "tap", "leaking sink", "leaky faucet"],
    diagnosis: {
      category: "Plumbing",
      title: "Dripping or Leaking Faucet",
      redFlags: [
        "Water is pooling near outlets or electrical wiring",
        "You smell gas anywhere near the water shutoff",
        "The shutoff valve won't close and water won't stop",
      ],
      causes: [
        {
          title: "Loose retaining nut or worn seat washer",
          why: "The most common cause of a slow drip — the packing nut or seat washer that seals the spout has simply loosened or worn thin over time.",
          difficulty: "5-Minute DIY",
          difficultyReason: "Usually just needs tightening or a $3 washer swap with basic tools.",
          tools: ["adjustable wrench", "plumber's tape", "faucet washer kit"],
          diyCost: "$5–$15",
          proCost: "$100–$180",
        },
        {
          title: "Worn-out valve cartridge",
          why: "Modern faucets use a cartridge to control flow and temperature; the rubber seals inside degrade after years of use and start letting water past.",
          difficulty: "Weekend Project",
          difficultyReason: "Requires shutting off water, disassembling the handle, and matching the exact cartridge model.",
          tools: ["faucet cartridge (model-specific)", "cartridge puller tool", "adjustable wrench"],
          diyCost: "$15–$35",
          proCost: "$150–$250",
        },
        {
          title: "Corroded supply line or valve body",
          why: "In older homes, mineral buildup or corrosion inside the valve body itself can cause a drip that no washer or cartridge will fix.",
          difficulty: "Call a Pro",
          difficultyReason: "May require replacing the faucet or supply lines — mistakes here risk a bigger leak.",
          tools: [],
          diyCost: "N/A",
          proCost: "$180–$350",
        },
      ],
    },
  },
  {
    keywords: ["outlet", "gfci", "no power", "socket", "receptacle"],
    diagnosis: {
      category: "Electrical",
      title: "Outlet Not Working",
      redFlags: [
        "Any burning smell, scorch marks, or a warm outlet cover",
        "Sparking when you plug something in",
        "It's a kitchen, bathroom, or outdoor outlet near water",
        "The breaker trips again immediately after you reset it",
      ],
      causes: [
        {
          title: "Tripped GFCI outlet upstream",
          why: "One GFCI outlet often protects several others on the same circuit — a trip anywhere on that chain kills power downstream.",
          difficulty: "5-Minute DIY",
          difficultyReason: "Just press 'reset' on every GFCI outlet in the kitchen, bathroom, and garage.",
          tools: [],
          diyCost: "$0",
          proCost: "$90–$150",
        },
        {
          title: "Tripped breaker or blown fuse",
          why: "An overloaded circuit or a fault can flip the breaker in your panel, cutting power to the whole run.",
          difficulty: "5-Minute DIY",
          difficultyReason: "Check the panel, flip the breaker fully off then on, verify with a tester.",
          tools: ["voltage tester"],
          diyCost: "$10–$15",
          proCost: "$90–$150",
        },
        {
          title: "Loose or burnt wiring connection",
          why: "Backstab connections and old wire nuts can loosen or scorch, breaking the circuit inside the wall.",
          difficulty: "Call a Pro",
          difficultyReason: "Involves opening the box and working live wiring — not a DIY-safe repair.",
          tools: [],
          diyCost: "N/A",
          proCost: "$150–$350",
        },
      ],
    },
  },
  {
    keywords: ["dryer", "clothes stay wet", "not drying", "laundry"],
    diagnosis: {
      category: "Appliance",
      title: "Dryer Running but Clothes Stay Wet",
      redFlags: [
        "Any burning smell coming from the dryer",
        "The vent hose is crushed, disconnected, or packed with lint",
        "The dryer trips the breaker when running",
      ],
      causes: [
        {
          title: "Clogged lint trap or exhaust vent",
          why: "A blocked vent is the #1 cause — it traps hot moist air inside the drum instead of exhausting it outside.",
          difficulty: "5-Minute DIY",
          difficultyReason: "Pull the lint screen, then run a flexible brush through the vent hose.",
          tools: ["dryer vent cleaning brush kit"],
          diyCost: "$15–$25",
          proCost: "$100–$200",
        },
        {
          title: "Worn or broken drive belt",
          why: "If the belt is slipping or snapped, the drum barely turns, so clothes never tumble through the airflow evenly.",
          difficulty: "Weekend Project",
          difficultyReason: "Needs the cabinet opened and a model-specific replacement belt.",
          tools: ["dryer drive belt (model-specific)", "nut driver set"],
          diyCost: "$20–$40",
          proCost: "$150–$250",
        },
        {
          title: "Failed heating element or thermal fuse",
          why: "If nothing is warm at all, the heating element or a safety thermal fuse has likely failed.",
          difficulty: "Call a Pro",
          difficultyReason: "Requires testing 240V components — verify with a multimeter and consider a technician.",
          tools: ["multimeter"],
          diyCost: "$30–$60",
          proCost: "$150–$300",
        },
      ],
    },
  },
  {
    keywords: ["ceiling fan", "fan wobbl", "fan shak"],
    diagnosis: {
      category: "Mechanical / HVAC",
      title: "Ceiling Fan Wobbling on High",
      redFlags: [
        "The fan wobbles badly enough that it could fall",
        "You see exposed or frayed wiring near the mount",
        "The electrical box isn't rated to support a ceiling fan",
      ],
      causes: [
        {
          title: "Blades out of balance",
          why: "Tiny differences in blade weight or warping get amplified at high speed, causing a visible wobble.",
          difficulty: "5-Minute DIY",
          difficultyReason: "A balancing kit clips weights onto the lightest blade until it's smooth.",
          tools: ["ceiling fan balancing kit"],
          diyCost: "$8–$15",
          proCost: "$80–$150",
        },
        {
          title: "Loose mounting screws or bracket",
          why: "Vibration over time loosens the blade screws or the bracket connecting the fan to the downrod.",
          difficulty: "5-Minute DIY",
          difficultyReason: "Just re-tighten every visible screw with the fan off and blades still.",
          tools: ["screwdriver set"],
          diyCost: "$0–$10",
          proCost: "$80–$150",
        },
        {
          title: "Warped blade or bent downrod",
          why: "A physically bent downrod or warped blade can't be balanced away and needs replacing.",
          difficulty: "Weekend Project",
          difficultyReason: "Requires removing blades or the downrod and sourcing a matching replacement part.",
          tools: ["replacement fan blades", "adjustable wrench"],
          diyCost: "$20–$50",
          proCost: "$120–$220",
        },
      ],
    },
  },
  {
    keywords: ["drywall", "hole in wall", "doorknob hole", "wall damage"],
    diagnosis: {
      category: "Drywall / Walls",
      title: "Small Hole in Drywall",
      redFlags: [
        "The hole is near visible wiring or a pipe",
        "The wall feels soft, damp, or shows mold or discoloration",
        "The damage is near a corner, doorframe, or looks structural",
      ],
      causes: [
        {
          title: "Minor impact hole under 2 inches",
          why: "A doorknob or small bump typically only punches through the drywall paper and gypsum core, not the framing.",
          difficulty: "5-Minute DIY",
          difficultyReason: "A self-adhesive mesh patch and spackle handle this in one sitting.",
          tools: ["self-adhesive drywall patch", "spackling compound", "putty knife"],
          diyCost: "$8–$15",
          proCost: "$100–$180",
        },
        {
          title: "Hole larger than a fist",
          why: "Bigger holes need rigid backing behind the patch so the repair doesn't just crack out again.",
          difficulty: "Weekend Project",
          difficultyReason: "Involves cutting a patch, adding backing, taping seams, and multiple coats of compound.",
          tools: ["drywall patch kit", "joint compound", "mesh tape", "sanding sponge"],
          diyCost: "$15–$30",
          proCost: "$150–$250",
        },
        {
          title: "Damage near an outlet, corner, or frame",
          why: "Repairs near electrical boxes or corner bead need extra care to keep edges straight and code-safe.",
          difficulty: "Weekend Project",
          difficultyReason: "Doable solo, but corner bead and matching texture take patience to get invisible.",
          tools: ["drywall repair clips", "joint compound", "corner bead"],
          diyCost: "$20–$40",
          proCost: "$180–$300",
        },
      ],
    },
  },
  {
    keywords: ["toilet", "running toilet", "won't stop running", "flush"],
    diagnosis: {
      category: "Plumbing",
      title: "Toilet Runs Constantly",
      redFlags: [
        "Water is overflowing or spraying from the tank",
        "The shutoff valve behind the toilet won't close",
      ],
      causes: [
        {
          title: "Flapper not sealing",
          why: "The rubber flapper that seals the tank to the bowl warps over time and lets water leak through, triggering a refill loop.",
          difficulty: "5-Minute DIY",
          difficultyReason: "Pop off the old flapper and clip on a universal replacement in minutes.",
          tools: ["universal toilet flapper"],
          diyCost: "$6–$12",
          proCost: "$90–$150",
        },
        {
          title: "Fill valve out of adjustment",
          why: "If the fill valve is set too high, water constantly trickles into the overflow tube.",
          difficulty: "5-Minute DIY",
          difficultyReason: "Adjust the float height or clip per the valve's instructions.",
          tools: [],
          diyCost: "$0",
          proCost: "$90–$150",
        },
        {
          title: "Worn fill valve assembly",
          why: "After years of use the whole fill valve can degrade internally and needs full replacement.",
          difficulty: "Weekend Project",
          difficultyReason: "Requires draining the tank and swapping the valve — straightforward with a kit.",
          tools: ["toilet fill valve kit", "adjustable wrench"],
          diyCost: "$15–$25",
          proCost: "$120–$200",
        },
      ],
    },
  },
  {
    keywords: ["ac", "air condition", "not cooling", "thermostat", "hvac", "furnace"],
    diagnosis: {
      category: "Mechanical / HVAC",
      title: "AC or Heat Not Working Right",
      redFlags: [
        "You smell burning or gas near the furnace",
        "The outdoor unit is making loud grinding or screeching noises",
        "Ice is visibly building up on the refrigerant lines",
      ],
      causes: [
        {
          title: "Dirty air filter restricting airflow",
          why: "A clogged filter starves the system of airflow, so it runs constantly without actually cooling or heating the space.",
          difficulty: "5-Minute DIY",
          difficultyReason: "Slide out the old filter and drop in a new one matching the printed size.",
          tools: ["HVAC air filter (correct size)"],
          diyCost: "$10–$25",
          proCost: "$100–$150",
        },
        {
          title: "Thermostat miscalibrated or dead batteries",
          why: "A thermostat reading the wrong temperature — or losing power — will stop calling for heat or cooling correctly.",
          difficulty: "5-Minute DIY",
          difficultyReason: "Swap batteries and check the settings/schedule first.",
          tools: ["thermostat batteries"],
          diyCost: "$5–$10",
          proCost: "$100–$180",
        },
        {
          title: "Low refrigerant or failing compressor",
          why: "If airflow and thermostat check out, the system itself may have a refrigerant leak or a failing compressor.",
          difficulty: "Call a Pro",
          difficultyReason: "Refrigerant handling requires EPA certification and specialized gauges.",
          tools: [],
          diyCost: "N/A",
          proCost: "$250–$800",
        },
      ],
    },
  },
];

const GENERIC: Diagnosis = {
  category: "General Repair",
  title: "Household Issue",
  redFlags: [
    "You see sparking, smoke, or smell something burning",
    "There's active water leaking near anything electrical",
    "The issue involves gas lines or a strong gas smell",
  ],
  causes: [
    {
      title: "A loose connection or simple wear",
      why: "Most household problems start as something small — a loose fastener, a worn seal, or a part that's simply due for cleaning.",
      difficulty: "5-Minute DIY",
      difficultyReason: "Worth a quick visual check and re-tightening before assuming anything's broken.",
      tools: ["multi-bit screwdriver", "flashlight"],
      diyCost: "$0–$15",
      proCost: "$90–$150",
    },
    {
      title: "A worn component that needs replacing",
      why: "If a quick check doesn't fix it, the part that does the work (a seal, belt, filter, or cartridge) has likely worn out from normal use.",
      difficulty: "Weekend Project",
      difficultyReason: "Identifying the exact replacement part is the hard part — the swap itself is usually straightforward.",
      tools: ["adjustable wrench", "replacement part (model-specific)"],
      diyCost: "$15–$40",
      proCost: "$150–$250",
    },
    {
      title: "A deeper underlying issue",
      why: "If the problem keeps coming back, there may be a root cause — wiring, structural, or a system-level fault — that a quick fix won't solve.",
      difficulty: "Call a Pro",
      difficultyReason: "Diagnosing root-cause issues usually needs specialized tools or licensing.",
      tools: [],
      diyCost: "N/A",
      proCost: "$150–$400",
    },
  ],
};

function matchProfile(problem: string): Diagnosis {
  const text = problem.toLowerCase();
  let best: { profile: Profile; score: number } | null = null;

  for (const profile of PROFILES) {
    const score = profile.keywords.reduce(
      (acc, kw) => (text.includes(kw) ? acc + 1 : acc),
      0,
    );
    if (score > 0 && (!best || score > best.score)) {
      best = { profile, score };
    }
  }

  return best ? best.profile.diagnosis : GENERIC;
}

export async function diagnoseProblem({
  data,
}: {
  data: { problem: string };
}): Promise<Diagnosis> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  return matchProfile(data.problem);
}
