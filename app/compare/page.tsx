import TaxCompareCalculator from "./tax-compare-calculator";

export default function ComparePage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">State Tax Comparison Calculator</h1>

      <TaxCompareCalculator />

      <p className="text-sm text-gray-600 mt-6">
        This calculator provides estimates for comparison purposes only. Actual
        tax liability depends on your full tax situation and local rules.
      </p>

      <hr className="my-8" />

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            How this state tax comparison works
          </h2>

          <p className="text-gray-700">
            This calculator estimates and compares{" "}
            <strong>annual state income tax and property tax</strong> across U.S.
            states to help you understand the potential financial impact of
            moving.
          </p>

          <p className="text-gray-700 mt-3">
            It is designed for{" "}
            <strong>planning and scenario comparison</strong>, not
            for filing a tax return.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            State income tax calculation
          </h3>

          <p className="text-gray-700">
            State income tax is calculated using{" "}
            <strong>official marginal tax brackets</strong> where applicable.
          </p>

          <ul className="list-disc pl-5 text-gray-700 space-y-1 mt-3">
            <li>
              California and New York use{" "}
              <strong>progressive marginal brackets</strong>
            </li>
            <li>
              Illinois uses a <strong>flat income tax</strong>
            </li>
            <li>
              Texas and Florida have <strong>no state income tax</strong>
            </li>
          </ul>

          <p className="text-gray-700 mt-3">
            The calculator applies the selected <strong>filing status</strong>{" "}
            (Single, Married Filing Jointly, or Head of Household).
          </p>

          <p className="text-gray-700 mt-3">
            For California, New York, Arizona, and Georgia,{" "}
            <strong>state standard deduction</strong> is applied before
            calculating tax. Your entered income is treated as{" "}
            <strong>gross income</strong>, and taxable income is estimated
            internally.
          </p>

          <p className="text-gray-700 mt-3">
            This produces a more realistic comparison than a single flat
            effective rate, especially at higher income levels.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            Property tax calculation
          </h3>

          <p className="text-gray-700">
            Property tax is estimated using{" "}
            <strong>
              average effective residential property tax rates by state
            </strong>
            , applied to your entered home value.
          </p>

          <p className="text-gray-700 mt-3">
            Actual property taxes can vary significantly based on county and
            city, assessment practices, exemptions, and length of ownership (for
            example, California Proposition 13). This estimate is intended to
            represent a typical statewide average for comparison purposes.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            What is not included in this estimate
          </h3>

          <p className="text-gray-700">
            This comparison intentionally excludes factors that vary widely by
            individual or location, including:
          </p>

          <ul className="list-disc pl-5 text-gray-700 space-y-1 mt-3">
            <li>
              Local and city income taxes (for example, New York City tax)
            </li>
            <li>Sales and use taxes</li>
            <li>Itemized deductions and tax credits</li>
            <li>Federal income taxes</li>
            <li>Special assessments, HOA fees, or insurance costs</li>
            <li>Changes in home appreciation or reassessment rules</li>
          </ul>

          <p className="text-gray-700 mt-3">
            Because of these exclusions, results should be viewed as{" "}
            <strong>directional</strong>, not exact.
          </p>
        </div>

        <div>
          <p className="text-gray-700">
            This state tax comparison tool helps estimate how income tax and
            property tax differences can affect your finances when moving
            between states such as California, Texas, Florida, New York, and
            Illinois. It is useful for evaluating relocation scenarios,
            cost-of-living tradeoffs, and long-term investment impact, but it
            does not replace professional tax advice.
          </p>
        </div>
      </section>
    </main>
  );
}
