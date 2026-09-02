# Rehla UI — Design System Rename & Package Consolidation

**Status:** Draft for review
**Date:** 2026-09-03
**Path:** `docs/superpowers/specs/2026-09-03-rehla-ui-design.md`
**Source repository:** `medusajs/ui` (archived) — design system monorepo (Yarn 3 + Turborepo).
**Goal:** Rename and restructure the existing Medusa UI design system into a single publishable package under the `@rehla-ui` npm scope for use as a dependency inside the Rehla (رحله) application.

---

## 1. Background & Context

The current repository is **Medusa UI** — an open-source React component library built on Tailwind CSS and Radix UI primitives. The upstream maintainers have moved active development to a monorepo under `medusajs/medusa/packages/design-system` and archived this standalone repo.

We are forking this design system for use inside the **Rehla** (رحله) project — a B2C + Admin application (Bagisto-based per `AGENTS.md`). The Rehla team needs an installable, well-maintained React/Tailwind component library without the upstream `medusajs` branding and ideally without the cost of depending on three separate npm packages.

### 1.1 Why not just keep `@medusajs/ui`?

- Branding mismatch with Rehla (visible in class names, types, package metadata).
- Three-package install (`@medusajs/ui`, `@medusajs/icons`, `@medusajs/ui-preset`) creates friction for consumers.
- The upstream is archived; we need ownership of the renaming and consolidation ourselves.

### 1.2 Why not fork as a single non-monorepo package?

- The existing monorepo tooling (Turborepo caching, incremental builds, workspace protocol references) significantly speeds up local development and CI.
- Splitting the build artifacts (icons, preset) into sub-path exports inside one package gives us the consumer benefit without losing developer ergonomics.

---

## 2. Goals & Non-Goals

### 2.1 Goals

- Produce a single publishable npm package `@rehla-ui/ui` that exposes:
  - React components (39 components: Button, Input, Modal, Calendar, DatePicker, Drawer, etc.).
  - Icons (245 SVG-as-React components) under `@rehla-ui/ui/icons`.
  - Tailwind CSS preset under `@rehla-ui/ui/preset`.
  - Pre-built stylesheet under `@rehla-ui/ui/styles.css`.
  - Hooks (`usePrompt`, `useToast`, `useToggleState`) and utilities (`clx`).
- Replace all references to `@medusajs/*` with `@rehla-ui/*` (or `@rehla-ui/ui/*`) across the codebase.
- Keep the existing design tokens (colors, typography, effects) unchanged — no visual regression for current Medusa UI users.
- Pass the existing test suite (13 `*.spec.tsx`) without modification.
- Provide a smoke-test harness proving the package works as a real installable dependency.

### 2.2 Non-Goals (this iteration)

- Adding new components (e.g., `DocumentUploader`, `CountrySelect`).
- RTL/Arabic locale support (deferred to a future iteration).
- Visual rebrand (colors stay the same; only metadata and names change).
- Publishing to the real npm registry (we dry-run; publishing is a separate decision).
- Migrating the design system into Bagisto/Blade/PHP (out of scope; this stays React).

---

## 3. High-Level Architecture

### 3.1 Repository shape (after the rename)

