# Migration from `@medusajs/ui` to `@rehla-ui/ui`

Rehla UI is a drop-in replacement for `@medusajs/ui` 2.x. The component APIs, props, design tokens, and visual output are unchanged. You only need to update import paths.

## Step 1: Replace the dependency

```bash
# remove the old packages
yarn remove @medusajs/ui @medusajs/icons @medusajs/ui-preset

# install the new package
yarn add @rehla-ui/ui
```

## Step 2: Rewrite imports

Use your editor's find-and-replace:

| Old                                              | New                                |
|--------------------------------------------------|------------------------------------|
| `from "@medusajs/ui"`                            | `from "@rehla-ui/ui"`              |
| `from "@medusajs/icons"`                         | `from "@rehla-ui/ui/icons"`        |
| `require("@medusajs/ui-preset")`                 | `require("@rehla-ui/ui/preset")`   |

## Step 3: Update Tailwind config

```diff
  module.exports = {
-   presets: [require("@medusajs/ui-preset")],
+   presets: [require("@rehla-ui/ui/preset")],
    content: [...],
  }
```

## Step 4: Update global CSS import

```diff
- @import "@medusajs/ui/styles.css";
+ @import "@rehla-ui/ui/styles.css";
```

## What stays the same

- All component prop APIs.
- All Tailwind class names (`bg-ui-bg-base`, `text-ui-fg-base`, etc.).
- All CSS custom properties (`--ui-bg-base`, `--ui-fg-base`, etc.).
- All icons render with the same `IconProps` interface.