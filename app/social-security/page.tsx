import SocialSecurityCalculator from "./social-security-calculator";

export default function SocialSecurityPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        Social Security Contributions Calculator
      </h1>

      <p className="text-gray-700">
        Estimate how much you and your employer pay into Social Security based
        on your income and years worked, and see what those contributions could
        grow to if invested at a 10% annual return.
      </p>

      <SocialSecurityCalculator />

      <p className="text-sm text-gray-600">
        Estimates are for comparison purposes only and are not tax or financial
        advice. Social Security rules and wage caps can change over time.
      </p>
    </main>
  );
}