```
ui-develop/                              # root monorepo (private workspace)
├── package.json                         # name: "rehla-ui-monorepo" (private)
├── turbo.json                           # pipeline targets updated (see §6)
├── yarn.lock, .yarn/, .yarnrc.yml       # unchanged
├── configs/
│   ├── eslint-config-ui/                # → @rehla-ui/eslint-config (PUBLIC)
│   └── tsconfig-ui/                     # → @rehla-ui/tsconfig      (PUBLIC)
├── tools/
│   ├── toolbox/                         # → @rehla-ui/toolbox       (private)
│   └── figma-api/                       # → @rehla-ui/figma-api     (private)
├── packages/
│   └── ui/                              # → @rehla-ui/ui            (PUBLIC)
│       ├── src/
│       │   ├── components/              # 39 components (unchanged)
│       │   ├── hooks/                   # 3 hooks (unchanged)
│       │   ├── utils/                   # clx (unchanged)
│       │   ├── icons/                   # NEW: 245 icons moved from packages/icons
│       │   ├── preset/                  # NEW: Tailwind preset moved from packages/ui-preset
│       │   ├── main.css
│       │   ├── types.ts                 # exports include RehlaIcon
│       │   └── index.ts                 # re-exports all of the above
│       ├── tsup.config.ts               # NEW (replaces tsconfig.cjs/esm)
│       ├── postcss.config.js
│       ├── tailwind.config.cjs
│       ├── vite.config.ts, setup-test.ts
│       └── package.json                 # @rehla-ui/ui, exports map
├── docs/
│   └── superpowers/specs/
│       └── 2026-09-03-rehla-ui-design.md  # THIS FILE
└── tests/
    └── smoke/                           # NEW: smoke-test harness
```

### 3.2 Deleted paths

- `packages/icons/` — content moved to `packages/ui/src/icons/`.
- `packages/ui-preset/` — content moved to `packages/ui/src/preset/`.

### 3.3 Public package surface (what consumers see)

The only public consumer-facing package is `@rehla-ui/ui`. It exposes:

| Import path            | What it provides                                | Source                  |
|------------------------|--------------------------------------------------|-------------------------|
| `@rehla-ui/ui`         | Components, hooks, utils, top-level types        | `src/index.ts`          |
| `@rehla-ui/ui/icons`   | Icon components                                  | `src/icons/index.ts`    |
| `@rehla-ui/ui/preset`  | Tailwind preset                                  | `src/preset/index.ts`   |
| `@rehla-ui/ui/styles.css` | Compiled Tailwind base styles                  | `dist/styles.css`       |

The two config packages (`@rehla-ui/eslint-config`, `@rehla-ui/tsconfig`) are public-but-internal — consumers of `@rehla-ui/ui` are not required to install them; they are useful for downstream projects that want consistent style.

---

## 4. Naming Map (Renaming Reference)

### 4.1 Package names

| Current                       | New                          | Visibility |
|-------------------------------|------------------------------|------------|
| `@medusajs/ui`                | `@rehla-ui/ui`               | public     |
| `@medusajs/icons`             | _(merged into `@rehla-ui/ui/icons`)_ | n/a |
| `@medusajs/ui-preset`         | _(merged into `@rehla-ui/ui/preset`)_ | n/a |
| `@medusajs/eslint-config-ui`  | `@rehla-ui/eslint-config`    | public     |
| `@medusajs/tsconfig-ui`       | `@rehla-ui/tsconfig`         | public     |
| `@medusajs/toolbox`           | `@rehla-ui/toolbox`          | private    |
| `@medusajs/figma-api`         | `@rehla-ui/figma-api`        | private    |
| _(root workspace)_ `medusa-ui`| `rehla-ui-monorepo`          | private    |

### 4.2 Versioning

All renamed packages start at **1.0.0**. The semantic meaning: "this is the first Rehla-owned release." We do not attempt to inherit the upstream Medusa UI versions, because the artifact set has changed (3 packages → 1 + sub-paths), which is a breaking structural change that warrants a major bump.

### 4.3 Code-level renames

| Current                          | New                          | Notes                                  |
|----------------------------------|------------------------------|----------------------------------------|
| `import ... from "@medusajs/ui"`       | `import ... from "@rehla-ui/ui"`       | ~24 occurrences in `packages/ui/src/components/**` |
| `import ... from "@medusajs/icons"`    | `import ... from "@rehla-ui/ui/icons"` | ~25 occurrences                            |
| `require("@medusajs/ui-preset")`       | `require("@rehla-ui/ui/preset")`      | 1 file: `packages/ui/tailwind.config.cjs` |
| `import ... from "@medusajs/eslint-config-ui"` | `import ... from "@rehla-ui/eslint-config"` | configs |
| `MedusaIcon` (type)               | `RehlaIcon`                  | `packages/ui/src/icons/types.ts`       |
| `function medusaUi(...)`         | `function rehlaUi(...)`      | `packages/ui/src/preset/plugin.ts`     |
| `name: "medusa-icons"` (UMD)     | `name: "rehla-ui-icons"`     | `tools/toolbox/rollup.config.mjs` (private tool) |
| "Medusa" / "Medusajs" in any prose file | "Rehla" / "rehla-ui"     | All `README.md`, `CONTRIBUTING.md`, docstrings |
| `medusajs.com` URLs, Discord invite | Removed or replaced      | README, CONTRIBUTING                    |

