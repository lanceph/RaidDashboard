/** @type {import('tailwindcss').Config} */
export default {
  // 告訴 Tailwind 去掃描這些檔案裡面的 class
  content: [
    "./index.html",
    // 💡 加上 vue，讓 Tailwind 去掃描 Vue 元件！
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  // 這裡非常重要！
  // 因為你的程式碼會動態拼接字串 (例如 theme-輸出、bg-green-100)
  // 這裡的 safelist 可以確保 Tailwind 打包時不會把這些顏色刪除
  safelist: [
    "theme-輸出",
    "theme-巫師",
    "theme-流氓",
    "theme-技師",
    "bg-green-100",
    "text-green-800",
    "border-green-400",
    "text-green-600",
    "bg-red-100",
    "text-red-800",
    "border-red-400",
    "text-red-600",
    "bg-blue-100",
    "text-blue-800",
    "border-blue-400",
    "text-blue-600",
    "bg-yellow-100",
    "text-yellow-800",
    "border-yellow-400",
    "text-yellow-600",
    "bg-purple-100",
    "text-purple-800",
    "border-purple-400",
    "text-purple-600",
    "bg-slate-100",
    "text-slate-700",
    "border-slate-300",
    "text-slate-800",
    "text-slate-500",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
