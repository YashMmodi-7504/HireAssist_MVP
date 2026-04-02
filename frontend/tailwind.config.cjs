/** @type {import('tailwindcss').Config} */
module.exports = {
  experimental: {
    optimizeUniversalDefaults: true,
    legacyLayerUtilities: true,   // enables bg-slate, text-slate, etc.
    legacyColorUtilities: true    // restores slate, blue, red utilities
  },
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
