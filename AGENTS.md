# AGENTS.md

This document provides guidelines for agentic coding agents working in this repository.

## Commands

- **Install dependencies**: `bun install`
- **Run the API**: `bun run dev` in `apps/api`
- **Generate Prisma client**: `bun run db:generate` in `packages/db`
- **Run tests**: `bun test` (no specific test command found, use Bun's default)
- **Run a single test file**: `bun test <path/to/test.ts>`

## Code Style

- **Imports**: Use ES module syntax (`import/export`).
- **Formatting**: Standard TypeScript with 2-space indentation.
- **Types**: Use TypeScript for static typing and Zod for runtime validation.
- **Naming**: `camelCase` for variables and functions, `PascalCase` for types and classes.
- **Error Handling**: Use `try/catch` blocks for async operations and database calls.
- **Frameworks**: The API uses Hono. The database uses Prisma.
- **Runtime**: This project uses Bun. See `.cursor/rules/use-bun-instead-of-node-vite-npm-pnpm.mdc` for more information.
- **Database Schema**: The database schema is defined in `packages/db/prisma/schema.prisma`. After changing it, run `bun run db:generate`.
