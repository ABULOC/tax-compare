import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "State Tax Comparison Calculator | Compare State Income Tax and Property Tax",
  description:
    "Compare estimated state income tax and property tax when moving between U.S. states. See your annual tax difference by filing status and home value, plus an investing illustration. Includes a Social Security calculator.",
  alternates: { canonical: "/" },
  openGraph: {
    title:
      "State Tax Comparison Calculator | Compare State Income Tax and Property Tax",
    description:
      "Estimate state income tax and property tax differences between U.S. states and see the long-term impact. Also includes a Social Security calculator.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title:
      "State Tax Comparison Calculator | Compare State Income Tax and Property Tax",
    description:
      "Estimate state income tax and property tax differences between U.S. states and see the long-term impact.",
  },
};

export default function Home() {
  // JSON-LD: WebSite + FAQPage (kept domain-agnostic; canonical URL should be set via metadataBase in app/layout.tsx)
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "True Tax Cost",
    description:
      "Tools to compare state income tax and property tax by state, plus a Social Security calculator.",
    inLanguage: "en-US",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does this calculator include federal income tax?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. It compares state-level income tax and property tax only so you can isolate differences between states.",
        },
      },
      {
        "@type": "Question",
        name: "Are local and city taxes included?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Local income taxes (for example, New York City tax) are not included. Results are intended for state-to-state comparison.",
        },
      },
      {
        "@type": "Question",
        name: "What inputs does the state tax comparison calculator use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Income, home value, filing status, and the two states being compared. The estimate combines state income tax (flat or progressive, depending on the state) and property tax using average effective rates by state.",
        },
      },
      {
        "@type": "Question",
        name: "Is this an official tax calculator or professional tax advice?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Estimates are for planning and comparison only and do not replace professional tax advice.",
        },
      },
    ],
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-10">
      {/* Add JSON-LD near the top of the page */}
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
          True Tax Cost: tax planning tools for U.S. state moves
        </p>

        <h1 className="text-3xl font-bold">
          State Tax Comparison Calculator (Income Tax + Property Tax by State)
        </h1>

        <p className="text-gray-700">
          Estimate how much you pay in <strong>state income tax</strong> and{" "}
          <strong>property tax</strong> when moving between{" "}
          <strong>U.S. states</strong>. This state tax comparison calculator
          estimates your annual difference based on income, home value, and
          filing status, and shows how that gap could grow over time if
          invested.
        </p>

        <nav
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
          aria-label="Primary tools"
        >
          <Link
            href="/compare"
            className="inline-block rounded bg-black px-5 py-3 text-white text-center hover:bg-gray-900"
            aria-label="Open the state tax comparison calculator"
          >
            Compare state taxes
          </Link>

          <Link
            href="/social-security"
            className="inline-block rounded bg-black px-5 py-3 text-white text-center hover:bg-gray-900"
            aria-label="Open the Social Security calculator"
          >
            Estimate Social Security benefits
          </Link>
        </nav>

        <div className="text-sm text-gray-700">
          <div className="font-medium text-gray-900">Popular comparisons</div>

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
            <li>
              <Link href="/compare" className="underline">
                New Jersey vs Florida tax comparison
              </Link>
            </li>
            <li>
              <Link href="/compare" className="underline">
                Washington vs California tax comparison
              </Link>
            </li>
          </ul>
        </div>
      </header>

      <section className="space-y-3" aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="text-xl font-semibold">
          How to compare state taxes
        </h2>

        <ol className="list-decimal pl-5 space-y-1 text-gray-700">
          <li>Enter your income and an estimated home value.</li>
          <li>Select your filing status (Single, MFJ, or HOH).</li>
          <li>Pick your current state and the state you are considering.</li>
          <li>
            Review estimated state income tax, property tax, and the annual
            difference.
          </li>
        </ol>

        <p className="text-gray-700">
          If there is a meaningful annual difference, the calculator also shows
          a simple compounding illustration of what that difference could become
          if invested.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="includes">
        <h2 id="includes" className="text-xl font-semibold">
          What the state tax comparison calculator includes
        </h2>

        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>
            State income tax estimates (progressive brackets or flat rate,
            depending on the state)
          </li>
          <li>Filing status support: Single, Married Filing Jointly, HOH</li>
          <li>Estimated state standard deductions where applicable</li>
          <li>Property tax estimates using average effective rates by state</li>
          <li>Annual difference and a long-term compounding illustration</li>
        </ul>

        <p className="text-gray-700">
          Looking for retirement planning? Use the{" "}
          <Link href="/social-security" className="underline">
            Social Security calculator
          </Link>{" "}
          to estimate benefits using wage indexing and bend points.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="no-income-tax">
        <h2 id="no-income-tax" className="text-xl font-semibold">
          States with no state income tax
        </h2>

        <p className="text-gray-700">
          Several U.S. states do not tax wage income at the state level, which
          can significantly change your overall tax burden depending on where
          you live and your home value.
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
          Use the{" "}
          <Link href="/compare" className="underline">
            state tax comparison calculator
          </Link>{" "}
          to compare no-income-tax states against higher-tax states such as
          California or New York.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="why-it-matters">
        <h2 id="why-it-matters" className="text-xl font-semibold">
          Why state tax differences matter when relocating
        </h2>

        <p className="text-gray-700">
          Moving between states can change your annual tax bill by thousands of
          dollars, especially at higher incomes or home values. This tool helps
          you quantify the difference so you can evaluate the tradeoffs between
          states using a consistent estimate.
        </p>
      </section>

      <section className="space-y-4" aria-labelledby="faq">
        <h2 id="faq" className="text-xl font-semibold">
          Frequently asked questions
        </h2>

        <div className="space-y-3">
          <details className="rounded border p-4">
            <summary className="font-semibold cursor-pointer">
              Does this calculator include federal income tax?
            </summary>
            <p className="mt-2 text-gray-700">
              No. This tool compares state-level income tax and property tax
              only. Federal income tax is excluded so you can isolate
              differences between states.
            </p>
          </details>

          <details className="rounded border p-4">
            <summary className="font-semibold cursor-pointer">
              Are local and city taxes included?
            </summary>
            <p className="mt-2 text-gray-700">
              No. Local income taxes, such as New York City tax, are not
              included. Results are intended for high-level comparison between
              states.
            </p>
          </details>

          <details className="rounded border p-4">
            <summary className="font-semibold cursor-pointer">
              Does the estimate include sales tax?
            </summary>
            <p className="mt-2 text-gray-700">
              Not currently. The estimate focuses on state income tax and
              property tax because those are usually the largest recurring
              differences for many households.
            </p>
          </details>

          <details className="rounded border p-4">
            <summary className="font-semibold cursor-pointer">
              Is this an official tax calculator?
            </summary>
            <p className="mt-2 text-gray-700">
              No. Estimates are for planning and comparison purposes only and do
              not replace professional tax advice.
            </p>
          </details>
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="about">
        <h2 id="about" className="text-xl font-semibold">
          About True Tax Cost
        </h2>

        <p className="text-gray-700">
          True Tax Cost is an independent tool designed to help people
          understand how state tax differences affect their finances when
          relocating. Calculations are based on publicly available state tax
          rules and average property tax rates.
        </p>
      </section>

      <footer className="border-t pt-6">
        <p className="text-sm text-gray-600">
          Estimates are for comparison purposes only and are not tax or
          financial advice. Actual tax liability varies by individual
          circumstances and local rules.
        </p>
      </footer>
    </main>
  );
}
