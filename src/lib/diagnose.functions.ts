import { createServerFn } from "@tanstack/react-start";
import { getContent, setContent } from "@/lib/db.server";

export type Difficulty = "5-Minute DIY" | "Weekend Project" | "Call a Pro";

export interface Cause {
  title: string;
  why: string;
  difficulty: Difficulty;
  difficultyReason: string;
  tools: string[];
  diyCost: string;
  proCost: string;
  steps: string[];
  /** Set to false when no real tutorial video applies (e.g. "call a licensed pro" causes with no DIY steps to film). Defaults to true when omitted. */
  hasVideo?: boolean;
}

export interface Diagnosis {
  category: string;
  title: string;
  causes: Cause[];
  redFlags: string[];
}

export interface Profile {
  keywords: string[];
  diagnosis: Diagnosis;
}

const DEFAULT_PROFILES: Profile[] = [
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
          why: "A small part inside the handle has loosened or worn out, letting water leak through.",
          difficulty: "5-Minute DIY",
          difficultyReason: "Usually just needs tightening or a cheap washer swap.",
          tools: ["adjustable wrench", "plumber's tape", "faucet washer kit"],
          diyCost: "$5–$15",
          proCost: "$100–$180",
          steps: [
            "Turn off the water supply valves under the sink.",
            "Open the faucet to release any remaining pressure in the line.",
            "Remove the handle and unscrew the retaining nut with an adjustable wrench.",
            "Inspect the washer — if it's cracked or flattened, swap it for a new one from the kit.",
            "Reassemble, turn the water back on, and check for drips.",
          ],
        },
        {
          title: "Worn-out valve cartridge",
          why: "The cartridge controls water flow inside the faucet. Its seals wear out over time and start letting water through.",
          difficulty: "Weekend Project",
          difficultyReason: "You'll shut off the water and open the handle, but the part itself is easy to swap.",
          tools: ["faucet cartridge (model-specific)", "cartridge puller tool", "adjustable wrench"],
          diyCost: "$15–$35",
          proCost: "$150–$250",
          steps: [
            "Shut off the water supply and open the faucet to drain the lines.",
            "Pop off the decorative cap and remove the handle screw underneath.",
            "Pull the handle off, then use a cartridge puller to remove the old cartridge.",
            "Bring the old cartridge (or its model number) to the hardware store for an exact match.",
            "Insert the new cartridge, reattach the handle, and turn the water back on.",
          ],
        },
        {
          title: "Corroded supply line or valve body",
          why: "In older homes, rust or mineral buildup inside the faucet itself can cause a drip no small part will fix.",
          difficulty: "Call a Pro",
          difficultyReason: "Usually means replacing the faucet or pipes — best left to a plumber.",
          tools: [],
          diyCost: "N/A",
          proCost: "$180–$350",
          steps: [
            "Shut off the water supply to limit further damage.",
            "Take photos of the faucet model and valve body to show the plumber.",
            "Schedule a licensed plumber to inspect and likely replace the faucet or supply lines.",
          ],
          hasVideo: false,
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
          why: "One GFCI outlet often protects several others on the same circuit. If it trips, the rest lose power too.",
          difficulty: "5-Minute DIY",
          difficultyReason: "Just press the reset button — no tools needed.",
          tools: [],
          diyCost: "$0",
          proCost: "$90–$150",
          steps: [
            "Find every GFCI outlet in the kitchen, bathrooms, garage, and outdoors.",
            "Press the small 'Reset' button firmly on each one.",
            "Plug in a lamp or phone charger at the dead outlet to confirm power is back.",
          ],
        },
        {
          title: "Tripped breaker or blown fuse",
          why: "Too much power draw or a small fault can flip the breaker, cutting power to that outlet.",
          difficulty: "5-Minute DIY",
          difficultyReason: "Flip the breaker off then on, then test with a device.",
          tools: ["voltage tester"],
          diyCost: "$10–$15",
          proCost: "$90–$150",
          steps: [
            "Open your electrical panel and look for a breaker sitting in the middle position or fully off.",
            "Switch it firmly all the way to OFF, then back to ON.",
            "Test the outlet with a voltage tester or a plugged-in device.",
            "If it trips again immediately, stop and call an electrician — don't keep resetting it.",
          ],
        },
        {
          title: "Loose or burnt wiring connection",
          why: "The wiring inside the wall may have loosened or burned over time, breaking the connection.",
          difficulty: "Call a Pro",
          difficultyReason: "This means opening the wall and working with live wires — not safe to DIY.",
          tools: [],
          diyCost: "N/A",
          proCost: "$150–$350",
          steps: [
            "Turn off the breaker for that circuit as a precaution.",
            "Avoid using the outlet until it's been inspected.",
            "Call a licensed electrician to open the box and check the wiring.",
          ],
          hasVideo: false,
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
          why: "A blocked vent traps hot, damp air inside the dryer instead of letting it escape outside.",
          difficulty: "5-Minute DIY",
          difficultyReason: "Just clean the lint screen and vent hose — no special skills needed.",
          tools: ["dryer vent cleaning brush kit"],
          diyCost: "$15–$25",
          proCost: "$100–$200",
          steps: [
            "Unplug the dryer for safety.",
            "Remove and clean the lint trap screen by hand.",
            "Disconnect the exhaust hose from the back of the dryer.",
            "Run a flexible vent brush through the hose and the wall duct to clear buildup.",
            "Reconnect everything and run a test cycle to confirm airflow.",
          ],
        },
        {
          title: "Worn or broken drive belt",
          why: "If the belt that spins the drum is worn or snapped, clothes won't tumble through the warm air properly.",
          difficulty: "Weekend Project",
          difficultyReason: "You'll need to open the dryer and find the exact replacement belt.",
          tools: ["dryer drive belt (model-specific)", "nut driver set"],
          diyCost: "$20–$40",
          proCost: "$150–$250",
          steps: [
            "Unplug the dryer and pull it away from the wall.",
            "Remove the top and front panels per your model's service guide.",
            "Locate the belt around the drum and idler pulley — check for fraying or slack.",
            "Route the new belt exactly as the old one was, following the diagram inside the cabinet.",
            "Reassemble the panels and run a test cycle.",
          ],
        },
        {
          title: "Failed heating element or thermal fuse",
          why: "If the dryer isn't heating at all, the part that makes heat has likely burned out.",
          difficulty: "Call a Pro",
          difficultyReason: "Testing electrical parts safely usually calls for a technician.",
          tools: ["multimeter"],
          diyCost: "$30–$60",
          proCost: "$150–$300",
          steps: [
            "Unplug the dryer and locate the heating element housing for your model.",
            "Use a multimeter to test the element and thermal fuse for continuity.",
            "Note the part number if either component reads open or shows no continuity.",
            "Replace the faulty part yourself if comfortable, or call an appliance technician.",
          ],
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
          why: "Tiny differences in blade weight get exaggerated at high speed, causing a wobble.",
          difficulty: "5-Minute DIY",
          difficultyReason: "A balancing kit clips onto a blade until the wobble stops — no tools needed.",
          tools: ["ceiling fan balancing kit"],
          diyCost: "$8–$15",
          proCost: "$80–$150",
          steps: [
            "Turn off the fan and let it come to a complete stop.",
            "Clip the balancing weight halfway along one blade using the supplied clip.",
            "Turn the fan on high and observe how much it wobbles.",
            "Move the clip closer to the hub, farther out, or to a different blade until the wobble minimizes.",
            "Stick the weight down permanently with its adhesive backing once balanced.",
          ],
        },
        {
          title: "Loose mounting screws or bracket",
          why: "Vibration over time can loosen the screws holding the blades or fan in place.",
          difficulty: "5-Minute DIY",
          difficultyReason: "Just tighten the visible screws with a screwdriver.",
          tools: ["screwdriver set"],
          diyCost: "$0–$10",
          proCost: "$80–$150",
          steps: [
            "Turn off the fan and wait for the blades to stop completely.",
            "Tighten each blade's mounting screws.",
            "Check and tighten the screws connecting the fan body to the mounting bracket.",
            "Turn the fan back on to confirm the wobble is gone.",
          ],
        },
        {
          title: "Warped blade or bent downrod",
          why: "A bent rod or warped blade can't be fixed by balancing — it needs replacing.",
          difficulty: "Weekend Project",
          difficultyReason: "You'll need to remove parts and order an exact replacement.",
          tools: ["replacement fan blades", "adjustable wrench"],
          diyCost: "$20–$50",
          proCost: "$120–$220",
          steps: [
            "Turn off power to the fan at the breaker.",
            "Remove the blades and lay them on a flat surface to check for warping.",
            "Check the downrod for any visible bend.",
            "Order a matching replacement blade set or downrod using your fan's model number.",
            "Reinstall and test on low speed before running it on high.",
          ],
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
          why: "A small bump or doorknob usually only punches through the outer layer, not the wall itself.",
          difficulty: "5-Minute DIY",
          difficultyReason: "A patch and some spackle fix this in one sitting.",
          tools: ["self-adhesive drywall patch", "spackling compound", "putty knife"],
          diyCost: "$8–$15",
          proCost: "$100–$180",
          steps: [
            "Clean any loose debris out of the hole.",
            "Press the self-adhesive mesh patch over the hole, centered.",
            "Spread a thin layer of spackling compound over the patch with a putty knife.",
            "Let it dry fully, then sand smooth.",
            "Touch up with paint to match the wall.",
          ],
        },
        {
          title: "Hole larger than a fist",
          why: "Bigger holes need something solid behind the patch so it doesn't just crack out again.",
          difficulty: "Weekend Project",
          difficultyReason: "Takes a few steps — cutting, patching, and a couple coats of compound.",
          tools: ["drywall patch kit", "joint compound", "mesh tape", "sanding sponge"],
          diyCost: "$15–$30",
          proCost: "$150–$250",
          steps: [
            "Cut the damaged area into a clean square or rectangle.",
            "Insert backing (a scrap of wood or a drywall repair clip) behind the opening.",
            "Cut a drywall patch to size and screw or glue it to the backing.",
            "Apply mesh tape over the seams, then joint compound in thin coats, letting each dry.",
            "Sand smooth between coats, then prime and paint.",
          ],
        },
        {
          title: "Damage near an outlet, corner, or frame",
          why: "Repairs near outlets or corners take extra care to keep edges straight and safe.",
          difficulty: "Weekend Project",
          difficultyReason: "Doable yourself, but getting it smooth and safe takes patience.",
          tools: ["drywall repair clips", "joint compound", "corner bead"],
          diyCost: "$20–$40",
          proCost: "$180–$300",
          steps: [
            "Turn off power to any nearby outlet at the breaker before working near it.",
            "Cut back the damaged drywall to expose solid, undamaged edges.",
            "Install new corner bead if the damage is on a corner.",
            "Patch, tape, and apply joint compound in thin coats, feathering the edges wide.",
            "Sand, prime, and paint to blend with the surrounding wall.",
          ],
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
          why: "The rubber flapper that seals the tank has worn out, letting water leak into the bowl.",
          difficulty: "5-Minute DIY",
          difficultyReason: "Snap in a new flapper — quick and easy.",
          tools: ["universal toilet flapper"],
          diyCost: "$6–$12",
          proCost: "$90–$150",
          steps: [
            "Remove the tank lid and locate the flapper at the bottom of the tank.",
            "Unhook the old flapper from the flush valve pegs and the flush chain.",
            "Attach the new universal flapper and connect the chain, leaving a little slack.",
            "Flush to test, and shorten or lengthen the chain if it doesn't seal properly.",
          ],
        },
        {
          title: "Fill valve out of adjustment",
          why: "If the fill valve is set too high, water keeps trickling into the overflow tube.",
          difficulty: "5-Minute DIY",
          difficultyReason: "Just adjust the float — no parts needed.",
          tools: [],
          diyCost: "$0",
          proCost: "$90–$150",
          steps: [
            "Remove the tank lid.",
            "Locate the float and fill valve.",
            "Lower the float (or adjust its clip) so the water shuts off below the overflow tube.",
            "Flush and confirm the water stops refilling once it reaches the correct level.",
          ],
        },
        {
          title: "Worn fill valve assembly",
          why: "After years of use, the whole fill valve can wear out inside and needs replacing.",
          difficulty: "Weekend Project",
          difficultyReason: "Straightforward with a repair kit, but you'll need to drain the tank first.",
          tools: ["toilet fill valve kit", "adjustable wrench"],
          diyCost: "$15–$25",
          proCost: "$120–$200",
          steps: [
            "Turn off the water supply valve behind the toilet and flush to drain the tank.",
            "Disconnect the water supply line and unscrew the old fill valve from the tank base.",
            "Install the new fill valve kit, following its height adjustment instructions.",
            "Reconnect the water line, turn the water back on, and check for leaks.",
          ],
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
          why: "A clogged filter blocks airflow, so the system runs without actually cooling or heating the house.",
          difficulty: "5-Minute DIY",
          difficultyReason: "Just swap in a new filter — no tools needed.",
          tools: ["HVAC air filter (correct size)"],
          diyCost: "$10–$25",
          proCost: "$100–$150",
          steps: [
            "Locate the filter slot — usually a return air vent or near the air handler.",
            "Note the size printed on the frame of the old filter.",
            "Slide out the old filter and insert the new one facing the correct airflow direction (arrow toward the unit).",
            "Run the system and confirm airflow improves at the vents.",
          ],
        },
        {
          title: "Thermostat miscalibrated or dead batteries",
          why: "A thermostat with dead batteries or the wrong settings won't tell the system to turn on.",
          difficulty: "5-Minute DIY",
          difficultyReason: "Swap the batteries and check the settings.",
          tools: ["thermostat batteries"],
          diyCost: "$5–$10",
          proCost: "$100–$180",
          steps: [
            "Open the thermostat and replace the batteries if it uses them.",
            "Check that the mode is set correctly (cool/heat) and no schedule is overriding your setting.",
            "Set the temperature a few degrees past the current room temperature and listen for the system to kick on.",
          ],
        },
        {
          title: "Low refrigerant or failing compressor",
          why: "If the filter and thermostat check out, the system itself may be low on refrigerant or failing.",
          difficulty: "Call a Pro",
          difficultyReason: "This needs special equipment and certification — call a pro.",
          tools: [],
          diyCost: "N/A",
          proCost: "$250–$800",
          steps: [
            "Turn off the system to avoid further strain on the compressor.",
            "Check for ice on the refrigerant lines or outdoor unit.",
            "Call an EPA-certified HVAC technician to check refrigerant levels and the compressor.",
          ],
          hasVideo: false,
        },
      ],
    },
  },
];

