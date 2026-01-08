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
} from "recharts";


/**
 * Social Security OASDI "Contribution and Benefit Base" (taxable maximum) by year.
 // Source: SSA OACT (Contribution and Benefit Base, 1937–2026).
 */
const OASDI_WAGE_BASE_BY_YEAR: Record<number, number> = {
  1937: 3_000,
  1938: 3_000,
  1939: 3_000,
  1940: 3_000,
  1941: 3_000,
  1942: 3_000,
  1943: 3_000,
  1944: 3_000,
  1945: 3_000,
  1946: 3_000,
  1947: 3_000,
  1948: 3_000,
  1949: 3_000,
  1950: 3_000,

  1951: 3_600,
  1952: 3_600,
  1953: 3_600,
  1954: 3_600,

  1955: 4_200,
  1956: 4_200,
  1957: 4_200,
  1958: 4_200,

  1959: 4_800,
  1960: 4_800,
  1961: 4_800,
  1962: 4_800,
  1963: 4_800,
  1964: 4_800,
  1965: 4_800,

  1966: 6_600,
  1967: 6_600,

  1968: 7_800,
  1969: 7_800,
  1970: 7_800,
  1971: 7_800,

  1972: 9_000,
  1973: 10_800,
  1974: 13_200,
  1975: 14_100,
  1976: 15_300,
  1977: 16_500,
  1978: 17_700,
  1979: 22_900,
  1980: 25_900,
  1981: 29_700,
  1982: 32_400,
  1983: 35_700,
  1984: 37_800,
  1985: 39_600,
  1986: 42_000,
  1987: 43_800,
  1988: 45_000,
  1989: 48_000,
  1990: 51_300,
  1991: 53_400,
  1992: 55_500,
  1993: 57_600,
  1994: 60_600,
  1995: 61_200,
  1996: 62_700,
  1997: 65_400,
  1998: 68_400,
  1999: 72_600,
  2000: 76_200,
  2001: 80_400,
  2002: 84_900,
  2003: 87_000,
  2004: 87_900,
  2005: 90_000,
  2006: 94_200,
  2007: 97_500,
  2008: 102_000,
  2009: 106_800,
  2010: 106_800,
  2011: 106_800,
  2012: 110_100,
  2013: 113_700,
  2014: 117_000,
  2015: 118_500,
  2016: 118_500,
  2017: 127_200,
  2018: 128_400,
  2019: 132_900,
  2020: 137_700,
  2021: 142_800,
  2022: 147_000,
  2023: 160_200,
  2024: 168_600,
  2025: 176_100,
  2026: 184_500,
};

const MIN_WAGE_BASE_YEAR = Math.min(...Object.keys(OASDI_WAGE_BASE_BY_YEAR).map(Number));
const MAX_WAGE_BASE_YEAR = Math.max(...Object.keys(OASDI_WAGE_BASE_BY_YEAR).map(Number));

// Social Security OASDI wage rate
// Employee: 6.2%
// Employer: 6.2%
const EMPLOYEE_RATE = 0.062;
const EMPLOYER_RATE = 0.062;



// PIA bend points (current-law formula, example year 2026). :contentReference[oaicite:2]{index=2}
const PIA_BEND_1 = 1_286;
const PIA_BEND_2 = 7_749;

// Remaining life expectancy at age 67 (SSA 2022 period life table). :contentReference[oaicite:3]{index=3}
// Male: 16.11, Female: 18.56. Use simple average as "average person".
const AVG_REMAINING_YEARS_AT_67 = (16.11 + 18.56) / 2;

function calcPIAFromAIME(aime: number) {
  const x = Math.max(0, aime);

  const part1 = Math.min(x, PIA_BEND_1) * 0.9;
  const part2 = Math.max(0, Math.min(x, PIA_BEND_2) - PIA_BEND_1) * 0.32;
  const part3 = Math.max(0, x - PIA_BEND_2) * 0.15;

  return part1 + part2 + part3;
}




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

function getWageBaseForYear(year: number) {
  if (OASDI_WAGE_BASE_BY_YEAR[year] != null) return OASDI_WAGE_BASE_BY_YEAR[year];
  if (year < MIN_WAGE_BASE_YEAR) return OASDI_WAGE_BASE_BY_YEAR[MIN_WAGE_BASE_YEAR];
  return OASDI_WAGE_BASE_BY_YEAR[MAX_WAGE_BASE_YEAR];
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
            <span className="inline-block h-2.5 w-2.5" style={{ backgroundColor: principalColor }} />
            <span>Total principal</span>
          </div>
          <div className="text-gray-900">{formatUSD(principal)}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-800">
            <span className="inline-block h-2.5 w-2.5" style={{ backgroundColor: interestColor }} />
            <span>Total interest</span>
          </div>
          <div className="text-gray-900">{formatUSD(interest)}</div>
        </div>
      </div>
    </div>
  );
}



function CustomPortfolioTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: string | number;
  payload?: Array<{ name?: string; value?: number }>;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const balance = payload[0]?.value ?? 0;

  return (
    <div className="rounded-md border bg-white shadow-lg px-4 py-3 min-w-[220px]">
      <div className="text-sm text-gray-600">{String(label)}</div>
      <div className="my-3 h-px bg-gray-200" />
      <div className="flex items-baseline justify-between">
        <div className="font-semibold text-gray-900">Balance</div>
        <div className="font-semibold text-gray-900">{formatUSD(balance)}</div>
      </div>
    </div>
  );
}





type Props = {
  initialIncome?: number;
  initialYearsWorked?: number;
  initialStartYear?: number;
};

export default function SocialSecurityCalculator(props: Props) {
  const [income, setIncome] = useState(props.initialIncome ?? 100_000);

  const [yearsWorked, setYearsWorked] = useState(props.initialYearsWorked ?? 35);
  const [yearsWorkedInput, setYearsWorkedInput] = useState(String(props.initialYearsWorked ?? 35));

  const defaultStartYear = props.initialStartYear ?? new Date().getFullYear() - (props.initialYearsWorked ?? 35);
  const [startYear, setStartYear] = useState(defaultStartYear);
  const [startYearInput, setStartYearInput] = useState(String(defaultStartYear));

  const annualReturn = 0.1;
  const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1;

  const workingYears = useMemo(() => {
    const y = Math.max(1, Math.min(50, Math.floor(yearsWorked)));
    const start = Math.max(1900, Math.min(2100, Math.floor(startYear)));
    return { years: y, start };
  }, [yearsWorked, startYear]);

  const totals = useMemo(() => {
    let totalEmployee = 0;
    let totalEmployer = 0;

    for (let i = 0; i < workingYears.years; i += 1) {
      const year = workingYears.start + i;
      const cap = getWageBaseForYear(year);
      const taxableWages = Math.min(income, cap);

      totalEmployee += taxableWages * EMPLOYEE_RATE;
      totalEmployer += taxableWages * EMPLOYER_RATE;
    }

    return {
      y: workingYears.years,
      totalEmployee,
      totalEmployer,
      totalCombined: totalEmployee + totalEmployer,
      firstYear: workingYears.start,
      lastYear: workingYears.start + workingYears.years - 1,
      firstCap: getWageBaseForYear(workingYears.start),
      lastCap: getWageBaseForYear(workingYears.start + workingYears.years - 1),
    };
  }, [income, workingYears.start, workingYears.years]);



  const benefitEstimate = useMemo(() => {
  // Build covered earnings per year (income capped by wage base for each working year)
  const covered: number[] = [];

  for (let i = 0; i < workingYears.years; i += 1) {
    const year = workingYears.start + i;
    const cap = getWageBaseForYear(year);
    covered.push(Math.min(income, cap));
  }

  // Social Security uses 35 years of earnings (with zeros if fewer).
  const top35 = covered
    .slice()
    .sort((a, b) => b - a)
    .slice(0, 35);

  const sumTop35 = top35.reduce((s, v) => s + v, 0);

  // AIME is average monthly earnings over 35 years = sum / 420 months
  const aime = sumTop35 / (35 * 12);

  // PIA (Primary Insurance Amount). For this simplified model, assume benefit at 67 equals PIA.
  const pia = calcPIAFromAIME(aime);

  // Approx lifetime benefits using "average person" remaining years at 67.
  const totalLifetime = pia * 12 * AVG_REMAINING_YEARS_AT_67;

  return {
    aime,
    piaMonthlyAt67: pia,
    expectedYearsPaid: AVG_REMAINING_YEARS_AT_67,
    totalLifetime,
  };
}, [income, workingYears.start, workingYears.years]);




const portfolioSeries = useMemo(() => {
  const y = workingYears.years;
  const start = workingYears.start;

  const startYearCalendar = new Date().getFullYear();

  // Retirement withdrawal duration (17.3 years) in months
  const retirementMonths = Math.round(AVG_REMAINING_YEARS_AT_67 * 12);

  // Monthly withdrawal equals estimated SS monthly benefit at 67
  const monthlyWithdrawal = benefitEstimate.piaMonthlyAt67;

  let balance = 0;

  const points: { year: number; yearLabel: string; balance: number }[] = [
    { year: startYearCalendar, yearLabel: "Now", balance: 0 },
  ];

  // ---- Accumulation phase (working years) ----
  for (let i = 0; i < y; i += 1) {
    const workYear = start + i;
    const cap = getWageBaseForYear(workYear);
    const taxableWages = Math.min(income, cap);

    const annualEmployee = taxableWages * EMPLOYEE_RATE;
    const annualEmployer = taxableWages * EMPLOYER_RATE;
    const annualTotal = annualEmployee + annualEmployer;

    const monthlyContribution = annualTotal / 12;

    for (let m = 1; m <= 12; m += 1) {
      balance = balance * (1 + monthlyReturn) + monthlyContribution;
    }

    const calendarYear = startYearCalendar + (i + 1);
    points.push({
      year: calendarYear,
      yearLabel: String(calendarYear),
      balance,
    });
  }

  // ---- Withdrawal phase (next 17.3 years) ----
  // Start withdrawals the month after the last contribution month.
  let monthsSustained = 0;

  for (let monthIndex = 1; monthIndex <= retirementMonths; monthIndex += 1) {
    balance = balance * (1 + monthlyReturn) - monthlyWithdrawal;

    if (balance <= 0) {
      balance = 0;
      monthsSustained = monthIndex;
      // Push an endpoint point at the year boundary if desired, but always end the series
      // at the year containing exhaustion.
      break;
    }

    monthsSustained = monthIndex;

    // Add a point once per year during retirement to keep the chart readable
    if (monthIndex % 12 === 0) {
      const yearsIntoRetirement = monthIndex / 12;
      const calendarYear = startYearCalendar + y + yearsIntoRetirement;
      points.push({
        year: calendarYear,
        yearLabel: String(calendarYear),
        balance,
      });
    }
  }

  // Ensure we include the final retirement year point if the portfolio lasted the whole period
  if (monthsSustained === retirementMonths) {
    const finalCalendarYear = startYearCalendar + y + Math.ceil(retirementMonths / 12);
    const alreadyHasFinal = points.some((p) => p.year === finalCalendarYear);
    if (!alreadyHasFinal) {
      points.push({
        year: finalCalendarYear,
        yearLabel: String(finalCalendarYear),
        balance,
      });
    }
  }

  return {
    points,
    monthlyWithdrawal,
    monthsSustained,
    retirementMonths,
    endingBalanceAfterWork: points[y]?.balance ?? 0,
    endingBalanceAfterRetirement: points[points.length - 1]?.balance ?? 0,
  };
}, [income, monthlyReturn, workingYears.start, workingYears.years, benefitEstimate.piaMonthlyAt67]);





const xTicks = useMemo(() => {
  const first = portfolioSeries.points[0]?.year;
  const last = portfolioSeries.points[portfolioSeries.points.length - 1]?.year;
  if (first == null || last == null) return [];
  const mid = first + Math.floor((last - first) / 2);
  return [first, mid, last];
}, [portfolioSeries.points]);


const yAxisMax = useMemo(() => {
  const max = Math.max(...portfolioSeries.points.map((p) => p.balance));
  return max * 1.1;
}, [portfolioSeries.points]);


const endingBalance = portfolioSeries.endingBalanceAfterWork;
const endingBalanceAfterRetirement = portfolioSeries.endingBalanceAfterRetirement;


  // “Per year” display uses the FIRST working year cap as a representative snapshot.
  const perYearSnapshot = useMemo(() => {
    const cap = getWageBaseForYear(workingYears.start);
    const taxableWages = Math.min(income, cap);
    const employee = taxableWages * EMPLOYEE_RATE;
    const employer = taxableWages * EMPLOYER_RATE;
    return { cap, taxableWages, employee, employer, total: employee + employer };
  }, [income, workingYears.start]);

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
</label>


        <label className="block">
          <div className="font-medium">Year you started working</div>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            type="number"
            min={1900}
            max={2100}
            value={startYearInput}
onChange={(e) => {
  const v = e.target.value;
  setStartYearInput(v);

  // Allow clearing while typing
  if (v === "") return;

  // Allow partial typing like "2", "20", "202"
  if (!/^\d{1,4}$/.test(v)) return;

  // Only commit to state once it looks like a full year
  if (v.length < 4) return;

  const n = Number(v);
  if (Number.isNaN(n)) return;

  const clamped = Math.max(1900, Math.min(2100, n));
  setStartYear(clamped);

  // Normalize displayed value if clamped
  if (clamped !== n) setStartYearInput(String(clamped));
}}
onBlur={() => {
  // If they leave it blank, snap back to last valid
  if (startYearInput === "") {
    setStartYearInput(String(startYear));
    return;
  }

  // If they leave a partial year (like "202"), snap back
  if (!/^\d{4}$/.test(startYearInput)) {
    setStartYearInput(String(startYear));
    return;
  }

  const n = Number(startYearInput);
  const clamped = Math.max(1900, Math.min(2100, n));
  setStartYear(clamped);
  setStartYearInput(String(clamped));
}}

          />
        </label>

        <label className="block">
          <div className="font-medium">Total years worked (Or that you plan on working)</div>
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
              if (yearsWorkedInput === "") setYearsWorkedInput(String(yearsWorked));
            }}
          />
        </label>
      </div>

      <div className="rounded border p-4 space-y-3">
        <h2 className="text-xl font-semibold">Estimated Social Security contributions</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="font-semibold mb-1">Per year (snapshot)</div>
            <div>Wage base used: {formatUSD(perYearSnapshot.cap)}</div>
            <div>Taxable wages: {formatUSD(perYearSnapshot.taxableWages)}</div>
            <div className="mt-2">You pay: {formatUSD(perYearSnapshot.employee)}</div>
            <div>Employer pays: {formatUSD(perYearSnapshot.employer)}</div>
            <div className="mt-2 font-bold">Total: {formatUSD(perYearSnapshot.total)}</div>
          </div>

          <div>
            <div className="font-semibold mb-1">
              Over {totals.y} years ({totals.firstYear}–{totals.lastYear})
            </div>
            <div>First-year wage base: {formatUSD(totals.firstCap)}</div>
            <div>Last-year wage base: {formatUSD(totals.lastCap)}</div>
            <div className="mt-2">You pay: {formatUSD(totals.totalEmployee)}</div>
            <div>Employer pays: {formatUSD(totals.totalEmployer)}</div>
            <div className="mt-2 font-bold">Total: {formatUSD(totals.totalCombined)}</div>
          </div>
        </div>


