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


export type StateKey =
  | "AZ" | "CA" | "CO" | "FL" | "GA"
  | "IL" | "NV" | "NY" | "TX" | "WA"
  | "MA" | "NJ" | "PA" | "NC" | "TN"
  | "AL" | "AR" | "CT" | "DE" | "HI"
  | "IA" | "ID" | "IN" | "KS" | "MI"
  | "AK" | "LA" | "MN" | "MS" | "NH"
  | "OR" | "SD" | "UT" | "WI" | "WY"
  | "KY" | "MD" | "ME" | "MO" | "MT"
  | "NE" | "NM" | "ND" | "OH" | "OK"
  | "RI" | "SC" | "VA" | "VT" | "WV";




export type FilingStatus = "SINGLE" | "MFJ" | "HOH";

const FILING_STATUSES: { key: FilingStatus; name: string }[] = [
  { key: "SINGLE", name: "Single" },
  { key: "MFJ", name: "Married filing jointly" },
  { key: "HOH", name: "Head of household" },
];


function getStateTaxableIncome(
  state: StateKey,
  filingStatus: FilingStatus,
  grossIncome: number
) {
  const rule = STATE_TAX_RULES[state];
  const deduction =
    rule.incomeTax?.standardDeductionByStatus?.[filingStatus] ?? 0;

  return Math.max(0, grossIncome - deduction);
}





type TaxBracket = {
  /** Upper bound for this bracket (inclusive). Use null for “no upper bound”. */
  upTo: number | null;
  /** Marginal rate for this bracket (example: 0.055 for 5.5%) */
  rate: number;
};

function calcProgressiveTax(taxableIncome: number, brackets: TaxBracket[]) {
  const income = Math.max(0, taxableIncome);
  if (income === 0) return 0;

  let tax = 0;
  let prevCap = 0;

  for (const b of brackets) {
    const cap = b.upTo ?? Number.POSITIVE_INFINITY;

    if (income <= prevCap) break;

    const amountInBracket = Math.min(income, cap) - prevCap;
    if (amountInBracket > 0) {
      tax += amountInBracket * b.rate;
    }

    prevCap = cap;
  }

  return tax;
}


type StateTaxRule = {
  name: string;
  propertyTaxRate: number;

  // If a state has no wage income tax, set to null
  incomeTax?: {
    bracketsByStatus?: Record<FilingStatus, TaxBracket[]>;
    flatRate?: number;

    // Optional standard deduction used by your simplified model
    standardDeductionByStatus?: Partial<Record<FilingStatus, number>>;

    // Optional surtaxes
    surtax?: {
      threshold: number;
      rate: number;
    }[];
  } | null;
};

