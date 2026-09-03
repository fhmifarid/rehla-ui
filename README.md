# Rehla UI

Rehla UI is a React component library built on Tailwind CSS and Radix UI primitives. It powers the front-end of the **Rehla (رحله)** application.

This repository is a Yarn 3 + Turborepo monorepo. The main package is **`@rehla-ui/ui`**, which is the only package meant to be consumed by downstream applications.

## Packages

| Package                       | Visibility | Purpose                                |
|-------------------------------|------------|----------------------------------------|
| `@rehla-ui/ui`                | public     | React components, icons, Tailwind preset |
| `@rehla-ui/eslint-config`     | public     | Shared ESLint configuration            |
| `@rehla-ui/tsconfig`          | public     | Shared TypeScript configuration        |
| `@rehla-ui/toolbox`           | private    | Figma → icons / tokens generator (dev only) |
| `@rehla-ui/figma-api`         | private    | Figma API client (dev only)            |

## Install

```bash
yarn add @rehla-ui/ui
```

## Usage

```tsx
import { Button } from "@rehla-ui/ui"
import "@rehla-ui/ui/styles.css"

export function MyComponent() {
  return <Button variant="primary">Hello, Rehla!</Button>
}
```

### Tailwind preset

```js
// tailwind.config.cjs
module.exports = {
  presets: [require("@rehla-ui/ui/preset")],
  content: ["./src/**/*.{ts,tsx}"],
}
```

### Icons

```tsx
import { InformationCircle, ChevronDown } from "@rehla-ui/ui/icons"

export function HeaderIcon() {
  return <InformationCircle className="w-5 h-5 text-ui-fg-base" />
}
```

## Development

This is a Yarn 3 + Turborepo monorepo. Standard scripts:

```bash
yarn install
yarn build
yarn test
yarn lint
```

## License

MIT — see `LICENSE` for details.