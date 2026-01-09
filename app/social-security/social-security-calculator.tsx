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
 * Source: SSA OACT (Contribution and Benefit Base, 1937–2026).
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

const MIN_WAGE_BASE_YEAR = Math.min(
  ...Object.keys(OASDI_WAGE_BASE_BY_YEAR).map(Number),
);
const MAX_WAGE_BASE_YEAR = Math.max(
  ...Object.keys(OASDI_WAGE_BASE_BY_YEAR).map(Number),
);

/* --------------------------
   ADD: Historical OASDI rates
   -------------------------- */
// OASDI tax rates vary by year (employee and employer can differ in some years).
function getEmployeeOasdiRate(year: number) {
  // 2011–2012 employee payroll tax reduction (employer stayed 6.2%)
  if (year === 2011 || year === 2012) return 0.042;

  if (year === 1980) return 0.0508;
  if (year === 1981) return 0.0535;
  if (year === 1982 || year === 1983 || year === 1984) return 0.054;
  if (year === 1985 || year === 1986 || year === 1987) return 0.057;
  if (year === 1988 || year === 1989) return 0.0606;

  // 1990 and later (except 2011–2012 handled above)
  return 0.062;
}

function getEmployerOasdiRate(year: number) {
  if (year === 1980) return 0.0508;
  if (year === 1981) return 0.0535;
  if (year === 1982 || year === 1983) return 0.054;

  // 1984: employer 5.7%, employee 5.4% (employee credit)
  if (year === 1984) return 0.057;

  if (year === 1985 || year === 1986 || year === 1987) return 0.057;
  if (year === 1988 || year === 1989) return 0.0606;

  return 0.062;
}

/* --------------------------
   ADD: AWI for wage indexing
   -------------------------- */
// National Average Wage Index (AWI) values used for wage indexing.
// Include the years you need for your calculator range.
const AWI_BY_YEAR: Record<number, number> = {
  1980: 12513.46,
  1981: 13773.1,
  1982: 14531.34,
  1983: 15239.24,
  1984: 16135.07,
  1985: 16822.51,
  1986: 17321.82,
  1987: 18426.51,
  1988: 19334.04,
  1989: 20099.55,
  1990: 21027.98,
  1991: 21811.6,
  1992: 22935.42,
  1993: 23132.67,
  1994: 23753.53,
  1995: 24705.66,
  1996: 25913.9,
  1997: 27426.0,
  1998: 28861.44,
  1999: 30469.84,
  2000: 32154.82,
  2001: 32921.92,
  2002: 33252.09,
  2003: 34064.95,
  2004: 35648.55,
  2005: 36952.94,
  2006: 38651.41,
  2007: 40405.48,
  2008: 41334.97,
  2009: 40711.61,
  2010: 41673.83,
  2011: 42979.61,
  2012: 44321.67,
  2013: 44888.16,
  2014: 46481.52,
  2015: 48098.63,
  2016: 48642.15,
  2017: 50321.89,
  2018: 52145.8,
  2019: 54099.99,
  2020: 55628.6,
  2021: 60575.07,
  2022: 63795.13,
  2023: 66621.8,
  2024: 69846.57,
};

function getAWI(year: number) {
  if (AWI_BY_YEAR[year] != null) return AWI_BY_YEAR[year];
  const years = Object.keys(AWI_BY_YEAR)
    .map(Number)
    .sort((a, b) => a - b);
  if (year < years[0]) return AWI_BY_YEAR[years[0]];
  return AWI_BY_YEAR[years[years.length - 1]];
}

/* -------------------------------------
   ADD: Bend points by eligibility year
   ------------------------------------- */
const PIA_BEND_POINTS_BY_ELIGIBILITY_YEAR: Record<
  number,
  { b1: number; b2: number }
> = {
  2020: { b1: 960, b2: 5785 },
  2021: { b1: 996, b2: 6002 },
  2022: { b1: 1024, b2: 6172 },
  2023: { b1: 1115, b2: 6721 },
  2024: { b1: 1174, b2: 7078 },
  2025: { b1: 1226, b2: 7391 },
  2026: { b1: 1286, b2: 7749 },
};

function getBendPoints(eligibilityYear: number) {
  return (
    PIA_BEND_POINTS_BY_ELIGIBILITY_YEAR[eligibilityYear] ??
    PIA_BEND_POINTS_BY_ELIGIBILITY_YEAR[2026]
  );
}

// Remaining life expectancy at age 67 (SSA 2022 period life table).
// Male: 16.11, Female: 18.56. Use simple average as "average person".
const AVG_REMAINING_YEARS_AT_67 = (16.11 + 18.56) / 2;