const DEFAULT_GENERIC: Diagnosis = {
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
      why: "Most problems start small — something loose, worn out, or just dirty.",
      difficulty: "5-Minute DIY",
      difficultyReason: "Worth a quick look before assuming it's a bigger problem.",
      tools: ["multi-bit screwdriver", "flashlight"],
      diyCost: "$0–$15",
      proCost: "$90–$150",
      steps: [
        "Visually inspect the item for anything obviously loose, disconnected, or dirty.",
        "Re-tighten any visible screws, nuts, or fasteners.",
        "Clean off any dust, debris, or buildup that could be interfering.",
        "Test to see if the issue is resolved.",
      ],
    },
    {
      title: "A worn component that needs replacing",
      why: "If a quick check doesn't fix it, a specific part has likely worn out and needs swapping.",
      difficulty: "Weekend Project",
      difficultyReason: "Finding the right part is the hard part — installing it is usually easy.",
      tools: ["adjustable wrench", "replacement part (model-specific)"],
      diyCost: "$15–$40",
      proCost: "$150–$250",
      steps: [
        "Identify the specific part that does the work (seal, belt, filter, cartridge, etc.).",
        "Note the brand and model info so you can find an exact replacement.",
        "Order the replacement part.",
        "Swap it in following the manufacturer's instructions, then test.",
      ],
    },
    {
      title: "A deeper underlying issue",
      why: "If the problem keeps coming back, something bigger may be wrong that a quick fix won't solve.",
      difficulty: "Call a Pro",
      difficultyReason: "This needs a professional to properly diagnose.",
      tools: [],
      diyCost: "N/A",
      proCost: "$150–$400",
      steps: [
        "Stop using the item to avoid making things worse.",
        "Document when the issue happens and any patterns you notice.",
        "Contact a licensed professional in the relevant trade for a full diagnosis.",
      ],
      hasVideo: false,
    },
  ],
};

