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
      'lg':'1024px',
      'md':'768px',
      'sm':'640px',
      'xs':'480px',
      'xxs':'360px',
    },
    extend: {
    //版面
      gridTemplateColumns: {
        'custom': '180px minmax(0, 1fr)',
        'fill-two-columns': 'repeat(auto-fill, minmax(48%, 1fr))',
        'fill-column': 'repeat(auto-fill, minmax(100%, 1fr))',
      },
    //動畫
      keyframes: {
        //加載中指示器，取代不便RWD的Skeleton
        pulse: { 
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
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
        'flip-up': {
          '0%': {
            transform: 'translate3d(0, 100%, 0) rotateY(-180deg)',
          },
          '50%': {
            transform: 'rotateY(-90deg)',
          },
          '100%': {
            transform: 'translate3d(0, 0, 0) rotateY(0deg)',
          },
        },
      },
      animation: {
        //翻轉
        flip : 'flip 2s 0.25s 1',
        flipUp:'flip-up 1s ease 0.25s 1',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    },
  },
  plugins: [
  ],
};
export default config;