<div className="pt-4 border-t">
  <h3 className="text-lg font-semibold">
    Estimated Social Security benefit at age 67
  </h3>

  <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div>
      <div className="text-sm text-gray-600">
        Estimated monthly benefit (at 67)
      </div>
      <div className="text-2xl font-bold">
        {formatUSD(benefitEstimate.piaMonthlyAt67)}
        <span className="text-sm font-normal text-gray-600"> / month</span>
      </div>
      <div className="mt-1 text-xs text-gray-600">
        Based on a simplified AIME → PIA estimate.
      </div>
    </div>

    <div>
      <div className="text-sm text-gray-600">
        Estimated total paid over an average lifespan
      </div>
      <div className="text-2xl font-bold">
        {formatUSD(benefitEstimate.totalLifetime)}
      </div>
      <div className="mt-1 text-xs text-gray-600">
        Assumes you begin taking payments at 67 and live to be 84.
      </div>
    </div>
  </div>

<p className="mt-3 text-xs text-gray-600">
  This is a simplified estimate that ignores wage indexing, COLAs, spousal
  benefits, and other rules. Bend points and life expectancy are based on SSA
  published references.
</p>

</div>




<div className="pt-4 border-t space-y-2">
  <h3 className="text-lg font-semibold">
    If those contributions were instead invested at 10%
  </h3>

  <div className="text-center">
    <div className="text-sm text-gray-600">
      Estimated value after {totals.y} years:
    </div>

    <div className="text-3xl font-extrabold text-emerald-700">
      {formatUSD(endingBalance)}
    </div>


