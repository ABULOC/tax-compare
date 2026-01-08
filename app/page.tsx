import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-10">
      {/* Hero */}
      <header className="space-y-4">
        <h1 className="text-3xl font-bold">
          State Tax Comparison Calculator
        </h1>

        <p className="text-gray-700">
          Compare how much you actually pay in <strong>state income tax</strong>{" "}
          and <strong>property tax</strong> when moving between{" "}
          <strong>U.S. states</strong>. This state tax comparison calculator
          estimates your annual tax difference and shows how that gap could grow
          over time if invested.
        </p>

        <div className="pt-1">
<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
  <Link
    href="/compare"
    className="inline-block rounded bg-black px-5 py-3 text-white text-center"
  >
    Compare state taxes
  </Link>

  <Link
    href="/social-security"
    className="inline-block rounded border border-gray-300 px-5 py-3 text-gray-900 text-center hover:bg-gray-50"
  >
    Social Security calculator
  </Link>
</div>



          <div className="mt-3 text-sm text-gray-700">
            <div className="font-medium text-gray-900">
              Popular comparisons
            </div>

            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                <Link
                  href="/compare"
                  className="underline"
                >
                  California vs Texas tax comparison
                </Link>
              </li>
              <li>
                <Link
                  href="/compare"
                  className="underline"
                >
                  New York vs Florida tax comparison
                </Link>
              </li>
              <li>
                <Link
                  href="/compare"
                  className="underline"
                >
                  Illinois vs Tennessee tax comparison
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* What it includes */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          What this calculator includes
        </h2>

        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>
            State income tax (progressive brackets or flat rate, depending on
            the state)
          </li>
          <li>
            Filing status support (Single, Married Filing Jointly, Head of
            Household)
          </li>
          <li>Estimated state standard deductions where applicable</li>
          <li>
            Property tax estimates using average effective rates by state
          </li>
          <li>
            Annual tax difference and a long-term compounding illustration
          </li>
        </ul>
      </section>

      {/* No income tax section */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          States with no state income tax
        </h2>

        <p className="text-gray-700">
          Several U.S. states do not tax wage income at the state level, which
          can significantly change your overall tax burden depending on where
          you live.
        </p>

        <p className="text-gray-700">
          States with no state income tax include{" "}
          <strong>
            Florida, Texas, Tennessee, Washington, Nevada, South Dakota,
            Wyoming, and Alaska
          </strong>
          .
        </p>

        <p className="text-gray-700">
          Use the calculator to compare no-income-tax states against higher-tax
          states like California or New York.
        </p>
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

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          Frequently asked questions
        </h2>

        <div className="space-y-2">
          <h3 className="font-semibold">
            Does this calculator include federal income tax?
          </h3>
          <p className="text-gray-700">
            No. This tool compares state-level income and property taxes only.
            Federal income tax is excluded so you can isolate differences
            between states.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">
            Are local and city taxes included?
          </h3>
          <p className="text-gray-700">
            No. Local income taxes, such as New York City tax, are not included.
            Results are intended for high-level comparison between states.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">
            Is this an official tax calculator?
          </h3>
          <p className="text-gray-700">
            No. Estimates are for planning and comparison purposes only and do
            not replace professional tax advice.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          About this project
        </h2>

        <p className="text-gray-700">
          True Tax Cost is an independent tool designed to help people
          understand how state tax differences affect their finances when
          relocating. Calculations are based on publicly available state tax
          rules and average property tax rates.
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
