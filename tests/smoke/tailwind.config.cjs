module.exports = {
  presets: [require("@rehla-ui/ui/preset")],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/dist/esm/**/*.{js,mjs}",
  ],
  darkMode: ["class", '[data-mode="dark"]'],
}