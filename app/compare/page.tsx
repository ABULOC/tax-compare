// app/compare/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import TaxCompareCalculator from "./tax-compare-calculator";

export const metadata: Metadata = {
  title:
    "State Tax Comparison Calculator (Income + Property Tax) | Estimate Moving Savings",
  description:
    "Compare estimated state income tax and property tax across U.S. states. Enter income, home value, filing status, and two states to see the annual difference and what investing that difference could grow into over time.",
  alternates: {
    // CHANGE: was /calculator
    canonical: "/compare",
  },
  openGraph: {
    title: "State Tax Comparison Calculator",
    description:
      "Estimate and compare state income tax + property tax between two states, then project the long-term impact of investing the annual difference.",
    // CHANGE: was /calculator
    url: "/compare",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "State Tax Comparison Calculator",
    description:
      "Compare estimated state income tax + property tax and project the long-term impact of investing the difference.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

function jsonLd() {
  // CHANGE: use your real domain and /compare
  const url = "https://truetaxcost.com/compare";

  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "State Tax Comparison Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url,
    description:
      "A calculator that estimates and compares annual state income tax and property tax between two U.S. states and projects the potential long-term impact of investing the annual difference.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What taxes does this calculator include?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "It estimates annual state income tax (state-only) and annual residential property tax using statewide effective property tax rates. It does not include federal income tax, sales tax, or local income taxes.",
        },
      },
      {
        "@type": "Question",
        name: "How is state income tax estimated?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "If a state has progressive brackets, the calculator applies marginal rates by filing status. If a state uses a flat rate, it applies that rate. Where provided in the model, a state standard deduction is subtracted from income to estimate taxable income. Some states also apply high-income surtaxes.",
        },
      },
      {
        "@type": "Question",
        name: "How is property tax estimated?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Property tax is estimated by multiplying your entered home value by an average effective residential property tax rate for the selected state. Actual bills vary widely by county, city, exemptions, and assessment rules.",
        },
      },
      {
        "@type": "Question",
        name: "What does the investment projection mean?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "It takes the annual tax difference between the two states, invests it monthly, and compounds monthly using a long-term annual return assumption (currently 10%). The projection is illustrative only and not financial advice.",
        },
      },
      {
        "@type": "Question",
        name: "Do state tax rules change over time?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. State tax brackets, rates, deductions, surtaxes, and property tax rules change frequently due to new legislation and annual adjustments. This calculator uses a recent snapshot for comparison purposes, but users should always verify results with official state sources or a tax professional.",
        },
      },
    ],
  };

  return [softwareApp, faq];
}

