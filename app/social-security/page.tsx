import type { Metadata } from "next";
import Script from "next/script";
import SocialSecurityCalculator from "./social-security-calculator";

export const metadata: Metadata = {
  title:
    "Social Security Value Calculator | Contributions vs Investing Comparison",
  description:
    "Estimate how much you and your employer paid into Social Security (OASDI) using historical wage caps and tax rates, estimate benefits at age 67, and compare to investing the same contributions at a hypothetical 10% annual return.",
  keywords: [
    "Social Security calculator",
    "OASDI calculator",
    "Social Security wage base",
    "payroll tax",
    "Social Security benefits estimate",
    "AIME",
    "PIA",
    "bend points",
    "wage indexing",
    "COLA",
    "invest vs social security",
  ],

  // ADD THIS
  alternates: { canonical: "/social-security" },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Social Security Value Calculator",
    description:
      "Estimate OASDI contributions (employee + employer) with historical caps and rates, estimate benefits at age 67, and compare to investing contributions at 10%.",
    type: "website",

    // ADD THIS
    url: "/social-security",
  },

  twitter: {
    // OPTIONAL CHANGE: use large card if you will add an OG image later
    card: "summary_large_image",
    title: "Social Security Value Calculator",
    description:
      "Estimate OASDI contributions and benefits at 67, then compare to investing the same contributions at 10%.",
  },
};


