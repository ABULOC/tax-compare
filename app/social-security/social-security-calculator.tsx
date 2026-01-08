"use client";

import { useMemo, useState } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
  Legend,
} from "recharts";

function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatNumberInput(n: number) {
  return n.toLocaleString("en-US");
}

function parseNumberInput(value: string) {
  return Number(value.replace(/[^0-9]/g, ""));
}

function formatYAxisTick(v: number) {
  if (!Number.isFinite(v)) return "";
  const n = Number(v);

  if (n === 0) return "$0";

  if (n < 1_000_000) {
    const k = Math.round(n / 1_000);
    return `$${k}k`;
  }

  const m = n / 1_000_000;
  const str = m < 10 ? m.toFixed(1) : Math.round(m).toString();
  const cleaned = str.endsWith(".0") ? str.slice(0, -2) : str;

  return `$${cleaned}mm`;
}

function CustomSSInvestmentTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: string | number;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const principal = payload.find((p) => p.name === "Total principal")?.value ?? 0;
  const interest = payload.find((p) => p.name === "Total interest")?.value ?? 0;
  const balance = principal + interest;

  const principalColor =
    payload.find((p) => p.name === "Total principal")?.color ?? "#1D4ED8";
  const interestColor =
    payload.find((p) => p.name === "Total interest")?.color ?? "#047857";

  return (
    <div className="rounded-md border bg-white shadow-lg px-4 py-3 min-w-[260px]">
      <div className="text-sm text-gray-600">{String(label)}</div>

      <div className="my-3 h-px bg-gray-200" />

      <div className="flex items-baseline justify-between">
        <div className="font-semibold text-gray-900">Total balance</div>
        <div className="font-semibold text-gray-900">{formatUSD(balance)}</div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-800">
            <span
              className="inline-block h-2.5 w-2.5"
              style={{ backgroundColor: principalColor }}
            />
            <span>Total principal</span>
          </div>
          <div className="text-gray-900">{formatUSD(principal)}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-800">
            <span
              className="inline-block h-2.5 w-2.5"
              style={{ backgroundColor: interestColor }}
            />
            <span>Total interest</span>
          </div>
          <div className="text-gray-900">{formatUSD(interest)}</div>
        </div>
      </div>
    </div>
  );
}

type Props = {
  initialIncome?: number;
  initialYearsWorked?: number;
  initialWageCap?: number;
};

// Social Security OASDI wage rate (employee + employer)
// Employee: 6.2%
// Employer: 6.2%
// Combined: 12.4%
const EMPLOYEE_RATE = 0.062;
const EMPLOYER_RATE = 0.062;

