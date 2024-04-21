import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./node_modules/flowbite-react/lib/**/*.js",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        nav: "#3b424f",
        primary: "#2B303A",
        secondary: "#24222a",
        "default-text": "#E0E1DD",
        "olive-900": "#646536",
        "olive-500": "#768948",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
  darkMode: "class",
};
export default config;
