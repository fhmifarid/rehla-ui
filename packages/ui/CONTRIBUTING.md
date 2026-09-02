# Contributing to @rehla-ui/ui

This package is part of the Rehla UI design system. Component APIs and design tokens are intentionally stable; we accept bug fixes and improvements, but feature additions need an issue first.

## Branches

- `fix/<name>` for bug fixes
- `feat/<name>` for new components / variants
- `docs/<name>` for documentation
- `refactor/<name>` for internal cleanup

## Commits

Keep commits small and isolated. Use Conventional Commits prefixes (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).

## Pull Requests

PRs target the `main` branch. In the description, follow this structure:

- **What** — what changes are in this PR
- **Why** — why are these changes relevant
- **How** — how have the changes been implemented
- **Testing** — how was it tested, or how can the reviewer test it

All PRs are squashed and merged.

## Testing

```bash
yarn workspace @rehla-ui/ui test
yarn workspace @rehla-ui/ui typecheck
yarn workspace @rehla-ui/ui lint
```