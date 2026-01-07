import TaxCompareCalculator, {
  StateKey,
  STATE_TAX_RULES,
} from "../tax-compare-calculator";


function slugToStateKey(slug: string): StateKey | null {
const map: Record<string, StateKey> = {
  california: "CA",
  texas: "TX",
  florida: "FL",
  illinois: "IL",
  "new-york": "NY",
  newyork: "NY",
  ny: "NY",
  ca: "CA",
  tx: "TX",
  fl: "FL",
  il: "IL",
};

  return map[slug] ?? null;
}

function keyToName(k: StateKey) {
  return STATE_TAX_RULES[k].name;
}


export default function ComparePairPage({ params }: { params: { pair: string } }) {
  // expected: "texas-vs-florida"
  const parts = params.pair.split("-vs-");
  const aSlug = parts[0] ?? "";
  const bSlug = parts[1] ?? "";

  const stateA = slugToStateKey(aSlug) ?? "TX";
  const stateB = slugToStateKey(bSlug) ?? "CA";

  const title = `${keyToName(stateA)} vs ${keyToName(stateB)} Taxes`;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-gray-700 mb-6">
        Quick estimate comparing income and property tax between {keyToName(stateA)} and {keyToName(stateB)}.
      </p>

      <TaxCompareCalculator initialStateA={stateA} initialStateB={stateB} />

      <p className="text-sm text-gray-600 mt-6">
        Estimates only. This does not include deductions, credits, or local taxes.
      </p>
    </main>
  );
}
