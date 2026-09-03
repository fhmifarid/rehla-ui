const presetModule = (() => {
  try {
    return require("./dist/preset/index.cjs")
  } catch {
    return require("./src/preset")
  }
})()

const preset = presetModule.default || presetModule.preset || presetModule

module.exports = {
  presets: [preset],
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: ["class", '[data-mode="dark"]'],
}