### 4.4 What stays unchanged (deliberately)

- All CSS variable names (`--ui-bg-base`, `--ui-fg-base`, `--button-inverted-gradient`, etc.) — keeps the visual output identical.
- All Tailwind class names (`bg-ui-bg-base`, `text-ui-fg-base`, etc.) — keeps the visual output identical.
- All component prop APIs (`ButtonProps`, `InputProps`, etc.) — no consumer breaking change beyond the import path.
- Storybook stories (just the import paths inside them change).
- Spec files (just the import paths inside them change).

---

## 5. File-by-File Change Set

### 5.1 Root of repository

| File               | Action                                                                 |
|--------------------|------------------------------------------------------------------------|
| `package.json`     | Rename root workspace to `rehla-ui-monorepo`. Update devDependencies (`@medusajs/eslint-config-ui` → `@rehla-ui/eslint-config`, `@medusajs/toolbox` → `@rehla-ui/toolbox`). Keep `workspaces` field pointing at `packages/*`, `tools/*`, `configs/*`. |
| `turbo.json`       | Drop the `generate:icons` pipeline entry (no longer needed at this level). Update `build` outputs to `dist/**`. |
| `README.md`        | Rewrite under "Rehla UI" branding. Remove Medusajs archive notice. |
| `CONTRIBUTING.md`  | Update for Rehla; drop `medusa new` prerequisite; clarify that all packages (icons/preset sub-paths) are now editable. |
| `CODEOWNERS`       | Update to Rehla team handles. |
| `.github/`         | Update CI workflows: add `yarn rename:verify` step; update package names in matrix. |
| `.yarn/patches/class-variance-authority-npm-0.6.1-22a468e86e.patch` | Unchanged (still needed). |
| `babel.config.js`, `tsconfig.json`, `prettier.config.js`, `.eslintignore`, `.eslintrc.js`, `.gitignore`, `.npmrc`, `.prettierignore`, `.yarnrc.yml` | Unchanged in content. |

### 5.2 `packages/ui/` — primary package

| Path                                | Action                                                                                  |
|-------------------------------------|-----------------------------------------------------------------------------------------|
| `package.json`                      | Rename to `@rehla-ui/ui`. New `exports` map (§5.3). New scripts using `tsup`.            |
| `src/index.ts`                      | Add re-exports for `./icons`, `./preset`, `./hooks`, `./utils`, `./types`.               |
| `src/icons/`                        | NEW directory, content moved from `packages/icons/src/`.                                |
| `src/preset/`                       | NEW directory, content moved from `packages/ui-preset/src/`.                            |
| `src/main.css`                      | Update `@tailwind` directives; comment block referencing "Medusa UI" removed.            |
| `src/types.ts`                      | Unchanged in content (no `@medusajs` references).                                        |
| `src/components/**`                 | Only `import` statements change (`@medusajs/ui` → `@rehla-ui/ui`); 24 files affected.   |
| `src/hooks/**`                      | Unchanged in content.                                                                   |
| `src/utils/clx.ts`                  | Unchanged.                                                                              |
| `tsup.config.ts`                    | NEW. Multi-entry build (see §6).                                                        |
| `tsconfig.cjs.json`                 | DELETED. Replaced by tsup.                                                              |
| `tsconfig.esm.json`                 | DELETED. Replaced by tsup.                                                              |
| `tailwind.config.cjs`               | Update `presets: [require("@rehla-ui/ui/preset")]`.                                      |
| `postcss.config.js`                 | Unchanged.                                                                              |
| `vite.config.ts`, `setup-test.ts`   | Update import paths if they reference internal modules.                                 |
| `README.md`                         | Rewrite under "Rehla UI".                                                                |
| `LICENSE`                           | Update copyright holder (or keep MIT with Rehla copyright).                              |
| `CHANGELOG.md`                      | New entry: 1.0.0 initial Rehla release.                                                 |
| `.eslintignore`, `.eslintrc.js`, `.gitignore` | Unchanged in content.                                                          |

