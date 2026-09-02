import { defineConfig } from "tsup"

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
      "icons/index": "src/icons/index.ts",
    },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    treeshake: true,
    target: "es2018",
    external: ["react", "react-dom"],
  },
  {
    entry: { "preset/index": "src/preset/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    outExtension({ format }) {
      return { js: format === "cjs" ? ".js" : ".mjs" }
    },
    external: [],
  },
])