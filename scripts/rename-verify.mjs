#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const ROOTS = ["packages", "configs", "tools", ".github", "."]
const PATTERNS = [
  /@medusajs\//g,
  /\bmedusa-ui\b/g,
  /\bMedusaIcon\b/g,
  /\bmedusaUi\b/g,
]
const SKIP_DIRS = new Set(["node_modules", "dist", ".git", ".yarn", ".next"])
const SKIP_FILES = new Set(["yarn.lock", "rename-verify.mjs"])

let total = 0

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) {
      walk(full)
    } else if (st.isFile()) {
      if (SKIP_FILES.has(name)) continue
      scan(full)
    }
  }
}

function scan(file) {
  const text = readFileSync(file, "utf8")
  const lines = text.split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    for (const re of PATTERNS) {
      const matches = lines[i].match(re)
      if (matches) {
        total += matches.length
        console.error(`${relative(".", file)}:${i + 1}: ${lines[i].trim()}`)
      }
    }
  }
}

for (const root of ROOTS) {
  try {
    const st = statSync(root)
    if (st.isDirectory()) walk(root)
    else if (st.isFile()) scan(root)
  } catch {
    // missing path is fine
  }
}

console.log(`\n${total} occurrences of @medusajs* / medusa-ui* / MedusaIcon* / medusaUi*`)
if (total > 0) {
  console.error("FAIL — rename is incomplete.")
  process.exit(1)
}
console.log("PASS — no occurrences remain.")