<div className="my-4 h-px bg-gray-200" />

<div className="text-lg font-semibold">
  And if you continued investing while pulling out the same amount Social Security pays you,
  then you would have:
</div>


<div className="mt-1 text-3xl font-extrabold text-emerald-700">
  {formatUSD(endingBalanceAfterRetirement)}
</div>

<div className="mt-1 text-xs text-gray-600">
  Assumes you begin taking payments at 67 and live to be 84.
</div>


  </div>

  {/* Portfolio growth during work years + drawdown during retirement */}
  <div className="w-full max-w-2xl aspect-[6/5] mx-auto mt-4">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={portfolioSeries.points} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
        <defs>
          <linearGradient id="portfolioBalanceFill" x1="0" y1="0" x2="0" y2="1">
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

        <YAxis domain={[0, yAxisMax]} tickFormatter={(v) => formatYAxisTick(Number(v))} />

        <Tooltip
          content={<CustomPortfolioTooltip />}
          labelFormatter={(value) => {
            const first = xTicks[0];
            if (first != null && Number(value) === first) return "Now";
            return `Year ${value}`;
          }}
        />

        <Area
          type="monotone"
          dataKey="balance"
          name="Portfolio balance"
          stroke="#047857"
          fill="url(#portfolioBalanceFill)"
          dot={false}
          activeDot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>

  <p className="text-xs text-gray-600">
    <span className="font-medium">Investment assumption:</span> Assumes the combined employee and employer
    OASDI contributions are invested monthly and compound monthly using a 10% long-term annual return
    assumption. Results are illustrative only and not financial advice.
  </p>
</div>

      </div>
    </section>

  );
}
