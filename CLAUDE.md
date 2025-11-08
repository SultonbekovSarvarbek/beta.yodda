# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

- **React 19** with TypeScript
- **TanStack Router** for routing (code-based routing, not file-based)
- **Tailwind CSS v4** for styling
- **shadcn/ui** components (New York style variant)
- **Vite** for build tooling
- **Vitest** for testing

## Development Commands

```bash
# Install dependencies
yarn install

# Start dev server (runs on port 3000)
yarn dev

# Run tests
yarn test

# Build for production (runs vite build + tsc)
yarn build

# Preview production build
yarn serve
```

## Architecture

### Routing System

This project uses **code-based routing** with TanStack Router (defined in `src/main.tsx`), not file-based routing. Routes are manually created and added to the route tree:

- Root route: Defined in `src/main.tsx` with `createRootRoute()`, wraps all routes with `<Outlet />` and dev tools
- Index route: Maps to `/` and renders the `App` component from `src/App.tsx`
- Route tree: Built by calling `rootRoute.addChildren([...routes])`

To add a new route:
1. Create a route with `createRoute({ getParentRoute: () => rootRoute, path: '/your-path', component: YourComponent })`
2. Add the route to the `routeTree` array: `rootRoute.addChildren([indexRoute, newRoute])`

The router is configured with:
- `defaultPreload: 'intent'` - preloads routes on hover/focus
- `scrollRestoration: true` - restores scroll position on navigation
- `defaultStructuralSharing: true` - optimizes re-renders

### UI Components (shadcn/ui)

Components are configured with:
- Style: `new-york` variant
- Base color: `neutral`
- CSS variables enabled for theming
- Icon library: `lucide-react`
- Utility function: `cn()` in `src/lib/utils.ts` combines `clsx` and `tailwind-merge` for conditional class merging

UI components are located in `src/components/ui/` and include: accordion, avatar, badge, breadcrumb, button, card, checkbox, command, dialog, input, label, navigation-menu, pagination, popover, progress, select, separator, and more.

### Import Aliases

The project uses `@/` as an alias for `./src/`:
- Configured in both `vite.config.ts` and `tsconfig.json`
- Example: `import Component from '@/components/Component'`
- Additional shadcn aliases: `@/components/ui`, `@/lib/utils`, `@/hooks`

### TypeScript Configuration

- Strict mode enabled
- Module resolution: bundler
- Unused locals/parameters checking enabled
- No emit mode (Vite handles transpilation)

### Testing

Uses Vitest with React Testing Library and jsdom environment.

### Performance Monitoring

Includes `reportWebVitals` in `src/reportWebVitals.ts` for measuring Core Web Vitals (CLS, INP, FCP, LCP, TTFB).