export const STATE_TAX_RULES: Record<StateKey, StateTaxRule> = {
  AZ: {
    name: "Arizona",
    propertyTaxRate: 0.0056,
    incomeTax: {
      flatRate: 0.025,
      standardDeductionByStatus: {
        SINGLE: 15_750,
        MFJ: 31_500,
        HOH: 23_625,
      },
    },
  },
  CA: {
    name: "California",
    propertyTaxRate: 0.0075,
    incomeTax: {
      bracketsByStatus: {
        SINGLE: [
          { upTo: 11_079, rate: 0.01 },
          { upTo: 26_264, rate: 0.02 },
          { upTo: 41_452, rate: 0.04 },
          { upTo: 57_542, rate: 0.06 },
          { upTo: 72_724, rate: 0.08 },
          { upTo: 371_479, rate: 0.093 },
          { upTo: 445_771, rate: 0.103 },
          { upTo: 742_953, rate: 0.113 },
          { upTo: null, rate: 0.123 },
        ],
        MFJ: [
          { upTo: 22_158, rate: 0.01 },
          { upTo: 52_528, rate: 0.02 },
          { upTo: 82_904, rate: 0.04 },
          { upTo: 115_084, rate: 0.06 },
          { upTo: 145_448, rate: 0.08 },
          { upTo: 742_958, rate: 0.093 },
          { upTo: 891_542, rate: 0.103 },
          { upTo: 1_485_906, rate: 0.113 },
          { upTo: null, rate: 0.123 },
        ],
        HOH: [
          { upTo: 22_173, rate: 0.01 },
          { upTo: 52_530, rate: 0.02 },
          { upTo: 67_716, rate: 0.04 },
          { upTo: 83_805, rate: 0.06 },
          { upTo: 98_990, rate: 0.08 },
          { upTo: 505_208, rate: 0.093 },
          { upTo: 606_251, rate: 0.103 },
          { upTo: 1_010_417, rate: 0.113 },
          { upTo: null, rate: 0.123 },
        ],
      },
      standardDeductionByStatus: {
        SINGLE: 5_363,
        MFJ: 10_726,
        HOH: 10_726,
      },
      surtax: [{ threshold: 1_000_000, rate: 0.01 }],
    },
  },
  CO: {
    name: "Colorado",
    propertyTaxRate: 0.0049,
    incomeTax: { flatRate: 0.044 },
  },
  FL: {
    name: "Florida",
    propertyTaxRate: 0.01,
    incomeTax: null,
  },
  GA: {
    name: "Georgia",
    propertyTaxRate: 0.0083,
    incomeTax: {
      flatRate: 0.0519,
      standardDeductionByStatus: {
        SINGLE: 12_000,
        MFJ: 24_000,
        HOH: 12_000,
      },
    },
  },
  IL: {
    name: "Illinois",
    propertyTaxRate: 0.022,
    incomeTax: { flatRate: 0.0495 },
  },
  MA: {
    name: "Massachusetts",
    propertyTaxRate: 0.0112,
    incomeTax: {
      flatRate: 0.05,
      surtax: [{ threshold: 1_000_000, rate: 0.04 }],
    },
  },
  NC: {
    name: "North Carolina",
    propertyTaxRate: 0.0078,
    incomeTax: { flatRate: 0.045 },
  },
  NJ: {
    name: "New Jersey",
    propertyTaxRate: 0.0208,
    incomeTax: {
      bracketsByStatus: {
        // NJ brackets are the same by filing status in this simplified version.
        SINGLE: [
          { upTo: 20_000, rate: 0.014 },
          { upTo: 35_000, rate: 0.0175 },
          { upTo: 40_000, rate: 0.035 },
          { upTo: 75_000, rate: 0.05525 },
          { upTo: 500_000, rate: 0.0637 },
          { upTo: 1_000_000, rate: 0.0897 },
          { upTo: null, rate: 0.1075 },
        ],
        MFJ: [
          { upTo: 20_000, rate: 0.014 },
          { upTo: 35_000, rate: 0.0175 },
          { upTo: 40_000, rate: 0.035 },
          { upTo: 75_000, rate: 0.05525 },
          { upTo: 500_000, rate: 0.0637 },
          { upTo: 1_000_000, rate: 0.0897 },
          { upTo: null, rate: 0.1075 },
        ],
        HOH: [
          { upTo: 20_000, rate: 0.014 },
          { upTo: 35_000, rate: 0.0175 },
          { upTo: 40_000, rate: 0.035 },
          { upTo: 75_000, rate: 0.05525 },
          { upTo: 500_000, rate: 0.0637 },
          { upTo: 1_000_000, rate: 0.0897 },
          { upTo: null, rate: 0.1075 },
        ],
      },
    },
  },
  NV: {
    name: "Nevada",
    propertyTaxRate: 0.005,
    incomeTax: null,
  },
  NY: {
    name: "New York",
    propertyTaxRate: 0.013,
    incomeTax: {
      bracketsByStatus: {
        SINGLE: [
          { upTo: 8_500, rate: 0.04 },
          { upTo: 11_700, rate: 0.045 },
          { upTo: 13_900, rate: 0.0525 },
          { upTo: 80_650, rate: 0.055 },
          { upTo: 215_400, rate: 0.06 },
          { upTo: 1_077_550, rate: 0.0685 },
          { upTo: 5_000_000, rate: 0.0965 },
          { upTo: 25_000_000, rate: 0.103 },
          { upTo: null, rate: 0.109 },
        ],
        MFJ: [
          { upTo: 17_150, rate: 0.04 },
          { upTo: 23_600, rate: 0.045 },
          { upTo: 27_900, rate: 0.0525 },
          { upTo: 161_550, rate: 0.055 },
          { upTo: 323_200, rate: 0.06 },
          { upTo: 2_155_350, rate: 0.0685 },
          { upTo: 5_000_000, rate: 0.0965 },
          { upTo: 25_000_000, rate: 0.103 },
          { upTo: null, rate: 0.109 },
        ],
        HOH: [
          { upTo: 12_800, rate: 0.04 },
          { upTo: 17_650, rate: 0.045 },
          { upTo: 20_900, rate: 0.0525 },
          { upTo: 107_650, rate: 0.055 },
          { upTo: 269_300, rate: 0.06 },
          { upTo: 1_616_450, rate: 0.0685 },
          { upTo: 5_000_000, rate: 0.0965 },
          { upTo: 25_000_000, rate: 0.103 },
          { upTo: null, rate: 0.109 },
        ],
      },
      standardDeductionByStatus: {
        SINGLE: 8_000,
        MFJ: 16_050,
        HOH: 11_200,
      },
    },
  },
  PA: {
    name: "Pennsylvania",
    propertyTaxRate: 0.0158,
    incomeTax: { flatRate: 0.0307 },
  },
  TN: {
    name: "Tennessee",
    propertyTaxRate: 0.0074,
    incomeTax: null,
  },
  TX: {
    name: "Texas",
    propertyTaxRate: 0.018,
    incomeTax: null,
  },
  WA: {
    name: "Washington",
    propertyTaxRate: 0.0088,
    incomeTax: null,
  },

    AL: {
    name: "Alabama",
    propertyTaxRate: 0.0038,
    incomeTax: {
      bracketsByStatus: {
        SINGLE: [
          { upTo: 500, rate: 0.02 },
          { upTo: 3_000, rate: 0.04 },
          { upTo: null, rate: 0.05 },
        ],
        MFJ: [
          { upTo: 1_000, rate: 0.02 },
          { upTo: 6_000, rate: 0.04 },
          { upTo: null, rate: 0.05 },
        ],
        HOH: [
          { upTo: 500, rate: 0.02 },
          { upTo: 3_000, rate: 0.04 },
          { upTo: null, rate: 0.05 },
        ],
      },
    },
  },

  AR: {
    name: "Arkansas",
    propertyTaxRate: 0.0059,
    incomeTax: {
      bracketsByStatus: {
        // Uses the <= $92,300 table as a single progressive schedule in this model.
        SINGLE: [
          { upTo: 5_499, rate: 0.0 },
          { upTo: 10_899, rate: 0.02 },
          { upTo: 15_599, rate: 0.03 },
          { upTo: 25_699, rate: 0.034 },
          { upTo: 92_300, rate: 0.039 },
          { upTo: null, rate: 0.039 },
        ],
        MFJ: [
          { upTo: 5_499, rate: 0.0 },
          { upTo: 10_899, rate: 0.02 },
          { upTo: 15_599, rate: 0.03 },
          { upTo: 25_699, rate: 0.034 },
          { upTo: 92_300, rate: 0.039 },
          { upTo: null, rate: 0.039 },
        ],
        HOH: [
          { upTo: 5_499, rate: 0.0 },
          { upTo: 10_899, rate: 0.02 },
          { upTo: 15_599, rate: 0.03 },
          { upTo: 25_699, rate: 0.034 },
          { upTo: 92_300, rate: 0.039 },
          { upTo: null, rate: 0.039 },
        ],
      },
    },
  },

  CT: {
    name: "Connecticut",
    propertyTaxRate: 0.02,
    incomeTax: {
      bracketsByStatus: {
        SINGLE: [
          { upTo: 10_000, rate: 0.02 },
          { upTo: 50_000, rate: 0.045 },
          { upTo: 100_000, rate: 0.055 },
          { upTo: 200_000, rate: 0.06 },
          { upTo: 250_000, rate: 0.065 },
          { upTo: 500_000, rate: 0.069 },
          { upTo: null, rate: 0.0699 },
        ],
        MFJ: [
          { upTo: 20_000, rate: 0.02 },
          { upTo: 100_000, rate: 0.045 },
          { upTo: 200_000, rate: 0.055 },
          { upTo: 400_000, rate: 0.06 },
          { upTo: 500_000, rate: 0.065 },
          { upTo: 1_000_000, rate: 0.069 },
          { upTo: null, rate: 0.0699 },
        ],
        HOH: [
          { upTo: 16_000, rate: 0.02 },
          { upTo: 80_000, rate: 0.045 },
          { upTo: 160_000, rate: 0.055 },
          { upTo: 320_000, rate: 0.06 },
          { upTo: 400_000, rate: 0.065 },
          { upTo: 800_000, rate: 0.069 },
          { upTo: null, rate: 0.0699 },
        ],
      },
    },
  },

  DE: {
    name: "Delaware",
    propertyTaxRate: 0.0055,
    incomeTax: {
      // Same brackets in this simplified model for all filing statuses
      bracketsByStatus: {
        SINGLE: [
          { upTo: 2_000, rate: 0.0 },
          { upTo: 5_000, rate: 0.022 },
          { upTo: 10_000, rate: 0.039 },
          { upTo: 20_000, rate: 0.048 },
          { upTo: 25_000, rate: 0.052 },
          { upTo: 60_000, rate: 0.0555 },
          { upTo: null, rate: 0.066 },
        ],
        MFJ: [
          { upTo: 2_000, rate: 0.0 },
          { upTo: 5_000, rate: 0.022 },
          { upTo: 10_000, rate: 0.039 },
          { upTo: 20_000, rate: 0.048 },
          { upTo: 25_000, rate: 0.052 },
          { upTo: 60_000, rate: 0.0555 },
          { upTo: null, rate: 0.066 },
        ],
        HOH: [
          { upTo: 2_000, rate: 0.0 },
          { upTo: 5_000, rate: 0.022 },
          { upTo: 10_000, rate: 0.039 },
          { upTo: 20_000, rate: 0.048 },
          { upTo: 25_000, rate: 0.052 },
          { upTo: 60_000, rate: 0.0555 },
          { upTo: null, rate: 0.066 },
        ],
      },
    },
  },

  HI: {
    name: "Hawaii",
    propertyTaxRate: 0.0027,
    incomeTax: {
              standardDeductionByStatus: {
        SINGLE: 4_400,
        MFJ: 8_800,
        HOH: 6_424,
      },
      bracketsByStatus: {
        SINGLE: [
          { upTo: 9_600, rate: 0.014 },
          { upTo: 14_400, rate: 0.032 },
          { upTo: 19_200, rate: 0.055 },
          { upTo: 24_000, rate: 0.064 },
          { upTo: 36_000, rate: 0.068 },
          { upTo: 48_000, rate: 0.072 },
          { upTo: 125_000, rate: 0.076 },
          { upTo: 175_000, rate: 0.079 },
          { upTo: 225_000, rate: 0.0825 },
          { upTo: 275_000, rate: 0.09 },
          { upTo: 325_000, rate: 0.10 },
          { upTo: null, rate: 0.11 },
        ],
        MFJ: [
          { upTo: 19_200, rate: 0.014 },
          { upTo: 28_800, rate: 0.032 },
          { upTo: 38_400, rate: 0.055 },
          { upTo: 48_000, rate: 0.064 },
          { upTo: 72_000, rate: 0.068 },
          { upTo: 96_000, rate: 0.072 },
          { upTo: 250_000, rate: 0.076 },
          { upTo: 350_000, rate: 0.079 },
          { upTo: 450_000, rate: 0.0825 },
          { upTo: 550_000, rate: 0.09 },
          { upTo: 650_000, rate: 0.10 },
          { upTo: null, rate: 0.11 },
        ],
        HOH: [
          { upTo: 14_400, rate: 0.014 },
          { upTo: 21_600, rate: 0.032 },
          { upTo: 28_800, rate: 0.055 },
          { upTo: 36_000, rate: 0.064 },
          { upTo: 54_000, rate: 0.068 },
          { upTo: 72_000, rate: 0.072 },
          { upTo: 187_500, rate: 0.076 },
          { upTo: 262_500, rate: 0.079 },
          { upTo: 337_500, rate: 0.0825 },
          { upTo: 412_500, rate: 0.09 },
          { upTo: 487_500, rate: 0.10 },
          { upTo: null, rate: 0.11 },
        ],
      },
    },
  },

  IA: {
    name: "Iowa",
    propertyTaxRate: 0.0149,
    incomeTax: {
      flatRate: 0.038,
    },
  },

  ID: {
    name: "Idaho",
    propertyTaxRate: 0.0043,
    incomeTax: {
      bracketsByStatus: {
        SINGLE: [
          { upTo: 4_811, rate: 0.0 },
          { upTo: null, rate: 0.053 },
        ],
        MFJ: [
          { upTo: 9_622, rate: 0.0 },
          { upTo: null, rate: 0.053 },
        ],
        HOH: [
          { upTo: 4_811, rate: 0.0 },
          { upTo: null, rate: 0.053 },
        ],
      },
    },
  },

  IN: {
    name: "Indiana",
    propertyTaxRate: 0.0077,
    incomeTax: {
      flatRate: 0.03,
    },
  },

  KS: {
    name: "Kansas",
    propertyTaxRate: 0.0134,
    incomeTax: {
              standardDeductionByStatus: {
        SINGLE: 3_605,
        MFJ: 8_240,
        HOH: 6_180,
      },

      bracketsByStatus: {
        SINGLE: [
          { upTo: 15_000, rate: 0.031 },
          { upTo: 30_000, rate: 0.0525 },
          { upTo: null, rate: 0.057 },
        ],
        MFJ: [
          { upTo: 30_000, rate: 0.031 },
          { upTo: 60_000, rate: 0.0525 },
          { upTo: null, rate: 0.057 },
        ],
        HOH: [
          { upTo: 15_000, rate: 0.031 },
          { upTo: 30_000, rate: 0.0525 },
          { upTo: null, rate: 0.057 },
        ],
      },
    },
  },

  MI: {
    name: "Michigan",
    propertyTaxRate: 0.0118,
    incomeTax: {
      flatRate: 0.0425,
    },
  },


    AK: {
    name: "Alaska",
    propertyTaxRate: 0.0107,
    incomeTax: null,
  },

  LA: {
    name: "Louisiana",
    propertyTaxRate: 0.0055,
    incomeTax: {
      flatRate: 0.03, // flat 3% for tax periods beginning on/after Jan 1, 2025
    },
  },

  MN: {
    name: "Minnesota",
    propertyTaxRate: 0.0099,
    incomeTax: {
      bracketsByStatus: {
        SINGLE: [
          { upTo: 31_690, rate: 0.0535 },
          { upTo: 104_090, rate: 0.068 },
          { upTo: 193_240, rate: 0.0785 },
          { upTo: null, rate: 0.0985 },
        ],
        MFJ: [
          { upTo: 48_700, rate: 0.0535 },
          { upTo: 193_480, rate: 0.068 },
          { upTo: 337_930, rate: 0.0785 },
          { upTo: null, rate: 0.0985 },
        ],
        HOH: [
          { upTo: 39_010, rate: 0.0535 },
          { upTo: 156_760, rate: 0.068 },
          { upTo: 256_880, rate: 0.0785 },
          { upTo: null, rate: 0.0985 },
        ],
      },
    },
  },

  MS: {
    name: "Mississippi",
    propertyTaxRate: 0.007,
    incomeTax: {
      // Mississippi publishes rates as "excess of $10,000 taxed at X%"
      bracketsByStatus: {
        SINGLE: [
          { upTo: 10_000, rate: 0.0 },
          { upTo: null, rate: 0.04 }, // tax year 2026 rate
        ],
        MFJ: [
          { upTo: 10_000, rate: 0.0 },
          { upTo: null, rate: 0.04 }, // tax year 2026 rate
        ],
        HOH: [
          { upTo: 10_000, rate: 0.0 },
          { upTo: null, rate: 0.04 }, // tax year 2026 rate
        ],
      },
    },
  },

  NH: {
    name: "New Hampshire",
    propertyTaxRate: 0.0161,
    incomeTax: null, // no tax on W-2 wages
  },

  OR: {
    name: "Oregon",
    propertyTaxRate: 0.0077,
    incomeTax: {
      bracketsByStatus: {
        // 2025 OR-40 full-year resident tables and rate charts
        SINGLE: [
          { upTo: 4_400, rate: 0.0475 },
          { upTo: 11_200, rate: 0.0675 },
          { upTo: 125_000, rate: 0.0875 },
          { upTo: null, rate: 0.099 },
        ],
        MFJ: [
          { upTo: 8_800, rate: 0.0475 },
          { upTo: 22_200, rate: 0.0675 },
          { upTo: 250_000, rate: 0.0875 },
          { upTo: null, rate: 0.099 },
        ],
        HOH: [
          { upTo: 8_800, rate: 0.0475 },
          { upTo: 22_200, rate: 0.0675 },
          { upTo: 250_000, rate: 0.0875 },
          { upTo: null, rate: 0.099 },
        ],
      },
      standardDeductionByStatus: {
        SINGLE: 2_835,
        MFJ: 5_670,
        HOH: 4_560,
      },
    },
  },

  SD: {
    name: "South Dakota",
    propertyTaxRate: 0.0101,
    incomeTax: null,
  },

  UT: {
    name: "Utah",
    propertyTaxRate: 0.0047,
    incomeTax: {
      flatRate: 0.0455, // Jan 1, 2024 – current
    },
  },

  WI: {
    name: "Wisconsin",
    propertyTaxRate: 0.0125,
    incomeTax: {
      bracketsByStatus: {
        // 2025 WI bracket thresholds
        SINGLE: [
          { upTo: 14_679, rate: 0.035 },
          { upTo: 50_479, rate: 0.044 },
          { upTo: 323_289, rate: 0.053 },
          { upTo: null, rate: 0.0765 },
        ],
        HOH: [
          { upTo: 14_679, rate: 0.035 },
          { upTo: 50_479, rate: 0.044 },
          { upTo: 323_289, rate: 0.053 },
          { upTo: null, rate: 0.0765 },
        ],
        MFJ: [
          { upTo: 19_579, rate: 0.035 },
          { upTo: 67_299, rate: 0.044 },
          { upTo: 431_059, rate: 0.053 },
          { upTo: null, rate: 0.0765 },
        ],
      },
    },
  },

  WY: {
    name: "Wyoming",
    propertyTaxRate: 0.0055,
    incomeTax: null,
  },



    KY: {
    name: "Kentucky",
    propertyTaxRate: 0.0074,
    incomeTax: { flatRate: 0.035 }, // tax year 2026 withholding rate
  },

  MD: {
    name: "Maryland",
    propertyTaxRate: 0.0095,
    incomeTax: {
      // NOTE: Maryland also has county/local income taxes. This model is STATE-ONLY.
      // The state has progressive rates up through 5.75%, plus new high-income brackets.
      // For full fidelity you’d want the complete official bracket table; this keeps the
      // high-income changes and approximates the lower tiers.
      bracketsByStatus: {
        SINGLE: [
          { upTo: 1_000, rate: 0.02 },
          { upTo: 2_000, rate: 0.03 },
          { upTo: 3_000, rate: 0.04 },
          { upTo: 100_000, rate: 0.0475 },
          { upTo: 125_000, rate: 0.05 },
          { upTo: 150_000, rate: 0.0525 },
          { upTo: 250_000, rate: 0.055 },
          { upTo: 500_000, rate: 0.0575 },
          { upTo: 1_000_000, rate: 0.0625 },
          { upTo: null, rate: 0.065 },
        ],
        MFJ: [
          { upTo: 1_000, rate: 0.02 },
          { upTo: 2_000, rate: 0.03 },
          { upTo: 3_000, rate: 0.04 },
          { upTo: 150_000, rate: 0.0475 },
          { upTo: 175_000, rate: 0.05 },
          { upTo: 225_000, rate: 0.0525 },
          { upTo: 300_000, rate: 0.055 },
          { upTo: 600_000, rate: 0.0575 },
          { upTo: 1_200_000, rate: 0.0625 },
          { upTo: null, rate: 0.065 },
        ],
        HOH: [
          { upTo: 1_000, rate: 0.02 },
          { upTo: 2_000, rate: 0.03 },
          { upTo: 3_000, rate: 0.04 },
          { upTo: 150_000, rate: 0.0475 },
          { upTo: 175_000, rate: 0.05 },
          { upTo: 225_000, rate: 0.0525 },
          { upTo: 300_000, rate: 0.055 },
          { upTo: 600_000, rate: 0.0575 },
          { upTo: 1_200_000, rate: 0.0625 },
          { upTo: null, rate: 0.065 },
        ],
      },
      standardDeductionByStatus: {
        SINGLE: 3_350,
        MFJ: 6_700,
        HOH: 6_700,
      },
    },
  },

  ME: {
    name: "Maine",
    propertyTaxRate: 0.0124,
    incomeTax: {
      bracketsByStatus: {
        SINGLE: [
          { upTo: 26_800, rate: 0.058 },
          { upTo: 63_450, rate: 0.0675 },
          { upTo: null, rate: 0.0715 },
        ],
        MFJ: [
          { upTo: 53_600, rate: 0.058 },
          { upTo: 126_900, rate: 0.0675 },
          { upTo: null, rate: 0.0715 },
        ],
        HOH: [
          { upTo: 40_200, rate: 0.058 },
          { upTo: 95_150, rate: 0.0675 },
          { upTo: null, rate: 0.0715 },
        ],
      },
      standardDeductionByStatus: {
        SINGLE: 15_000,
        MFJ: 30_000,
        HOH: 22_500,
      },
    },
  },

  MO: {
    name: "Missouri",
    propertyTaxRate: 0.0088,
    incomeTax: {
      // Same rate chart used here for all statuses in this simplified model.
      bracketsByStatus: {
        SINGLE: [
          { upTo: 1_313, rate: 0.0 },
          { upTo: 2_626, rate: 0.02 },
          { upTo: 3_939, rate: 0.025 },
          { upTo: 5_252, rate: 0.03 },
          { upTo: 6_565, rate: 0.035 },
          { upTo: 7_878, rate: 0.04 },
          { upTo: 9_191, rate: 0.045 },
          { upTo: null, rate: 0.047 },
        ],
        MFJ: [
          { upTo: 1_313, rate: 0.0 },
          { upTo: 2_626, rate: 0.02 },
          { upTo: 3_939, rate: 0.025 },
          { upTo: 5_252, rate: 0.03 },
          { upTo: 6_565, rate: 0.035 },
          { upTo: 7_878, rate: 0.04 },
          { upTo: 9_191, rate: 0.045 },
          { upTo: null, rate: 0.047 },
        ],
        HOH: [
          { upTo: 1_313, rate: 0.0 },
          { upTo: 2_626, rate: 0.02 },
          { upTo: 3_939, rate: 0.025 },
          { upTo: 5_252, rate: 0.03 },
          { upTo: 6_565, rate: 0.035 },
          { upTo: 7_878, rate: 0.04 },
          { upTo: 9_191, rate: 0.045 },
          { upTo: null, rate: 0.047 },
        ],
      },
    },
  },

  MT: {
    name: "Montana",
    propertyTaxRate: 0.006,
    incomeTax: {
      bracketsByStatus: {
        SINGLE: [
          { upTo: 21_100, rate: 0.047 },
          { upTo: null, rate: 0.059 },
        ],
        MFJ: [
          { upTo: 42_200, rate: 0.047 },
          { upTo: null, rate: 0.059 },
        ],
        HOH: [
          { upTo: 21_100, rate: 0.047 },
          { upTo: null, rate: 0.059 },
        ],
      },
    },
  },

  NE: {
    name: "Nebraska",
    propertyTaxRate: 0.0143,
    incomeTax: {
      bracketsByStatus: {
        SINGLE: [
          { upTo: 4_030, rate: 0.0246 },
          { upTo: 24_120, rate: 0.0351 },
          { upTo: 38_870, rate: 0.0501 },
          { upTo: null, rate: 0.052 },
        ],
        MFJ: [
          { upTo: 8_040, rate: 0.0246 },
          { upTo: 48_250, rate: 0.0351 },
          { upTo: 77_730, rate: 0.0501 },
          { upTo: null, rate: 0.052 },
        ],
        HOH: [
          { upTo: 7_510, rate: 0.0246 },
          { upTo: 38_590, rate: 0.0351 },
          { upTo: 57_630, rate: 0.0501 },
          { upTo: null, rate: 0.052 },
        ],
      },
    },
  },

  NM: {
    name: "New Mexico",
    propertyTaxRate: 0.006,
    incomeTax: {
      bracketsByStatus: {
        SINGLE: [
          { upTo: 5_500, rate: 0.017 },
          { upTo: 11_000, rate: 0.032 },
          { upTo: 16_000, rate: 0.047 },
          { upTo: 210_000, rate: 0.049 },
          { upTo: null, rate: 0.059 },
        ],
        MFJ: [
          { upTo: 8_000, rate: 0.017 },
          { upTo: 16_000, rate: 0.032 },
          { upTo: 24_000, rate: 0.047 },
          { upTo: 315_000, rate: 0.049 },
          { upTo: null, rate: 0.059 },
        ],
        HOH: [
          { upTo: 8_000, rate: 0.017 },
          { upTo: 16_000, rate: 0.032 },
          { upTo: 24_000, rate: 0.047 },
          { upTo: 315_000, rate: 0.049 },
          { upTo: null, rate: 0.059 },
        ],
      },
    },
  },

  ND: {
    name: "North Dakota",
    propertyTaxRate: 0.0094,
    incomeTax: {
      bracketsByStatus: {
        SINGLE: [
          { upTo: 48_475, rate: 0.0 },
          { upTo: 244_825, rate: 0.0195 },
          { upTo: null, rate: 0.025 },
        ],
        MFJ: [
          { upTo: 80_975, rate: 0.0 },
          { upTo: 298_075, rate: 0.0195 },
          { upTo: null, rate: 0.025 },
        ],
        HOH: [
          { upTo: 48_475, rate: 0.0 },
          { upTo: 244_825, rate: 0.0195 },
          { upTo: null, rate: 0.025 },
        ],
      },
    },
  },

  OH: {
    name: "Ohio",
    propertyTaxRate: 0.0131,
    incomeTax: {
      // NOTE: Ohio also has many local/municipal income taxes. This is STATE-ONLY.
      bracketsByStatus: {
        SINGLE: [
          { upTo: 26_050, rate: 0.0 },
          { upTo: 100_000, rate: 0.0275 },
          { upTo: null, rate: 0.03125 },
        ],
        MFJ: [
          { upTo: 26_050, rate: 0.0 },
          { upTo: 100_000, rate: 0.0275 },
          { upTo: null, rate: 0.03125 },
        ],
        HOH: [
          { upTo: 26_050, rate: 0.0 },
          { upTo: 100_000, rate: 0.0275 },
          { upTo: null, rate: 0.03125 },
        ],
      },
    },
  },

  OK: {
    name: "Oklahoma",
    propertyTaxRate: 0.0077,
    incomeTax: {
      standardDeductionByStatus: {
        SINGLE: 6_350,
        MFJ: 12_700,
        HOH: 9_350,
      },

      bracketsByStatus: {
        SINGLE: [
          { upTo: 1_000, rate: 0.0025 },
          { upTo: 2_500, rate: 0.0075 },
          { upTo: 3_750, rate: 0.0175 },
          { upTo: 4_900, rate: 0.0275 },
          { upTo: 7_200, rate: 0.0375 },
          { upTo: null, rate: 0.0475 },
        ],
        MFJ: [
          { upTo: 2_000, rate: 0.0025 },
          { upTo: 5_000, rate: 0.0075 },
          { upTo: 7_500, rate: 0.0175 },
          { upTo: 9_800, rate: 0.0275 },
          { upTo: 12_200, rate: 0.0375 },
          { upTo: null, rate: 0.0475 },
        ],
        HOH: [
          { upTo: 1_000, rate: 0.0025 },
          { upTo: 2_500, rate: 0.0075 },
          { upTo: 3_750, rate: 0.0175 },
          { upTo: 4_900, rate: 0.0275 },
          { upTo: 7_200, rate: 0.0375 },
          { upTo: null, rate: 0.0475 },
        ],
      },
    },
  },

  RI: {
    name: "Rhode Island",
    propertyTaxRate: 0.0105,
    incomeTax: {
              standardDeductionByStatus: {
        SINGLE: 10_900,
        MFJ: 21_800,
        HOH: 16_350,
      },

      // RI uses one schedule (thresholds vary by filing status in law, but the published schedule is uniform)
      bracketsByStatus: {
        SINGLE: [
          { upTo: 79_900, rate: 0.0375 },
          { upTo: 181_650, rate: 0.0475 },
          { upTo: null, rate: 0.0599 },
        ],
        MFJ: [
          { upTo: 79_900, rate: 0.0375 },
          { upTo: 181_650, rate: 0.0475 },
          { upTo: null, rate: 0.0599 },
        ],
        HOH: [
          { upTo: 79_900, rate: 0.0375 },
          { upTo: 181_650, rate: 0.0475 },
          { upTo: null, rate: 0.0599 },
        ],
      },
    },
  },

  SC: {
    name: "South Carolina",
    propertyTaxRate: 0.0046,
    incomeTax: {
      // SC’s exact computation is table-based and changing; this is a simplified progressive approximation.
      // If you want table-exact output, we’d implement SC1040TT lookups instead of brackets.
      bracketsByStatus: {
        SINGLE: [
          { upTo: 3_600, rate: 0.0 },
          { upTo: 17_830, rate: 0.03 },
          { upTo: null, rate: 0.06 }, // tax year 2025 top marginal rate
        ],
        MFJ: [
          { upTo: 3_600, rate: 0.0 },
          { upTo: 17_830, rate: 0.03 },
          { upTo: null, rate: 0.06 },
        ],
        HOH: [
          { upTo: 3_600, rate: 0.0 },
          { upTo: 17_830, rate: 0.03 },
          { upTo: null, rate: 0.06 },
        ],
      },
    },
  },

  VA: {
    name: "Virginia",
    propertyTaxRate: 0.0077,
    incomeTax: {
              standardDeductionByStatus: {
        SINGLE: 8_750,
        MFJ: 17_500,
        HOH: 8_750,
      },

      bracketsByStatus: {
        // Virginia’s rate schedule is the same for all filing statuses in this simplified model.
        SINGLE: [
          { upTo: 3_000, rate: 0.02 },
          { upTo: 5_000, rate: 0.03 },
          { upTo: 17_000, rate: 0.05 },
          { upTo: null, rate: 0.0575 },
        ],
        MFJ: [
          { upTo: 3_000, rate: 0.02 },
          { upTo: 5_000, rate: 0.03 },
          { upTo: 17_000, rate: 0.05 },
          { upTo: null, rate: 0.0575 },
        ],
        HOH: [
          { upTo: 3_000, rate: 0.02 },
          { upTo: 5_000, rate: 0.03 },
          { upTo: 17_000, rate: 0.05 },
          { upTo: null, rate: 0.0575 },
        ],
      },
    },
  },

  VT: {
    name: "Vermont",
    propertyTaxRate: 0.0142,
    incomeTax: {
      bracketsByStatus: {
        SINGLE: [
          { upTo: 3_825, rate: 0.0 },
          { upTo: 53_225, rate: 0.0335 },
          { upTo: 123_525, rate: 0.066 },
          { upTo: null, rate: 0.0875 },
        ],
        MFJ: [
          { upTo: 11_475, rate: 0.0 },
          { upTo: 93_975, rate: 0.0335 },
          { upTo: 210_925, rate: 0.066 },
          { upTo: null, rate: 0.0875 },
        ],
        HOH: [
          { upTo: 3_825, rate: 0.0 },
          { upTo: 75_000, rate: 0.0335 },
          { upTo: 165_700, rate: 0.066 },
          { upTo: null, rate: 0.0875 },
        ],
      },
    },
  },

  WV: {
    name: "West Virginia",
    propertyTaxRate: 0.0048,
    incomeTax: {
      bracketsByStatus: {
        SINGLE: [
          { upTo: 10_000, rate: 0.0222 },
          { upTo: 25_000, rate: 0.0296 },
          { upTo: 40_000, rate: 0.0333 },
          { upTo: 60_000, rate: 0.0444 },
          { upTo: null, rate: 0.0482 },
        ],
        MFJ: [
          { upTo: 10_000, rate: 0.0222 },
          { upTo: 25_000, rate: 0.0296 },
          { upTo: 40_000, rate: 0.0333 },
          { upTo: 60_000, rate: 0.0444 },
          { upTo: null, rate: 0.0482 },
        ],
        HOH: [
          { upTo: 10_000, rate: 0.0222 },
          { upTo: 25_000, rate: 0.0296 },
          { upTo: 40_000, rate: 0.0333 },
          { upTo: 60_000, rate: 0.0444 },
          { upTo: null, rate: 0.0482 },
        ],
      },
    },
  },



};







