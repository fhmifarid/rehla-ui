const preset = (() => {
  try {
    return require("./dist/preset/index.cjs")
  } catch {
    return require("./src/preset")
  }
})()

module.exports = {
  presets: [preset],
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: ["class", '[data-mode="dark"]'],
}