export default function SocialSecurityCalculator(props: Props) {
  const [income, setIncome] = useState(props.initialIncome ?? 100_000);

  const [yearsWorked, setYearsWorked] = useState(props.initialYearsWorked ?? 35);
  const [yearsWorkedInput, setYearsWorkedInput] = useState(String(props.initialYearsWorked ?? 35));

  // This cap changes over time. Make it an input so the model stays useful.
  const [wageCap, setWageCap] = useState(props.initialWageCap ?? 168_600);

  const annualReturn = 0.1;
  const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1;

  const annualTaxableWages = Math.min(income, wageCap);

  const annualEmployee = annualTaxableWages * EMPLOYEE_RATE;
  const annualEmployer = annualTaxableWages * EMPLOYER_RATE;
  const annualTotal = annualEmployee + annualEmployer;

  const monthlyContribution = annualTotal / 12;

  const totals = useMemo(() => {
    const y = Math.max(1, Math.min(50, Math.floor(yearsWorked)));
    const totalEmployee = annualEmployee * y;
    const totalEmployer = annualEmployer * y;
    const totalCombined = annualTotal * y;

    return { y, totalEmployee, totalEmployer, totalCombined };
  }, [yearsWorked, annualEmployee, annualEmployer, annualTotal]);

  const investmentSeries = useMemo(() => {
    const y = Math.max(1, Math.min(50, Math.floor(yearsWorked)));
    const startYear = new Date().getFullYear();

    let balance = 0;
    let contributed = 0;

    const points: {
      yearLabel: string;
      year: number;
      balance: number;
      principal: number;
      interest: number;
    }[] = [{ yearLabel: "Now", year: startYear, balance: 0, principal: 0, interest: 0 }];

    const totalMonths = y * 12;

    for (let m = 1; m <= totalMonths; m += 1) {
      balance = balance * (1 + monthlyReturn) + monthlyContribution;
      contributed += monthlyContribution;

      if (m % 12 === 0) {
        const yearOffset = m / 12;
        const currentYear = startYear + yearOffset;

        points.push({
          yearLabel: String(currentYear),
          year: currentYear,
          balance,
          principal: contributed,
          interest: Math.max(0, balance - contributed),
        });
      }
    }

    return points;
  }, [yearsWorked, monthlyContribution, monthlyReturn]);

  const xTicks = useMemo(() => {
    const first = investmentSeries[0]?.year;
    const last = investmentSeries[investmentSeries.length - 1]?.year;
    if (first == null || last == null) return [];

    const mid = first + Math.floor((last - first) / 2);
    return [first, mid, last];
  }, [investmentSeries]);

  const yAxisMax = useMemo(() => {
    const max = Math.max(...investmentSeries.map((p) => p.balance));
    return max * 1.1;
  }, [investmentSeries]);

  const endingBalance = investmentSeries[investmentSeries.length - 1]?.balance ?? 0;
  const endingPrincipal = investmentSeries[investmentSeries.length - 1]?.principal ?? 0;
  const endingInterest = investmentSeries[investmentSeries.length - 1]?.interest ?? 0;

  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <label className="block">
          <div className="font-medium">Annual income</div>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            type="text"
            inputMode="numeric"
            value={`$${formatNumberInput(income)}`}
            onChange={(e) => setIncome(parseNumberInput(e.target.value))}
          />
          <div className="mt-1 text-xs text-gray-600">
            Social Security applies only up to the wage cap.
          </div>
        </label>

        <label className="block">
          <div className="font-medium">Social Security wage cap</div>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            type="text"
            inputMode="numeric"
            value={`$${formatNumberInput(wageCap)}`}
            onChange={(e) => setWageCap(parseNumberInput(e.target.value))}
          />
          <div className="mt-1 text-xs text-gray-600">
            This cap changes over time. Adjust if needed.
          </div>
        </label>

        <label className="block">
          <div className="font-medium">Years worked</div>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            type="number"
            min={1}
            max={50}
            value={yearsWorkedInput}
            onChange={(e) => {
              const v = e.target.value;
              setYearsWorkedInput(v);

              if (v === "") return;

              const n = Number(v);
              if (Number.isNaN(n)) return;

              const clamped = Math.max(1, Math.min(50, Math.floor(n)));
              setYearsWorked(clamped);
              setYearsWorkedInput(String(clamped));
            }}
            onBlur={() => {
              if (yearsWorkedInput === "") {
                setYearsWorkedInput(String(yearsWorked));
              }
            }}
          />
        </label>
      </div>

      <div className="rounded border p-4 space-y-3">
        <h2 className="text-xl font-semibold">
          Estimated Social Security contributions
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="font-semibold mb-1">Per year</div>
            <div>You pay: {formatUSD(annualEmployee)}</div>
            <div>Employer pays: {formatUSD(annualEmployer)}</div>
            <div className="mt-2 font-bold">
              Total: {formatUSD(annualTotal)}
            </div>
          </div>

          <div>
            <div className="font-semibold mb-1">
              Over {totals.y} years
            </div>
            <div>You pay: {formatUSD(totals.totalEmployee)}</div>
            <div>Employer pays: {formatUSD(totals.totalEmployer)}</div>
            <div className="mt-2 font-bold">
              Total: {formatUSD(totals.totalCombined)}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t space-y-2">
          <h3 className="text-lg font-semibold">
            If those contributions were invested at 10%
          </h3>

          <div className="text-center">
            <div className="text-sm text-gray-600">
              Estimated value after {totals.y} years:
            </div>
            <div className="text-3xl font-extrabold text-emerald-700">
              {formatUSD(endingBalance)}
            </div>
            <div className="mt-1 text-sm text-gray-700">
              Principal: {formatUSD(endingPrincipal)} · Interest: {formatUSD(endingInterest)}
            </div>
          </div>

          <div className="w-full max-w-2xl aspect-[6/5] mx-auto mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={investmentSeries}
                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="ssPrincipalFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1D4ED8" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.03} />
                  </linearGradient>
                  <linearGradient id="ssInterestFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#047857" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#047857" stopOpacity={0.03} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="year"
                  ticks={xTicks}
                  interval={0}
                  tickFormatter={(v) => {
                    const first = xTicks[0];
                    if (first != null && Number(v) === first) return "Now";
                    return String(v);
                  }}
                  label={{ value: "Year", position: "insideBottom", offset: -5 }}
                />

                <YAxis
                  domain={[0, yAxisMax]}
                  tickFormatter={(v) => formatYAxisTick(Number(v))}
                />

                <Tooltip
                  content={
                    <CustomSSInvestmentTooltip />
                  }
                  labelFormatter={(value) => {
                    const first = xTicks[0];
                    if (first != null && Number(value) === first) return "Now";
                    return `Year ${value}`;
                  }}
                />

                <Legend verticalAlign="bottom" align="right" iconType="square" />

                <Area
                  type="monotone"
                  dataKey="principal"
                  name="Total principal"
                  stackId="1"
                  stroke="#1D4ED8"
                  fill="url(#ssPrincipalFill)"
                  dot={false}
                  activeDot={false}
                />
                <Area
                  type="monotone"
                  dataKey="interest"
                  name="Total interest"
                  stackId="1"
                  stroke="#047857"
                  fill="url(#ssInterestFill)"
                  dot={false}
                  activeDot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-gray-600">
            <span className="font-medium">Investment assumption:</span>{" "}
            Assumes the combined employee and employer contributions are invested
            monthly and compound monthly using a 10% long-term annual return
            assumption. Results are illustrative only and not financial advice.
          </p>
        </div>
      </div>
    </section>
  );
}
