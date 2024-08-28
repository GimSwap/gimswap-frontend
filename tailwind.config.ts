import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      pretendard: ["var(--font-pretendard)"],
    },
    fontSize: {
      display1: ["40px", "52px"],
      display2: ["36px", "46px"],
      display3: ["28px", "38px"],
      h1: ["24px", "32px"],
      h2: ["22px", "30px"],
      h3: ["20px", "28px"],
      h4: ["18px", "26px"],
      h5: ["16px", "24px"],
      p1: ["14px", "20px"],
      c1: ["12px", "16px"],
      c0: ["11px", "14px"],
    },
    letterSpacing: {
      display1: "0px",
      display2: "0px",
      display3: "0px",
      h1: "0px",
      h2: "0px",
      h3: "0px",
      h4: "0px",
      h5: "0px",
      p1: "-0.3px",
      c1: "-0.3px",
      c0: "-0.3px",
    },
    colors: {
      "black-1": "#ffffff",
      "black-2": "#fcfcfc",
      "black-3": "#F9F9F9",
      "black-4": "#f0f0f0",
      "black-5": "#d9d9d9",
      "black-6": "#bfbfbf",
      "black-7": "#8c8c8c",
      "black-8": "#595959",
      "black-9": "#404040",
      "black-10": "#404040",
      "black-11": "#1f1f1f",
      "black-12": "#141414",
      "black-13": "#000000",

      "purple-50": "#f4f0ff",
      "purple-100": "#ddd1ff",
      "purple-200": "#cdbbff",
      "purple-300": "#b69dff",
      "purple-400": "#a889ff",
      "purple-500": "#926cff",
      "purple-600": "#8562e8",
      "purple-700": "#684db5",
      "purple-800": "#503b8c",
      "purple-900": "#3d2d6b",

      error: "#EB4E4E",
    },
    height: {
      topbar: "72px",
    },
    boxShadow: {
      customShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.08)",
    },

    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  transitionProperty: {
    "max-height": "max-height",
  },
  plugins: [],
};
export default config;