/* -------------------------------
   CHANGE: calcPIAFromAIME signature
   ------------------------------- */
function calcPIAFromAIME(aime: number, bend1: number, bend2: number) {
  const x = Math.max(0, aime);

  const part1 = Math.min(x, bend1) * 0.9;
  const part2 = Math.max(0, Math.min(x, bend2) - bend1) * 0.32;
  const part3 = Math.max(0, x - bend2) * 0.15;

  const raw = part1 + part2 + part3;

  // SSA: round down to next lower multiple of $0.10
  return Math.floor(raw * 10) / 10;
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

  /* ADD: birth year prop */
  initialBirthYear?: number;
};

export default function SocialSecurityCalculator(props: Props) {
  const [income, setIncome] = useState(props.initialIncome ?? 100_000);

  const [yearsWorked, setYearsWorked] = useState(props.initialYearsWorked ?? 35);
  const [yearsWorkedInput, setYearsWorkedInput] = useState(
    String(props.initialYearsWorked ?? 35),
  );

  const defaultStartYear =
    props.initialStartYear ??
    new Date().getFullYear() - (props.initialYearsWorked ?? 35);
  const [startYear, setStartYear] = useState(defaultStartYear);
  const [startYearInput, setStartYearInput] = useState(String(defaultStartYear));

  /* ADD: birth year state */
  const [birthYear, setBirthYear] = useState(props.initialBirthYear ?? 1960);

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

      /* CHANGE: use historical rates */
      totalEmployee += taxableWages * getEmployeeOasdiRate(year);
      totalEmployer += taxableWages * getEmployerOasdiRate(year);
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
    const yearTurn60 = birthYear + 60;
    const eligibilityYear = birthYear + 62;
    const claimYear = birthYear + 67;

    const { b1, b2 } = getBendPoints(eligibilityYear);

    // Build indexed earnings (capped by wage base each year, then wage-indexed to yearTurn60).
    const indexed: number[] = [];

    for (let i = 0; i < workingYears.years; i += 1) {
      const year = workingYears.start + i;
      const cap = getWageBaseForYear(year);
      const covered = Math.min(income, cap);

      const factor = year < yearTurn60 ? getAWI(yearTurn60) / getAWI(year) : 1;
      indexed.push(covered * factor);
    }

    // Highest 35 years, then AIME is sum / 420 months.
    const top35 = indexed.slice().sort((a, b) => b - a).slice(0, 35);
    const sumTop35 = top35.reduce((s, v) => s + v, 0);

    // SSA: AIME rounded down to next lower dollar
    const aime = Math.floor(sumTop35 / 420);

    // PIA at eligibility bend points, rounded down to $0.10 inside function
    const piaAtEligibility = calcPIAFromAIME(aime, b1, b2);

    // Optional: COLAs from eligibility to claiming year.
    // This table is partial. If claimYear goes beyond what's listed, it will stop applying.
    const COLA_BY_JAN_YEAR: Record<number, number> = {
      2022: 0.059,
      2023: 0.087,
      2024: 0.032,
      2025: 0.025,
      2026: 0.028,
    };

    let colaFactor = 1;
    for (let y = eligibilityYear + 1; y <= claimYear; y += 1) {
      const cola = COLA_BY_JAN_YEAR[y];
      if (cola != null) colaFactor *= 1 + cola;
    }

    // Re-round to $0.10 after COLA factor
    const piaMonthlyAt67 = Math.floor(piaAtEligibility * colaFactor * 10) / 10;

    const totalLifetime = piaMonthlyAt67 * 12 * AVG_REMAINING_YEARS_AT_67;

    return {
      aime,
      piaMonthlyAt67,
      expectedYearsPaid: AVG_REMAINING_YEARS_AT_67,
      totalLifetime,
      eligibilityYear,
      yearTurn60,
      claimYear,
    };
  }, [income, workingYears.start, workingYears.years, birthYear]);

  const portfolioSeries = useMemo(() => {
    const y = workingYears.years;
    const start = workingYears.start;

    const startYearCalendar = new Date().getFullYear();

    const retirementMonths = Math.round(AVG_REMAINING_YEARS_AT_67 * 12);

    const monthlyWithdrawal = benefitEstimate.piaMonthlyAt67;

    let balance = 0;

    const points: { year: number; yearLabel: string; balance: number }[] = [
      { year: startYearCalendar, yearLabel: "Now", balance: 0 },
    ];

    // Accumulation phase (working years)
    for (let i = 0; i < y; i += 1) {
      const workYear = start + i;
      const cap = getWageBaseForYear(workYear);
      const taxableWages = Math.min(income, cap);

      /* CHANGE: use historical rates */
      const annualEmployee = taxableWages * getEmployeeOasdiRate(workYear);
      const annualEmployer = taxableWages * getEmployerOasdiRate(workYear);
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

    // Withdrawal phase
    let monthsSustained = 0;

    for (let monthIndex = 1; monthIndex <= retirementMonths; monthIndex += 1) {
      balance = balance * (1 + monthlyReturn) - monthlyWithdrawal;

      if (balance <= 0) {
        balance = 0;
        monthsSustained = monthIndex;
        break;
      }

      monthsSustained = monthIndex;

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
  const avgEmployeePerYear = totals.totalEmployee / totals.y;
  const avgEmployerPerYear = totals.totalEmployer / totals.y;
  const avgTotalPerYear = avgEmployeePerYear + avgEmployerPerYear;

  // “Per year” display uses the FIRST working year cap as a representative snapshot.
  const perYearSnapshot = useMemo(() => {
    const cap = getWageBaseForYear(workingYears.start);
    const taxableWages = Math.min(income, cap);

    /* CHANGE: use historical rates */
    const employee = taxableWages * getEmployeeOasdiRate(workingYears.start);
    const employer = taxableWages * getEmployerOasdiRate(workingYears.start);

    return { cap, taxableWages, employee, employer, total: employee + employer };
  }, [income, workingYears.start]);

  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <label className="block">
          <div className="font-medium">Average annual income</div>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            type="text"
            inputMode="numeric"
            value={`$${formatNumberInput(income)}`}
            onChange={(e) => setIncome(parseNumberInput(e.target.value))}
          />
        </label>

        {/* ADD: Birth year input */}
        <label className="block">
          <div className="font-medium">Birth year</div>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            type="number"
            min={1900}
            max={2100}
            value={birthYear}
            onChange={(e) => setBirthYear(Number(e.target.value))}
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

              if (v === "") return;
              if (!/^\d{1,4}$/.test(v)) return;
              if (v.length < 4) return;

              const n = Number(v);
              if (Number.isNaN(n)) return;

              const clamped = Math.max(1900, Math.min(2100, n));
              setStartYear(clamped);

              if (clamped !== n) setStartYearInput(String(clamped));
            }}
            onBlur={() => {
              if (startYearInput === "") {
                setStartYearInput(String(startYear));
                return;
              }

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
          <div className="font-medium">
            Total years worked (Or that you plan on working)
          </div>
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
            <div className="font-semibold mb-1">Per year</div>
            <div className="mt-2">You pay (on average): {formatUSD(totals.totalEmployee / totals.y)}</div>
            <div>Employer pays (on average): {formatUSD(totals.totalEmployer / totals.y)}</div>
            <div className="mt-2 font-bold">Total: {formatUSD(avgTotalPerYear)}</div>

            {/* Optional debug snapshot */}
            <div className="mt-3 text-xs text-gray-600">
              Snapshot (first year {workingYears.start}):
              {" "}
              cap {formatUSD(perYearSnapshot.cap)}, taxable {formatUSD(perYearSnapshot.taxableWages)}
            </div>
          </div>

          <div>
            <div className="font-semibold mb-1">
              Over {totals.y} years ({totals.firstYear}–{totals.lastYear})
            </div>
            <div className="mt-2">You pay: {formatUSD(totals.totalEmployee)}</div>
            <div>Employer pays: {formatUSD(totals.totalEmployer)}</div>
            <div className="mt-2 font-bold">Total: {formatUSD(totals.totalCombined)}</div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold">Estimated Social Security benefit at age 67</h3>

          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm text-gray-600">Estimated monthly benefit (at 67)</div>
              <div className="text-2xl font-bold">
                {formatUSD(benefitEstimate.piaMonthlyAt67)}
                <span className="text-sm font-normal text-gray-600"> / month</span>
              </div>
              <div className="mt-1 text-xs text-gray-600">
                Uses wage indexing to year you turn 60 and bend points for eligibility year (age 62),
                then applies listed COLAs through age 67 when available.
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Estimated total paid over an average lifespan</div>
              <div className="text-2xl font-bold">{formatUSD(benefitEstimate.totalLifetime)}</div>
              <div className="mt-1 text-xs text-gray-600">
                Assumes you begin taking payments at 67 and live to be 84.
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-600">
            This is still a simplified estimate and does not include spousal benefits, WEP/GPO,
            earnings test timing, or exact monthly claiming rules.
          </p>
        </div>

        <div className="pt-4 border-t space-y-2">
          <h3 className="text-lg font-semibold">If those contributions were instead invested at 10%</h3>

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
