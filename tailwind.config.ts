import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      //文字垂直
      writingMode: {
        vertical: 'vertical-lr',
      },
      //自定義 網格間距
      gridTemplateColumns: {
        'fill-two-columns': 'repeat(auto-fill, minmax(48%, 1fr))',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      // 動畫
      keyframes: {
        //波浪
        drift: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        //翻轉
        flip: {
          "0%" :{
            transform: "rotateY(-180deg)"
          },
          "50%": {
            transform: "rotateY(-90deg)"
          },
          "100%" :{
            transform: "rotateY(0deg)"
          },
        },
        "flip-up": {
                  "0%": {
                    transform: "translate3d(0, 100%, 0) rotateY(-180deg)",
                  },
                  "50%": {
                    transform: "rotateY(-90deg)",
                  },
                  "100%": {
                    transform: "translate3d(0, 0, 0) rotateY(0deg)",
                  },
        },
      },
      animation: {
        //波浪
        drift: 'drift 7s infinite linear',
        driftAlt: 'drift 9s infinite linear',
        driftAltLong: 'drift 11s infinite linear',
        //翻轉
        flip : 'flip 2s 0.25s 1',
        flipUp:'flip-up 1s ease 0.25s 1',
      }
    },
  },
  plugins: [],
};
export default config;
