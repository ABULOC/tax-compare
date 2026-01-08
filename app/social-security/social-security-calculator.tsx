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

/**
 * Social Security OASDI Contribution and Benefit Base (taxable maximum)
 * Source: SSA OACT (1937–2026)
 */
const OASDI_WAGE_BASE_BY_YEAR: Record<number, number> = {
  1937: 3_000,
  1951: 3_600,
  1955: 4_200,
  1959: 4_800,
  1966: 6_600,
  1968: 7_800,
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
  2012: 110_100,
  2013: 113_700,
  2014: 117_000,
  2015: 118_500,
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

const EMPLOYEE_RATE = 0.062;
const EMPLOYER_RATE = 0.062;

const PIA_BEND_1 = 1_286;
const PIA_BEND_2 = 7_749;

// Average remaining life expectancy at age 67 (men + women)
const AVG_REMAINING_YEARS_AT_67 = (16.11 + 18.56) / 2;

function getWageBaseForYear(year: number) {
  const years = Object.keys(OASDI_WAGE_BASE_BY_YEAR).map(Number).sort();
  for (let i = years.length - 1; i >= 0; i -= 1) {
    if (year >= years[i]) return OASDI_WAGE_BASE_BY_YEAR[years[i]];
  }
  return OASDI_WAGE_BASE_BY_YEAR[years[0]];
}

function calcPIAFromAIME(aime: number) {
  return (
    Math.min(aime, PIA_BEND_1) * 0.9 +
    Math.max(0, Math.min(aime, PIA_BEND_2) - PIA_BEND_1) * 0.32 +
    Math.max(0, aime - PIA_BEND_2) * 0.15
  );
}

function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatYAxisTick(v: number) {
  if (v < 1_000) return `$${v}`;
  if (v < 1_000_000) return `$${Math.round(v / 1_000)}k`;
  return `$${(v / 1_000_000).toFixed(1)}m`;
}

function CustomBalanceTooltip({ active, label, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-white px-4 py-3 shadow">
      <div className="text-sm text-gray-600">Year {label}</div>
      <div className="font-semibold">{formatUSD(payload[0].value)}</div>
    </div>
  );
}

export default function SocialSecurityCalculator() {
  const [income, setIncome] = useState(100_000);
  const [startYear, setStartYear] = useState(1990);
  const [yearsWorked, setYearsWorked] = useState(35);

  const annualReturn = 0.1;
  const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1;

  const benefitEstimate = useMemo(() => {
    const covered: number[] = [];

    for (let i = 0; i < yearsWorked; i += 1) {
      const cap = getWageBaseForYear(startYear + i);
      covered.push(Math.min(income, cap));
    }

    while (covered.length < 35) covered.push(0);

    const sumTop35 = covered.sort((a, b) => b - a).slice(0, 35).reduce((a, b) => a + b, 0);
    const aime = sumTop35 / (35 * 12);
    const pia = calcPIAFromAIME(aime);

    return {
      monthly: pia,
      yearsPaid: AVG_REMAINING_YEARS_AT_67,
    };
  }, [income, startYear, yearsWorked]);

  const withdrawalSeries = useMemo(() => {
    let balance = 0;
    let contributed = 0;
    const points = [{ year: new Date().getFullYear(), balance: 0 }];

    for (let i = 0; i < yearsWorked; i += 1) {
      const cap = getWageBaseForYear(startYear + i);
      const annual = Math.min(income, cap) * (EMPLOYEE_RATE + EMPLOYER_RATE);
      const monthly = annual / 12;

      for (let m = 0; m < 12; m += 1) {
        balance = balance * (1 + monthlyReturn) + monthly;
        contributed += monthly;
      }

      points.push({ year: points[0].year + i + 1, balance });
    }

    const workEndBalance = balance;
    const workEndPrincipal = contributed;
    const workEndInterest = workEndBalance - workEndPrincipal;

    const monthsRetired = Math.round(benefitEstimate.yearsPaid * 12);
    const withdrawal = benefitEstimate.monthly;

    for (let m = 1; m <= monthsRetired; m += 1) {
      balance = Math.max(0, balance * (1 + monthlyReturn) - withdrawal);
      if (m % 12 === 0) {
        points.push({ year: points[0].year + yearsWorked + m / 12, balance });
      }
    }

    return {
      points,
      workEndBalance,
      workEndPrincipal,
      workEndInterest,
    };
  }, [income, startYear, yearsWorked, benefitEstimate, monthlyReturn]);

  return (
    <section className="space-y-6">
      <div className="rounded border p-4 space-y-4">
        <h3 className="text-lg font-semibold">If those contributions were invested at 10%</h3>

        <div className="text-center">
          <div className="text-sm text-gray-600">
            Estimated value after {yearsWorked} years
          </div>
          <div className="text-3xl font-extrabold text-emerald-700">
            {formatUSD(withdrawalSeries.workEndBalance)}
          </div>
          <div className="text-sm text-gray-700">
            Principal: {formatUSD(withdrawalSeries.workEndPrincipal)} · Interest:{" "}
            {formatUSD(withdrawalSeries.workEndInterest)}
          </div>
        </div>

        <div className="w-full aspect-[6/5]">
          <ResponsiveContainer>
            <AreaChart data={withdrawalSeries.points}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={formatYAxisTick} />
              <Tooltip content={<CustomBalanceTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#111827"
                fill="#111827"
                fillOpacity={0.15}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
