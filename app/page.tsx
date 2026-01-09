import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "True Tax Cost | State Tax Comparison Calculator + Social Security Value Calculator",
  description:
    "Use two calculators: (1) compare state income tax and property tax when moving between U.S. states, and (2) estimate the lifetime value of Social Security benefits versus investing OASDI contributions.",
  alternates: { canonical: "/" },
  openGraph: {
    title:
      "True Tax Cost | State Tax Comparison Calculator + Social Security Value Calculator",
    description:
      "Compare state taxes (income tax + property tax) and estimate Social Security value versus investing. Two calculators built for relocation and retirement planning.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title:
      "True Tax Cost | State Tax Comparison Calculator + Social Security Value Calculator",
    description:
      "Compare state taxes and estimate Social Security value versus investing. Two calculators for relocation and retirement planning.",
  },
};

export default function Home() {
  // JSON-LD: WebSite + FAQPage (domain-agnostic; set metadataBase in app/layout.tsx for absolute URLs)
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "True Tax Cost",
    description:
      "Two calculators: state tax comparison (income tax + property tax) and Social Security value (benefits vs investing OASDI contributions).",
    inLanguage: "en-US",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does the state tax comparison calculator include?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It estimates state income tax (flat or progressive depending on the state) plus property tax using average effective property tax rates, based on your income, home value, and filing status.",
        },
      },
      {
        "@type": "Question",
        name: "Does the state tax calculator include federal or local taxes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. It is state-only and focuses on state income tax and property tax. Federal income tax and local or city income taxes are not included.",
        },
      },
      {
        "@type": "Question",
        name: "What does the Social Security value calculator estimate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It estimates Social Security taxes paid (employee and employer OASDI) and an estimated benefit at age 67, then compares that benefit to a simple illustration of investing those contributions over time.",
        },
      },
      {
        "@type": "Question",
        name: "Is this official tax or Social Security advice?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. These are educational estimates for comparison and planning. They do not replace professional tax advice or official SSA calculations.",
        },
      },
    ],
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header className="space-y-4">
        <p className="text-sm text-gray-600">
          True Tax Cost: relocation and retirement planning calculators
        </p>

        <h1 className="text-3xl font-bold">
          State Tax Comparison Calculator + Social Security Value Calculator
        </h1>

        <p className="text-gray-700">
          Two tools built for real-world decisions:
          <strong> compare state income tax and property tax</strong> when moving
          between U.S. states, and <strong>estimate Social Security value</strong>{" "}
          by comparing OASDI contributions and projected benefits to a simple
          investing illustration.
        </p>

        <nav
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
          aria-label="Primary calculators"
        >
          <Link
            href="/compare"
            className="inline-block rounded bg-black px-5 py-3 text-white text-center hover:bg-gray-900"
            aria-label="Open the state tax comparison calculator"
          >
            State tax comparison calculator
          </Link>

          <Link
            href="/social-security"
            className="inline-block rounded bg-black px-5 py-3 text-white text-center hover:bg-gray-900"
            aria-label="Open the Social Security value calculator"
          >
            Social Security value calculator
          </Link>
        </nav>
      </header>

      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        aria-label="Calculator summaries"
      >
        <div className="rounded border p-5 space-y-3">
          <h2 className="text-xl font-semibold">Compare state taxes</h2>
          <p className="text-gray-700">
            Estimate how your annual tax bill changes when relocating. This tool
            focuses on <strong>state income tax</strong> and{" "}
            <strong>property tax</strong> using filing status, income, and home
            value.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>State income tax (progressive or flat, depending on the state)</li>
            <li>Property tax using average effective rates by state</li>
            <li>Annual difference plus a long-term compounding illustration</li>
          </ul>
          <div>
            <Link href="/compare" className="underline">
              Open the state tax comparison calculator
            </Link>
          </div>
        </div>

        <div className="rounded border p-5 space-y-3">
          <h2 className="text-xl font-semibold">Estimate Social Security value</h2>
          <p className="text-gray-700">
            Estimate <strong>Social Security taxes paid</strong> (employee and
            employer OASDI) and an <strong>estimated benefit at age 67</strong>,
            then compare that benefit to an investing illustration of those
            contributions.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Historical wage base and OASDI rates where available</li>
            <li>Benefit estimate using wage indexing and bend points</li>
            <li>Illustrative investing comparison (not advice)</li>
          </ul>
          <div>
            <Link href="/social-security" className="underline">
              Open the Social Security value calculator
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="who-its-for">
        <h2 id="who-its-for" className="text-xl font-semibold">
          What these calculators help you decide
        </h2>

        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>
            Relocation planning: compare state tax cost differences before a
            move.
          </li>
          <li>
            Retirement planning: estimate Social Security value and how it
            compares to an investing illustration.
          </li>
          <li>
            Long-term tradeoffs: see how recurring differences can compound over
            decades.
          </li>
        </ul>
      </section>

      <section className="space-y-3" aria-labelledby="popular">
        <h2 id="popular" className="text-xl font-semibold">
          Popular starting points
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="text-sm text-gray-700">
            <div className="font-medium text-gray-900">
              State tax comparisons
            </div>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                <Link href="/compare" className="underline">
                  California vs Texas tax comparison
                </Link>
              </li>
              <li>
                <Link href="/compare" className="underline">
                  New York vs Florida tax comparison
                </Link>
              </li>
              <li>
                <Link href="/compare" className="underline">
                  Illinois vs Tennessee tax comparison
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-sm text-gray-700">
            <div className="font-medium text-gray-900">
              Social Security scenarios
            </div>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                <Link href="/social-security" className="underline">
                  Estimate benefits at age 67 by income and start year
                </Link>
              </li>
              <li>
                <Link href="/social-security" className="underline">
                  Compare lifetime benefits vs investing OASDI contributions
                </Link>
              </li>
              <li>
                <Link href="/social-security" className="underline">
                  See how working years affect your AIME and benefit estimate
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="faq">
        <h2 id="faq" className="text-xl font-semibold">
          Frequently asked questions
        </h2>

        <div className="space-y-3">
          <details className="rounded border p-4">
            <summary className="font-semibold cursor-pointer">
              Does the state tax calculator include federal income tax?
            </summary>
            <p className="mt-2 text-gray-700">
              No. It compares state-level income tax and property tax only.
              Federal income tax is excluded so you can isolate differences
              between states.
            </p>
          </details>

          <details className="rounded border p-4">
            <summary className="font-semibold cursor-pointer">
              Are local or city income taxes included (NYC, etc.)?
            </summary>
            <p className="mt-2 text-gray-700">
              No. Local income taxes are not included. This is intended for
              state-to-state comparison.
            </p>
          </details>

          <details className="rounded border p-4">
            <summary className="font-semibold cursor-pointer">
              Is the Social Security value calculator an SSA estimate?
            </summary>
            <p className="mt-2 text-gray-700">
              No. It is a simplified estimate intended for education and
              comparison. It does not replace official SSA calculations.
            </p>
          </details>

          <details className="rounded border p-4">
            <summary className="font-semibold cursor-pointer">
              Is the investing comparison financial advice?
            </summary>
            <p className="mt-2 text-gray-700">
              No. The investing output is an illustration based on an assumed
              return. It is not a guarantee and not financial advice.
            </p>
          </details>
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="about">
        <h2 id="about" className="text-xl font-semibold">
          About True Tax Cost
        </h2>

        <p className="text-gray-700">
          True Tax Cost is an independent project that helps you quantify two
          common long-term decisions: where to live (state tax differences) and
          how to think about retirement benefits (Social Security value versus an
          investing illustration).
        </p>
      </section>

      <footer className="border-t pt-6">
        <p className="text-sm text-gray-600">
          Estimates are for comparison purposes only and are not tax, legal, or
          financial advice. Actual tax liability and Social Security benefits
          vary by individual circumstances and rules.
        </p>
      </footer>
    </main>
  );
}