export default function SocialSecurityPage() {
  // JSON-LD FAQ schema for SEO
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does this Social Security calculator estimate?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "It estimates Social Security (OASDI) payroll tax contributions paid by you and your employer using historical wage caps and tax rates, then provides a simplified benefit estimate at age 67 and an illustrative investing comparison.",
        },
      },
      {
        "@type": "Question",
        name: "Does it include Medicare payroll taxes?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "No. The calculator focuses on Social Security (OASDI) only. Medicare taxes (including the additional Medicare tax for higher earners) are not included.",
        },
      },
      {
        "@type": "Question",
        name: "How are Social Security benefits estimated?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "The calculator caps each year’s earnings at the wage base, wage-indexes earnings to the year you turn 60 using the Average Wage Index, selects the highest 35 years, computes AIME, applies the PIA bend-point formula for your eligibility year (age 62), and applies listed COLAs when available through age 67. It is still a simplified model and may differ from SSA calculators.",
        },
      },
      {
        "@type": "Question",
        name: "How does the investing comparison work?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "It assumes the combined employee and employer OASDI contributions are invested monthly, compounded monthly at an annual-equivalent 10% return. During retirement it withdraws an amount equal to the estimated Social Security monthly benefit while the remainder continues compounding.",
        },
      },
    ],
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <article className="space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold">Social Security Value Calculator</h1>

          <p className="text-gray-700">
            Estimate how much you and your employer pay into Social Security (OASDI) based on
            income and years worked, using historical wage caps and tax rates. Then compare those
            contributions to a hypothetical investment portfolio compounded at a constant 10%
            annual return.
          </p>

          <nav aria-label="On this page" className="text-sm text-gray-700">
            <div className="font-semibold">On this page</div>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <a className="underline" href="#calculator">
                  Calculator
                </a>
              </li>
              <li>
                <a className="underline" href="#what-it-calculates">
                  What it calculates
                </a>
              </li>
              <li>
                <a className="underline" href="#benefit-method">
                  Benefit estimate method
                </a>
              </li>
              <li>
                <a className="underline" href="#investment-method">
                  Investing comparison method
                </a>
              </li>
              <li>
                <a className="underline" href="#limitations">
                  Important limitations
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

        <section id="calculator" className="space-y-4">
          <h2 className="text-2xl font-semibold">Calculator</h2>

          <SocialSecurityCalculator
            initialBirthYear={1990}
            initialStartYear={2010}
            initialYearsWorked={40}
          />

          <p className="text-sm text-gray-600">
            Estimates are for educational comparison purposes only and are not tax, legal, or
            financial advice. Social Security rules, wage caps, and tax rates can change over time.
          </p>
        </section>

        <section id="what-it-calculates" className="space-y-4 text-gray-700 border-t pt-6">
          <h2 className="text-2xl font-semibold">What it calculates</h2>

          <h3 className="text-lg font-semibold">1) Social Security contributions (OASDI)</h3>
          <p>
            Social Security is primarily funded through payroll taxes under OASDI. Each year has a
            maximum amount of earnings subject to the Social Security portion of payroll tax,
            commonly called the wage base or wage cap. This calculator caps each year’s taxable wages
            at that historical wage base.
          </p>
          <p>
            It then applies historical OASDI tax rates. The employee rate is not always 6.2% across
            all years, and the employee and employer rates can differ in certain years. The calculator
            also accounts for the temporary employee-rate reduction in 2011 and 2012.
          </p>

          <h3 className="text-lg font-semibold">2) Estimated Social Security benefit at age 67</h3>
          <p>
            Social Security retirement benefits are based on your highest wage-indexed earnings.
            This page’s calculator estimates a monthly benefit at age 67 from your work history and
            wage caps. It is intended to be directionally useful, not an official benefit statement.
          </p>

          <h3 className="text-lg font-semibold">3) Investing comparison</h3>
          <p>
            For the comparison, the calculator assumes the combined employee and employer OASDI amounts
            are invested instead. It models monthly contributions and monthly compounding using an
            annual-equivalent 10% return, then simulates retirement withdrawals.
          </p>
        </section>

        <section id="benefit-method" className="space-y-4 text-gray-700 border-t pt-6">
          <h2 className="text-2xl font-semibold">Benefit estimate method</h2>

          <p>
            The calculator implements a simplified version of the Social Security benefit formula:
          </p>

          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <span className="font-semibold">Cap earnings by year:</span> each year’s earnings are
              limited to the Social Security wage base for that year.
            </li>
            <li>
              <span className="font-semibold">Wage indexing:</span> earnings before the year you turn
              60 are indexed using the Average Wage Index to put earlier wages on a comparable scale.
            </li>
            <li>
              <span className="font-semibold">Top 35 years:</span> it selects the highest 35 indexed
              years (or fewer years if you worked less).
            </li>
            <li>
              <span className="font-semibold">AIME:</span> it computes Average Indexed Monthly
              Earnings by dividing the top-35 total by 420 months, then rounds down to the next lower
              whole dollar.
            </li>
            <li>
              <span className="font-semibold">PIA bend points:</span> it applies the Primary Insurance
              Amount formula using bend points for the year you turn 62 (your year of eligibility).
            </li>
            <li>
              <span className="font-semibold">COLA when available:</span> it applies listed COLAs from
              eligibility toward age 67 when those COLA values are present in the embedded table.
            </li>
          </ol>

          <p className="text-sm text-gray-600">
            If you want an official estimate, compare results against your SSA online account and SSA
            calculators. This tool is designed for understanding mechanics and trade-offs.
          </p>
        </section>

        <section id="investment-method" className="space-y-4 text-gray-700 border-t pt-6">
          <h2 className="text-2xl font-semibold">Investing comparison method</h2>

          <h3 className="text-lg font-semibold">Monthly investing model</h3>
          <p>
            During working years, the calculator invests the combined employee and employer OASDI
            contributions. It converts each year’s total contribution into equal monthly deposits and
            compounds monthly at an annual-equivalent 10% return.
          </p>

          <h3 className="text-lg font-semibold">Retirement withdrawals</h3>
          <p>
            After the last working year, the model withdraws a monthly amount equal to the estimated
            Social Security monthly benefit at age 67 and continues compounding the remaining balance.
            It runs withdrawals over a retirement duration based on average remaining life expectancy.
          </p>

          <p className="text-sm text-gray-600">
            This section is illustrative only. Real-world markets vary, and sustainable retirement
            withdrawals depend on volatility, inflation, and timing.
          </p>
        </section>

        <section id="limitations" className="space-y-4 text-gray-700 border-t pt-6">
          <h2 className="text-2xl font-semibold">Important limitations</h2>

          <ul className="list-disc pl-5 space-y-2">
            <li>
              The calculator focuses on <span className="font-semibold">OASDI</span> only and does not
              include Medicare payroll taxes.
            </li>
            <li>
              Benefits are simplified. It does not model exact month-based claiming rules, family benefits
              (spousal or survivor), disability coverage, earnings tests, WEP/GPO, taxation of benefits,
              or Medicare premiums.
            </li>
            <li>
              COLA handling is limited to the years included in the embedded COLA table.
            </li>
            <li>
              The investment comparison assumes a constant return and does not model inflation explicitly,
              sequence-of-returns risk, fees, taxes, or behavioral factors.
            </li>
            <li>
              Social Security is insurance with features private investing does not replicate. This tool
              is not a recommendation to opt out or a forecast of your future benefit.
            </li>
          </ul>
        </section>

        <section id="faq" className="space-y-4 text-gray-700 border-t pt-6">
          <h2 className="text-2xl font-semibold">FAQ</h2>

          <details className="rounded border p-4">
            <summary className="font-semibold cursor-pointer">
              Why include the employer portion of payroll tax?
            </summary>
            <div className="mt-2 space-y-2">
              <p>
                The employer OASDI contribution is part of the total cost of employing someone.
                Many economists treat it as part of total compensation. Including both sides makes
                the comparison closer to “total dollars tied to your labor.”
              </p>
            </div>
          </details>

          <details className="rounded border p-4">
            <summary className="font-semibold cursor-pointer">
              Will my actual Social Security benefit match this exactly?
            </summary>
            <div className="mt-2 space-y-2">
              <p>
                Not necessarily. Social Security benefits depend on your exact earnings record, indexing,
                eligibility year, claiming month, and other rules. Use this as an explanatory model and
                validate against SSA for official numbers.
              </p>
            </div>
          </details>

          <details className="rounded border p-4">
            <summary className="font-semibold cursor-pointer">
              Is 10% a guaranteed investment return?
            </summary>
            <div className="mt-2 space-y-2">
              <p>
                No. The calculator uses a constant 10% annual return only as a simple long-run illustration.
                Real returns vary and can be negative over multi-year periods.
              </p>
            </div>
          </details>
        </section>
      </article>
    </main>
  );
}
