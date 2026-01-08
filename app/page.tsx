import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Hero */}
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">
          State Tax Comparison Calculator
        </h1>

        <p className="text-gray-700">
          Compare how much you actually pay in <strong>state income tax</strong>{" "}
          and <strong>property tax</strong> when moving between U.S. states. Get
          an estimate of the annual difference and see how that gap could grow
          over time if invested.
        </p>

        <div className="pt-2">
          <Link
            href="/compare"
            className="inline-block rounded bg-black px-5 py-3 text-white"
          >
            Compare state taxes
          </Link>

          <div className="mt-2 text-sm text-gray-600">
            Example scenarios:{" "}
            <Link href="/compare" className="underline">
              California vs Texas
            </Link>
            {" · "}
            <Link href="/compare" className="underline">
              New York vs Florida
            </Link>
            {" · "}
            <Link href="/compare" className="underline">
              Illinois vs Tennessee
            </Link>
          </div>
        </div>
      </header>

      {/* What it includes */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          What this calculator includes
        </h2>

        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>State income tax (progressive brackets or flat rate, depending on the state)</li>
          <li>Filing status support (Single, Married Filing Jointly, Head of Household)</li>
          <li>Estimated state standard deductions where applicable</li>
          <li>Property tax estimates using average effective rates by state</li>
          <li>Annual tax difference and a long-term compounding illustration</li>
        </ul>
      </section>

      {/* Why it matters */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          Why state tax differences matter
        </h2>

        <p className="text-gray-700">
          Moving between states can change your annual tax bill by thousands of
          dollars, especially at higher incomes or home values. This tool helps
          you quantify that difference and understand the potential long-term
          impact.
        </p>
      </section>

      {/* Disclaimer */}
      <section className="border-t pt-6">
        <p className="text-sm text-gray-600">
          Estimates are for comparison purposes only and are not tax or
          financial advice. Actual tax liability varies by individual
          circumstances and local rules.
        </p>
      </section>
    </main>
  );
}
