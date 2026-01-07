import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">
        State Tax Comparison
      </h1>

      <p className="mb-4">
        Compare how much more or less you pay in taxes when moving between states.
      </p>

      <Link
        href="/compare"
        className="text-blue-600 underline"
      >
        Go to the calculator
      </Link>
    </main>
  );
}

