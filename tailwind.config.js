/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2196F3", // メインの青色
        secondary: "#4CAF50", // アクセントの緑色
        danger: "#F44336", // 削除ボタンの赤色
        gray: {
          100: "#F5F5F5",
          200: "#EEEEEE",
          300: "#E0E0E0",
          400: "#BDBDBD",
          500: "#9E9E9E",
          600: "#757575",
          700: "#616161",
        },
      },
    },
  },
  plugins: [],
};