export default function ComparePage() {
  const structuredData = jsonLd();

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="space-y-3">
        <h1 className="text-3xl font-bold">State Tax Comparison Calculator</h1>

        <p className="text-gray-700">
          Compare estimated <strong>state income tax</strong> and{" "}
          <strong>property tax</strong> between two states, then see how the
          annual difference could compound if invested over time.
        </p>

        <nav aria-label="On this page" className="text-sm">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-blue-700">
            <li>
              <a className="underline" href="#calculator">
                Calculator
              </a>
            </li>
            <li>
              <a className="underline" href="#how-it-works">
                How it works
              </a>
            </li>
            <li>
              <a className="underline" href="#included">
                What’s included
              </a>
            </li>
            <li>
              <a className="underline" href="#not-included">
                What’s not included
              </a>
            </li>
            <li>
              <a className="underline" href="#faq">
                FAQ
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <section id="calculator" className="mt-6">
        <TaxCompareCalculator />
      </section>

      <p className="text-sm text-gray-600 mt-6">
        This calculator provides estimates for comparison purposes only. Actual
        tax liability depends on your full tax situation and local rules.
      </p>

      <hr className="my-8" />

      <section id="how-it-works" className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">How the calculator works</h2>

          <p className="text-gray-700">
            The calculator estimates your annual tax cost in each state using:
          </p>

          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>
              <strong>State income tax</strong> (state-only) based on either
              progressive brackets or a flat rate, depending on the state.
            </li>
            <li>
              <strong>Property tax</strong> using an average effective
              residential property tax rate applied to your home value.
            </li>
          </ul>

          <p className="text-gray-700">
            It then computes the <strong>annual difference</strong> between the
            two states and projects how that difference could grow if invested
            monthly with compounding.
          </p>
        </div>

        <div id="included" className="space-y-2">
          <h3 className="text-lg font-semibold">What’s included</h3>

          <p className="text-gray-700">
            <strong>1) State taxable income (simplified):</strong> Your input is
            treated as gross income. For states where the model includes a state
            standard deduction by filing status, that deduction is subtracted to
            estimate taxable income.
          </p>

          <p className="text-gray-700">
            <strong>2) State income tax:</strong> If a state uses progressive
            brackets, the calculator applies marginal rates by filing status
            (Single, Married Filing Jointly, Head of Household). If a state uses
            a flat tax, it applies the flat rate. Some states also include a
            high-income surtax in the model.
          </p>

          <p className="text-gray-700">
            <strong>3) Property tax:</strong> Estimated as{" "}
            <code className="px-1 py-0.5 rounded border bg-gray-50">
              home value × state property tax rate
            </code>
            . This is intended as a statewide average comparison, not a precise
            bill.
          </p>

          <p className="text-gray-700">
            <strong>4) Investment projection:</strong> The annual tax difference
            is converted into a monthly contribution and compounded monthly using
            a long-term annual return assumption (currently 10%). You can set
            the horizon up to <strong>100 years</strong>.
          </p>
        </div>

        <div id="not-included" className="space-y-2">
          <h3 className="text-lg font-semibold">What’s not included</h3>

          <p className="text-gray-700">
            This tool is designed for directional planning. It intentionally
            excludes factors that vary widely by person or location, including:
          </p>

          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Local and city income taxes (for example, New York City tax)</li>
            <li>Sales and use taxes</li>
            <li>Federal income taxes</li>
            <li>Itemized deductions, credits, and special state-specific rules</li>
            <li>Property tax exemptions, assessment caps, reassessment timing</li>
            <li>Insurance, HOA, special assessments, and other housing costs</li>
          </ul>

          <p className="text-gray-700">
            Results should be viewed as <strong>directional</strong>, not exact.
          </p>
        </div>
      </section>

      <hr className="my-8" />

      <section id="faq" className="space-y-4">
        <h2 className="text-xl font-semibold">FAQ</h2>

        <details className="rounded border p-4">
          <summary className="font-medium cursor-pointer">
            Does this include federal taxes?
          </summary>
          <p className="text-gray-700 mt-2">
            No. This is a state-only comparison for income tax and property tax.
          </p>
        </details>

        <details className="rounded border p-4">
          <summary className="font-medium cursor-pointer">
            Does this include local income taxes or county property tax rules?
          </summary>
          <p className="text-gray-700 mt-2">
            No. Local income taxes and county-level property tax differences are
            not included. Property tax is modeled as a statewide average rate.
          </p>
        </details>

        <details className="rounded border p-4">
          <summary className="font-medium cursor-pointer">
            What does the investment chart represent?
          </summary>
          <p className="text-gray-700 mt-2">
            It shows how investing the annual tax difference (added monthly)
            could grow over time with monthly compounding under the assumed
            return rate. It is illustrative only and not financial advice.
          </p>
        </details>

        <details className="rounded border p-4">
          <summary className="font-medium cursor-pointer">
            How accurate is this tax data over time?
          </summary>
          <p className="text-gray-700 mt-2">
            State tax laws, brackets, deductions, and property tax rules change
            frequently due to legislation, inflation adjustments, and local
            policy. This calculator reflects a snapshot based on recent publicly
            available information, but it may not always reflect the most
            current law.
          </p>
          <p className="text-gray-700 mt-2">
            You should always double check results against official state tax
            authorities or a qualified tax professional before making financial
            or relocation decisions.
          </p>
        </details>
      </section>
    </main>
  );
}
