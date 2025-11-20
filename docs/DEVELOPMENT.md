# Development Guide

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd insoday
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Environment Variables**
   Copy `.env.example` to `.env` and configure necessary variables.
   ```bash
   cp .env.example .env
   ```

4. **Start Development Server**
   ```bash
   yarn dev
   ```
   The app will run at `http://localhost:3000`.

## Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Starts the development server with HMR |
| `yarn build` | Builds the application for production (Vite + TSC) |
| `yarn serve` | Previews the production build locally |
| `yarn test` | Runs unit tests using Vitest |

## Coding Conventions

### Component Structure
We use **shadcn/ui** for base components.
- Place reusable UI components in `src/components/ui`.
- Place feature-specific components in `src/components`.

### Imports
Use the `@` alias to import from `src`.
```tsx
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
```

### Styling
Use **Tailwind CSS** for all styling.
- Use utility classes for layout and spacing.
- Use `cn()` utility for conditional class merging.

## Testing

Run the test suite with:
```bash
yarn test
```
Tests are built with **Vitest** and **React Testing Library**.