/**
 * State income tax (single filer approximation, state-only).
 * IMPORTANT: Your UI input currently represents taxable income for simplicity.
 */
function calculateStateIncomeTax(
  state: StateKey,
  filingStatus: FilingStatus,
  taxableIncome: number
) {
  const rule = STATE_TAX_RULES[state];
  const incomeTax = rule.incomeTax;
  const income = Math.max(0, taxableIncome);

  if (!incomeTax) return 0;

  let base = 0;

  if (incomeTax.bracketsByStatus) {
    const brackets = incomeTax.bracketsByStatus[filingStatus];
    base = calcProgressiveTax(income, brackets);
  } else if (typeof incomeTax.flatRate === "number") {
    base = income * incomeTax.flatRate;
  }

  const surtaxTotal =
    incomeTax.surtax?.reduce((sum, s) => {
      return sum + Math.max(0, income - s.threshold) * s.rate;
    }, 0) ?? 0;

  return base + surtaxTotal;
}




const STATES: { key: StateKey; name: string }[] = (
  Object.keys(STATE_TAX_RULES) as StateKey[]
)
  .map((key) => ({ key, name: STATE_TAX_RULES[key].name }))
  .sort((a, b) => a.name.localeCompare(b.name));

function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}


// Add these helpers (NEW)
function formatNumberInput(n: number) {
  return n.toLocaleString("en-US");
}