### 5.3 Exports map for `packages/ui/package.json`

```json
{
  "name": "@rehla-ui/ui",
  "version": "1.0.0",
  "description": "Rehla UI — A React component library built on Tailwind CSS and Radix UI primitives",
  "license": "MIT",
  "type": "module",
  "sideEffects": ["**/*.css"],
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "types": "./dist/esm/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/esm/index.d.ts",
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js"
    },
    "./icons": {
      "types": "./dist/esm/icons/index.d.ts",
      "import": "./dist/esm/icons/index.js",
      "require": "./dist/cjs/icons/index.js"
    },
    "./preset": {
      "import": "./dist/esm/preset/index.mjs",
      "require": "./dist/cjs/preset/index.js"
    },
    "./styles.css": "./dist/styles.css",
    "./package.json": "./package.json"
  },
  "files": ["dist/**"],
  "scripts": {
    "build": "yarn clean && yarn build:css && yarn build:js",
    "build:css": "tailwindcss -i ./src/main.css -o ./dist/styles.css --minify",
    "build:js": "tsup",
    "clean": "rimraf dist",
    "test": "vitest --run",
    "test:watch": "vitest",
    "lint": "eslint \"src/**/*.ts*\"",
    "typecheck": "tsc --noEmit",
    "storybook": "storybook dev -p 6006",
    "storybook:build": "storybook build"
  },
  "dependencies": {
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.4",
    "@radix-ui/react-avatar": "^1.0.3",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.4",
    "@radix-ui/react-dropdown-menu": "^2.0.5",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-popover": "^1.0.6",
    "@radix-ui/react-portal": "^1.0.3",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-scroll-area": "^1.0.4",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.4",
    "@radix-ui/react-tooltip": "^1.0.6",
    "@react-aria/datepicker": "^3.5.0",
    "@react-stately/datepicker": "^3.5.0",
    "class-variance-authority": "^0.6.1",
    "clsx": "^1.2.1",
    "copy-to-clipboard": "^3.3.3",
    "date-fns": "^2.30.0",
    "prism-react-renderer": "^2.0.6",
    "react-currency-input-field": "^3.6.11",
    "react-day-picker": "^8.8.0",
    "tailwind-merge": "^1.13.2"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "...": "(unchanged, but @medusajs/eslint-config-ui → @rehla-ui/eslint-config, @medusajs/ui-preset → internal)"
  },
  "publishConfig": { "access": "public" }
}
```

### 5.4 `packages/icons/` and `packages/ui-preset/` — deletion plan

After their content has been moved and the renamed package builds successfully:

1. Delete `packages/icons/` directory in full.
2. Delete `packages/ui-preset/` directory in full.
3. Run `yarn install` to refresh workspace links.
4. Run `yarn build` and `yarn test` to confirm no stray imports remain.

---

## 6. Build Pipeline

### 6.1 New `packages/ui/tsup.config.ts`

```ts
import { defineConfig } from "tsup"

export default defineConfig([
  // Main components + hooks + utils + icons
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
  },
  // Tailwind preset (separately because of CommonJS extension preference)
  {
    entry: { "preset/index": "src/preset/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    outExtension({ format }) {
      return { js: format === "cjs" ? ".js" : ".mjs" }
    },
  },
])
```

### 6.2 `tailwindcss` build step

The `tailwindcss` CLI is invoked from `packages/ui/` with the existing `tailwind.config.cjs` (now pointing at `@rehla-ui/ui/preset`):

