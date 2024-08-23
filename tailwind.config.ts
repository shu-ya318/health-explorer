import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    //RWD
    screens: {
      'xl': '1280px',
      'lg':'1024',
      'md':'768',
      'sm':'640',
      'xs':'480',
      'xss':'360',
    },
    extend: {
    //版面
      gridTemplateColumns: {
        'fill-two-columns': 'repeat(auto-fill, minmax(48%, 1fr))',
      },
    //動畫
      keyframes: {
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
        //翻轉
        flip : 'flip 2s 0.25s 1',
        flipUp:'flip-up 1s ease 0.25s 1',
      }
    },
  },
  plugins: [],
};
export default config;