// Add these helpers (NEW)
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

  // Show 1 decimal under 10mm to avoid duplicate labels like "2mm" at 1.5mm
  const str = m < 10 ? m.toFixed(1) : Math.round(m).toString();

  // Strip trailing .0
  const cleaned = str.endsWith(".0") ? str.slice(0, -2) : str;

  return `$${cleaned}mm`;
}

function CustomInvestmentTooltip({
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
      <div className="text-sm text-gray-600">{`Year ${label}`}</div>

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
  initialHomeValue?: number;
  initialStateA?: StateKey;
  initialStateB?: StateKey;
  initialFilingStatus?: FilingStatus;
};

export default function TaxCompareCalculator(props: Props) {
  const [income, setIncome] = useState(props.initialIncome ?? 100000);
  const [homeValue, setHomeValue] = useState(props.initialHomeValue ?? 450000);
  const [stateA, setStateA] = useState<StateKey>(props.initialStateA ?? "IL");
  const [stateB, setStateB] = useState<StateKey>(props.initialStateB ?? "FL");
const [years, setYears] = useState(40);
const [yearsInput, setYearsInput] = useState("40");




  const [filingStatus, setFilingStatus] = useState<FilingStatus>(
  props.initialFilingStatus ?? "SINGLE"
);


const r = useMemo(() => {
  const aTaxableIncome = getStateTaxableIncome(stateA, filingStatus, income);
  const bTaxableIncome = getStateTaxableIncome(stateB, filingStatus, income);

  const aIncomeTax = calculateStateIncomeTax(
    stateA,
    filingStatus,
    aTaxableIncome
  );
  const aPropertyTax = homeValue * STATE_TAX_RULES[stateA].propertyTaxRate;
  const aTotal = aIncomeTax + aPropertyTax;


  const bIncomeTax = calculateStateIncomeTax(
    stateB,
    filingStatus,
    bTaxableIncome
  );
  const bPropertyTax = homeValue * STATE_TAX_RULES[stateB].propertyTaxRate;
  const bTotal = bIncomeTax + bPropertyTax;



return {
  aIncomeTax,
  aPropertyTax,
  aTotal,

  bIncomeTax,
  bPropertyTax,
  bTotal,

  delta: bTotal - aTotal,
};

  }, [income, homeValue, stateA, stateB, filingStatus]);


  const deltaAbs = Math.abs(r.delta);

  const annualDeltaAbs = Math.abs(r.delta);
  const annualReturn = 0.1;

// Monthly compounding based on the effective annual return
const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1;
const monthlyContribution = annualDeltaAbs / 12;


const investmentSeries = useMemo(() => {
  const nYears = Math.max(1, Math.min(50, Math.floor(years)));
  const startYear = new Date().getFullYear();

  let balance = 0;
  let contributed = 0;

  const points: {
    year: number;
    balance: number;
    principal: number;
    interest: number;
  }[] = [{ year: startYear, balance: 0, principal: 0, interest: 0 }];

  const totalMonths = nYears * 12;

  for (let m = 1; m <= totalMonths; m += 1) {
    balance = balance * (1 + monthlyReturn) + monthlyContribution;
    contributed += monthlyContribution;

    if (m % 12 === 0) {
      const y = m / 12;
      points.push({
        year: startYear + y,
        balance,
        principal: contributed,
        interest: Math.max(0, balance - contributed),
      });
    }
  }

  return points;
}, [years, monthlyContribution, monthlyReturn]);



  const xTicks = useMemo(() => {
  const first = investmentSeries[0]?.year;
  const last = investmentSeries[investmentSeries.length - 1]?.year;
  if (first == null || last == null) return [];

  const mid = first + Math.floor((last - first) / 2);
  return [first, mid, last];
}, [investmentSeries]);


const investingTitle =
  r.delta !== 0
    ? "If you invest those savings this is how much more you can have:"
    : "Total interest";


  const investingSubtitle =
    r.delta < 0
      ? `Moving to ${stateB} saves you money each year versus ${stateA}.`
      : r.delta > 0
      ? `${stateB} costs more per year than ${stateA}. This shows what that difference could grow into if invested.`
      : "There is no annual difference between these states based on this estimate.";


const yAxisMax = useMemo(() => {
  const max = Math.max(...investmentSeries.map((p) => p.balance));
  return max * 1.1;
}, [investmentSeries]);



  return (
    <section className="space-y-4">
      <div className="space-y-4">
        <label className="block">
          <div className="font-medium">Income</div>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            type="text"
            inputMode="numeric"
            value={`$${formatNumberInput(income)}`}
            onChange={(e) => {
              const n = parseNumberInput(e.target.value);
              setIncome(n);
            }}
          />
        </label>

        <label className="block">
          <div className="font-medium">Home value</div>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            type="text"
            inputMode="numeric"
            value={`$${formatNumberInput(homeValue)}`}
            onChange={(e) => {
              const n = parseNumberInput(e.target.value);
              setHomeValue(n);
            }}
          />
        </label>


        <label className="block">
  <div className="font-medium">Filing status</div>
  <select
    className="mt-1 w-full rounded border px-3 py-2"
    value={filingStatus}
    onChange={(e) => setFilingStatus(e.target.value as FilingStatus)}
  >
    {FILING_STATUSES.map((fs) => (
      <option key={fs.key} value={fs.key}>
        {fs.name}
      </option>
    ))}
  </select>
</label>


        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <div className="font-medium">Home state</div>
            <select
              className="mt-1 w-full rounded border px-3 py-2"
              value={stateA}
              onChange={(e) => setStateA(e.target.value as StateKey)}
            >
              {STATES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <div className="font-medium">Compare to</div>
            <select
              className="mt-1 w-full rounded border px-3 py-2"
              value={stateB}
              onChange={(e) => setStateB(e.target.value as StateKey)}
            >
              {STATES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="rounded border p-4 space-y-3">
        <h2 className="text-xl font-semibold">Tax Paid In Each State</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="font-semibold mb-1">{stateA}</div>
            <div>Income tax: {formatUSD(r.aIncomeTax)}</div>
<div>Property tax: {formatUSD(r.aPropertyTax)}</div>
<div className="mt-2 font-bold">Total: {formatUSD(r.aTotal)}</div>

          </div>

          <div>
            <div className="font-semibold mb-1">{stateB}</div>
            <div>Income tax: {formatUSD(r.bIncomeTax)}</div>
<div>Property tax: {formatUSD(r.bPropertyTax)}</div>
<div className="mt-2 font-bold">Total: {formatUSD(r.bTotal)}</div>


          </div>
        </div>

        <div className="pt-4 border-t">
          {r.delta === 0 && (
            <div className="text-gray-600 font-semibold text-lg">
              No significant difference per year
            </div>
          )}

          {r.delta < 0 && (
            <div className="text-green-600 font-extrabold text-xl">
              Taxes Saved By Moving: {formatUSD(deltaAbs)} Each Year
            </div>
          )}

          {r.delta > 0 && (
            <div className="text-red-600 font-extrabold text-xl">
              Additional Tax Owed By Moving: {formatUSD(deltaAbs)} Each Year
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold">{investingTitle}</h3>

<label className="block">
  <div className="font-medium">Years Invested</div>
  <input
    className="mt-1 w-full rounded border px-3 py-2"
    type="number"
    min={1}
    max={50}
    value={yearsInput}
    onChange={(e) => {
      const v = e.target.value;
      setYearsInput(v);

      // Allow the user to clear the field while typing
      if (v === "") return;

      const n = Number(v);
      if (Number.isNaN(n)) return;

      const clamped = Math.max(1, Math.min(50, Math.floor(n)));
      setYears(clamped);
      setYearsInput(String(clamped));

    }}
    onBlur={() => {
      // If they leave it blank, snap back to the last valid value
      if (yearsInput === "") {
        setYearsInput(String(years));
      }
    }}
  />
</label>


        {annualDeltaAbs > 0 && (
          <>


<div className="text-center">
  <div className="text-sm text-gray-600">Moving could increase your networth by:</div>
  <div className="text-3xl font-extrabold text-emerald-700">
    {formatUSD(investmentSeries[investmentSeries.length - 1]?.balance ?? 0)}
  </div>
</div>



<div className="w-full max-w-2xl aspect-[6/5] mx-auto">

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={investmentSeries} margin={{ top: 10, right: 20, left: 5, bottom: 10 }}>
  <defs>
    <linearGradient id="principalFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#1D4ED8" stopOpacity={0.25} />
      <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.03} />
    </linearGradient>
    <linearGradient id="interestFill" x1="0" y1="0" x2="0" y2="1">
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




<Tooltip content={<CustomInvestmentTooltip />} />


  <Legend verticalAlign="bottom" align="right" iconType="square" />

  <Area
    type="monotone"
    dataKey="principal"
    name="Total principal"
    stackId="1"
    stroke="#1D4ED8"
    fill="url(#principalFill)"
    dot={false}
    activeDot={false}
  />
  <Area
    type="monotone"
    dataKey="interest"
    name="Total interest"
    stackId="1"
    stroke="#047857"
    fill="url(#interestFill)"
    dot={false}
    activeDot={false}
  />
</AreaChart>

              </ResponsiveContainer>
            </div>

<p className="text-xs text-gray-600">
  <span className="font-medium">Investment assumption:</span> Assumes the annual
  tax difference is invested monthly and compounds monthly using a 10% long-term
  annual return assumption. Results are illustrative only and not financial
  advice.
</p>
          </>
        )}
      </div>
    </section>
  );
}
