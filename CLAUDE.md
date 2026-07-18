# Room_bbang_signal

Next.js (App Router) project bootstrapped with Tailwind CSS, TypeScript, and ESLint.

## Commands
- **Dev Server**: `npm run dev`
- **Production Build**: `npm run build`
- **Linting**: `npm run lint`
- **Type Checking**: `npx tsc --noEmit`

## Tech Stack & Architecture
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Directory Structure**:
  - `src/app/`: App router pages, layouts, and API routes.
  - `public/`: Static assets.

## Guidelines & Rules
- **Next.js Breaking Changes**: See instructions in @AGENTS.md. Always refer to Next.js documentation before writing new routing or config code.
- **Components**: Use Server Components by default. Use `"use client"` only for client-side interactivity.
- **Styling**: Prefer utility classes from Tailwind CSS.
- **Types**: Always use TypeScript type definitions for props and state. Avoid using `any`.
