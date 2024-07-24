/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#40A9FF",
        success: "#95D475",
        danger: "#EA0000",
        // 基础字体颜色
        "basic-text": "#3D3D3D",
      },
    },
  },
  plugins: [],
};
