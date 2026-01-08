import SocialSecurityCalculator from "./social-security-calculator";

export default function SocialSecurityPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        Social Security Value Calculator
      </h1>

      <p className="text-gray-700">
        Estimate how much you and your employer pay into Social Security based
        on your income and years worked, and see what those contributions would
        have grown to if invested instead at a 10% annual return.
      </p>

      <SocialSecurityCalculator />

      <p className="text-sm text-gray-600">
        Estimates are for comparison purposes only and are not tax or financial
        advice. Social Security rules and wage caps can change over time.
      </p>

      {/* SEO explanatory section */}
      <section className="pt-6 border-t space-y-4 text-gray-700">
        <h2 className="text-xl font-semibold">
          How this Social Security investment comparison works
        </h2>

        <p>
          This calculator compares the value of traditional Social Security
          benefits with a hypothetical scenario where the same payroll tax
          contributions are invested in the market instead. It is designed to
          help illustrate opportunity cost, not to predict future outcomes.
        </p>

        <p>
          Under current U.S. law, Social Security is funded through payroll
          taxes under the Old-Age, Survivors, and Disability Insurance (OASDI)
          program. Employees pay a percentage of their wages, and employers
          contribute an equal amount, up to an annual wage cap set by the
          Social Security Administration.
        </p>

        <h3 className="text-lg font-semibold">
          Contribution assumptions
        </h3>

        <p>
          The calculator applies the current OASDI tax rates to your income,
          subject to the historical Social Security wage base for each year
          worked. Both employee and employer contributions are included, since
          economists generally view the employer portion as part of total
          compensation.
        </p>

        <p>
          In the investment comparison, these combined contributions are assumed
          to be invested monthly and compounded monthly at a constant 10%
          annual return. This rate is commonly used as a long-term historical
          stock market average, but actual investment returns can be higher or
          lower.
        </p>

        <h3 className="text-lg font-semibold">
          Retirement and withdrawal modeling
        </h3>

        <p>
          After the working years end, the model assumes the individual begins
          withdrawing a monthly amount equal to their estimated Social Security
          benefit at age 67. While withdrawals are occurring, the remaining
          portfolio continues to grow at the same assumed investment return.
        </p>

        <p>
          Withdrawals are modeled over an average retirement period, based on
          published life expectancy data. This allows you to see whether an
          invested portfolio could sustain payments comparable to Social
          Security benefits over a typical retirement lifespan.
        </p>

        <h3 className="text-lg font-semibold">
          Important limitations
        </h3>

        <p>
          This tool simplifies many aspects of Social Security and investing.
          It does not account for wage indexing, cost-of-living adjustments,
          taxes, spousal or survivor benefits, disability coverage, market
          volatility, sequence-of-returns risk, or behavioral factors.
        </p>

        <p>
          Social Security is a social insurance program with protections that
          private investments do not provide, while market investing involves
          risk and uncertainty. This comparison is intended for educational
          purposes only, to help users better understand trade-offs and
          long-term value differences.
        </p>
      </section>
    </main>
  );
}
