/** @type {import('tailwindcss').Config} */
export default {
  // 🔴 關鍵檢查點：確保這裡包含了所有 vue 檔案
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dungeon-black": "#1a1a1a",
        "hp-red": "#ff0044",
        "xp-blue": "#00ccff",
        gold: "#ffcc00",
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "cursive"],
      },
    },
  },
  plugins: [],
};