```bash
yarn workspace @rehla-ui/ui build:css
# internally: tailwindcss -i ./src/main.css -o ./dist/styles.css --minify
```

This step must run **before** `tsup` (which only handles JS) and **before** `yarn pack` (so `dist/styles.css` is present in the tarball).

### 6.3 Updated `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local", ".env"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "build:css": {
      "outputs": ["dist/**/*.css"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

---

## 7. Verification Strategy

The work is "done" only when **all** the following checks pass.

### 7.1 Static checks

| Check                             | Command                                          | Pass criterion              |
|-----------------------------------|--------------------------------------------------|-----------------------------|
| Rename verification               | `node scripts/rename-verify.mjs`                 | 0 occurrences of `@medusajs` |
| TypeScript compile                | `yarn workspace @rehla-ui/ui typecheck`          | 0 errors                    |
| ESLint                            | `yarn workspace @rehla-ui/ui lint`               | 0 errors, 0 warnings        |
| TS compile across workspaces      | `yarn workspaces foreach -A run typecheck`        | 0 errors                    |

### 7.2 Unit tests

| Check                             | Command                                          | Pass criterion              |
|-----------------------------------|--------------------------------------------------|-----------------------------|
| Vitest in `packages/ui`           | `yarn workspace @rehla-ui/ui test`               | All 13 spec files pass      |
| Storybook build (visual only)     | `yarn workspace @rehla-ui/ui storybook:build`    | Build succeeds              |

### 7.3 Package dry-run

| Check                             | Command                                          | Pass criterion              |
|-----------------------------------|--------------------------------------------------|-----------------------------|
| Build                             | `yarn build`                                     | Exit 0                      |
| Tarball inspection                | `cd packages/ui && yarn pack --dry-run`          | Tarball contains `dist/esm/index.js`, `dist/cjs/index.js`, `dist/esm/icons/index.js`, `dist/cjs/icons/index.js`, `dist/esm/preset/index.mjs`, `dist/cjs/preset/index.js`, `dist/styles.css`, `package.json`, `README.md` |
| Size budget (gzip)                | (manual)                                          | `index.js` < 500KB; `icons/index.js` < 200KB; `styles.css` < 50KB |

### 7.4 Smoke test (new)

A small Vite + React app at `tests/smoke/`:

```jsonc
// tests/smoke/package.json (high-level sketch)
{
  "name": "rehla-ui-smoke",
  "private": true,
  "dependencies": {
    "@rehla-ui/ui": "file:../../packages/ui",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

It imports `<Button />`, `<Input />`, `<DatePicker />`, `<Modal />` (FocusModal), `<Select />`, plus `<InformationCircle />` from `@rehla-ui/ui/icons`, configures Tailwind with `@rehla-ui/ui/preset`, and renders. **Pass criteria:** `yarn dev` starts the dev server with no console errors and the page renders without a flash of unstyled content (CSS variables resolved).

### 7.5 CI

A new workflow at `.github/workflows/ci.yml` runs the static checks, unit tests, build, and dry-run on every PR. The smoke test is not gated by CI (manual) in this iteration — it's documented in the spec for the implementer to run locally.

---

## 8. Phased Rollout

The implementation plan (written separately by the `writing-plans` skill) will follow these phases. Each phase ends with a "Definition of Done" gate.

| Phase | Name                                  | Outputs                                                                                              |
|-------|---------------------------------------|------------------------------------------------------------------------------------------------------|
| 1     | Bootstrap                             | Branch `rename/rehla-ui`; root `package.json` renamed; `turbo.json` updated; `rename-verify` script added. |
| 2     | Move icons                            | `packages/ui/src/icons/` populated; `MedusaIcon` → `RehlaIcon`; `index.ts` re-exports; `packages/icons/` deleted; all `@medusajs/icons` imports rewritten. |
| 3     | Move preset                           | `packages/ui/src/preset/` populated; `medusaUi` → `rehlaUi`; `index.ts` ESM-fixed; `packages/ui-preset/` deleted; `tailwind.config.cjs` updated. |
| 4     | Rename public packages                | All `package.json` files updated to `@rehla-ui/*`.                                                   |
| 5     | Rewrite imports                       | All `@medusajs/*` imports replaced; `rename:verify` returns 0.                                       |
| 6     | Update metadata                       | All `README.md`, `CONTRIBUTING.md`, `LICENSE`, `.github/`, `CODEOWNERS` updated.                     |
| 7     | Build pipeline rewrite                | `tsup.config.ts` created; `tsconfig.cjs/esm.json` deleted; `package.json` scripts migrated.           |
| 8     | Verification                          | All checks in §7 pass.                                                                               |
| 9     | Documentation                         | `CHANGELOG.md` 1.0.0 entry; `MIGRATION.md` written for consumers of `@medusajs/ui`.                  |

---

## 9. Risks & Mitigations

| Risk                                                                                  | Mitigation                                                                                   |
|---------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| Visual regression in consumer apps that already use `@medusajs/ui`.                   | CSS variables and Tailwind class names are unchanged. Only import paths change.               |
| Import path typo in one of the 24+ component files breaks the build.                  | `yarn rename:verify` script + `yarn typecheck` + `yarn test` gates; CI catches on PR.        |
| Storybook stories still reference `@medusajs/icons` after the move.                   | Same rename sweep applies to `*.stories.tsx` files (caught by §7.1 rename-verify).           |
| Tailwind preset double-resolution when `packages/ui/tailwind.config.cjs` references `@rehla-ui/ui/preset` while developing inside the monorepo (a workspace package importing its own published name causes a circular resolution). | During dev, `tailwind.config.cjs` uses the relative path `require("./src/preset")`; the `@rehla-ui/ui/preset` export is for external consumers only. Both paths are exercised: the smoke test (`tests/smoke/`) verifies the published path, and Storybook/Tailwind dev inside the package verifies the relative path. |
| Existing consumers of `@medusajs/ui` see a breaking change.                           | Acceptable: this is a rebrand, not a compat release. `MIGRATION.md` documents the rename.   |
| `@medusajs/icons` peer dep removal from `dependencies`.                               | Documented in `CHANGELOG.md`; consumers now import icons from `@rehla-ui/ui/icons`.          |
| License attribution loss (Medusa UI is MIT — fine — but credit is good practice).     | Add a `NOTICE` file crediting the original Medusa UI authors (or rely on git history).      |

---

## 10. Out of Scope (Documented for Future Iterations)

- **RTL / Arabic locale support** — flagged by the user as not in scope for v1.0.0. Add a follow-up spec.
- **Component additions for Rehla** (DocumentUploader, CountrySelect, Arabic-aware DatePicker).
- **Visual rebrand** (different color palette, custom typography).
- **Publishing to npm** — we dry-run; the decision to publish and under what organization/account is separate.
- **Bagisto / Blade bridge** — out of scope; Rehla's React front-end consumes this library directly.

---

## 11. Open Questions

None at the time of writing — all clarifying questions answered during brainstorming:
- Scope: `@rehla-ui`
- Goal: single installable package
- Structure: monorepo internally + merged `@rehla-ui/ui`
- Theme: tokens preserved
- Configs/tools: all renamed, monorepo kept internally
- Priority: rename + cleanup only (no new features)
- Verification: dry-run + smoke test

---

## 12. Acceptance Criteria

This spec is considered implemented when:

1. `yarn build` succeeds at the root.
2. `yarn test` passes (all 13 spec files).
3. `yarn lint` passes.
4. `yarn typecheck` passes.
5. `node scripts/rename-verify.mjs` prints "0 occurrences of @medusajs".
6. `cd packages/ui && yarn pack --dry-run` produces a tarball containing all the files listed in §7.3.
7. The smoke test at `tests/smoke/` starts a dev server with no console errors and renders styled components.
8. `CHANGELOG.md` has a 1.0.0 entry and `MIGRATION.md` exists for prior `@medusajs/ui` consumers.

---

**End of spec. Please review and request changes before we transition to the implementation plan.**