function matchProfile(problem: string, profiles: Profile[], generic: Diagnosis): Diagnosis {
  const text = problem.toLowerCase();
  let best: { profile: Profile; score: number } | null = null;

  for (const profile of profiles) {
    const score = profile.keywords.reduce(
      (acc, kw) => (text.includes(kw) ? acc + 1 : acc),
      0,
    );
    if (score > 0 && (!best || score > best.score)) {
      best = { profile, score };
    }
  }

  return best ? best.profile.diagnosis : generic;
}

export const diagnoseProblem = createServerFn({ method: "POST" })
  .validator((d: { problem: string }) => d)
  .handler(async ({ data }) => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const profiles = getContent("diagnosis.profiles", DEFAULT_PROFILES);
    const generic = getContent("diagnosis.generic", DEFAULT_GENERIC);
    return matchProfile(data.problem, profiles, generic);
  });

export const getDiagnosisContent = createServerFn().handler(async () => {
  return {
    profiles: getContent("diagnosis.profiles", DEFAULT_PROFILES),
    generic: getContent("diagnosis.generic", DEFAULT_GENERIC),
  };
});

export const saveDiagnosisContent = createServerFn({ method: "POST" })
  .validator((d: { profiles: Profile[]; generic: Diagnosis }) => d)
  .handler(async ({ data }) => {
    setContent("diagnosis.profiles", data.profiles);
    setContent("diagnosis.generic", data.generic);
  });
