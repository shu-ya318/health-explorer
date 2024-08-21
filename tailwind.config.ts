import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      //自定義 網格間距
      gridTemplateColumns: {
        'fill-two-columns': 'repeat(auto-fill, minmax(48%, 1fr))',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      // 癌篩問卷用動畫
      keyframes: {
        drift: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        drift: 'drift 7s infinite linear',
        driftAlt: 'drift 9s infinite linear',
        driftAltLong: 'drift 11s infinite linear',
      }
    },
  },
  plugins: [],
};
export default config;
