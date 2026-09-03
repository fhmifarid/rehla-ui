# Contributing to Rehla UI

Rehla UI is an internal design system for the Rehla (رحله) project. Pull requests are welcome from anyone in the Rehla organization or the wider community. All contributions are reviewed by the Rehla UI maintainers.

## Prerequisites

- Node.js 18+
- Yarn 3 (the repo ships its own binary via `corepack`)
- Familiarity with React, TypeScript, Tailwind CSS

## Working on a component

Most work happens in `packages/ui/src/components/<component-name>/`. Each component lives in a folder containing:

- `<component>.tsx` — the component implementation
- `<component>.stories.tsx` — Storybook story
- `<component>.spec.tsx` — Vitest tests (not every component has tests; the goal is one test per meaningful behavior)
- `index.ts` — re-export

Tailwind classes follow the design tokens defined in `packages/ui/src/preset/theme/tokens/`. Don't introduce ad-hoc colors or font sizes.

## Running tests and Storybook

```bash
yarn workspace @rehla-ui/ui test
yarn workspace @rehla-ui/ui storybook
```

## Naming

- All package names use the `@rehla-ui` scope.
- Component files are PascalCase (`DatePicker.tsx`).
- Hooks are prefixed with `use-` (`use-toast.ts`).

## License

By contributing, you agree that your contributions will be licensed under the MIT License.