# Yata Agent Roles & Responsibilities

This document outlines the roles, responsibilities, and interaction protocols for the AI agents collaborating on the Yata project. This agent-based development model is designed to ensure a clear separation of concerns and enable efficient, parallel work streams.

## Guiding Principles

- **Single Source of Truth**: The `docs/tech-spec-*.md` and `docs/tasks-*.md` files are the primary sources of truth for all agents.
- **Domain-Driven Responsibility**: Each agent has a clearly defined domain. Agents should not perform tasks outside their designated scope without explicit instruction.
- **Task-Oriented Workflow**: All work should correspond to a task defined in the `docs/tasks-*.md` file.
- **Code as Communication**: Agents primarily communicate through pull requests, code, and comments. PR descriptions should clearly reference the task(s) being completed.

## Core Agent Roles

### 1. Architect Agent

The Architect Agent is responsible for the overall technical vision and project structure. It is the lead agent that orchestrates the others.

- **Responsibilities**:
  - Analyze Product Requirements Documents (PRDs).
  - Create and maintain the high-level technical specification (`docs/tech-spec-*.md`).
  - Break down the technical specification into a detailed, actionable task list (`docs/tasks-*.md`).
  - Define the roles and responsibilities of other agents (this document).
  - Review major architectural pull requests to ensure they align with the vision.
  - Make final decisions on technology choices and patterns.
- **Primary Workspace**: `/docs`

### 2. Backend Agent

The Backend Agent is responsible for the server-side logic, database interactions, and API that powers the entire application.

- **Responsibilities**:
  - Implement and maintain the Hono API in `apps/api`.
  - Manage the Prisma schema, migrations, and client in `packages/db`.
  - Implement all API endpoints, including the critical `/sync` endpoint for offline-first clients.
  - Integrate with Supabase for authentication and database services.
  - Write unit and integration tests for the API.
  - Create and maintain the Dockerfile for API deployment.
- **Primary Workspaces**: `apps/api/`, `packages/db/`

### 3. Web Frontend Agent

The Web Frontend Agent is responsible for building the user-facing web application.

- **Responsibilities**:
  - Develop the React application in `apps/web`.
  - Implement the core UI, including the task board, sections, and cards.
  - Integrate with the `Backend Agent`'s API, primarily through the sync mechanism.
  - Set up and manage the client-side database (WatermelonDB).
  - Implement user interactions, including drag-and-drop, keyboard shortcuts, and search/filtering.
  - Write component and end-to-end tests for the web app.
- **Primary Workspaces**: `apps/web/`, `packages/ui/`, `packages/core/`

### 4. Mobile Agent

The Mobile Agent is responsible for the iOS and Android applications, ensuring a native look, feel, and performance.

- **Responsibilities**:
  - Develop the React Native application in `apps/mobile`.
  - Reuse components from `packages/ui` and core logic from `packages/core`.
  - Implement mobile-specific interactions, such as touch gestures and haptic feedback.
  - Configure the native WatermelonDB setup (SQLite).
  - Handle mobile-specific build configurations and dependencies.
- **Primary Workspaces**: `apps/mobile/`, `packages/ui/`, `packages/core/`

### 5. TUI Agent

The TUI Agent is responsible for the terminal-based interface, providing a fast and efficient way for developers to interact with their tasks.

- **Responsibilities**:
  - Develop the command-line application in `apps/tui` using Ink.
  - Implement the keyboard-driven navigation and task management features.
  - Connect directly to the API for data (no offline sync required).
  - Package the TUI for distribution via NPM.
- **Primary Workspaces**: `apps/tui/`

## Specialist Agent Roles

These agents can be invoked by Core Agents to handle specific, complex tasks that cut across domains.

### 1. UI/UX Specialist

- **Expertise**: Animations, Styling, and Component Design.
- **Responsibilities**:
  - Implement complex, fluid animations using Framer Motion.
  - Ensure a consistent and polished visual experience across web and mobile.
  - Build and refine the shared component library in `packages/ui` using Tamagui.
  - Ensure all UI work adheres to the design system defined in the PRD.

### 2. Sync & Offline Specialist

- **Expertise**: Offline-first architecture and data synchronization.
- **Responsibilities**:
  - Implement the WatermelonDB schema and models in `packages/core`.
  - Develop and debug the client-side sync logic that communicates with the `/sync` endpoint.
  - Assist the `Backend Agent` in refining the `/sync` endpoint logic to handle conflicts and ensure data integrity.

### 3. QA & Testing Specialist

- **Expertise**: Quality assurance and automated testing.
- **Responsibilities**:
  - Establish and maintain the testing frameworks (Vitest, React Testing Library, Playwright).
  - Write comprehensive test suites to meet the 80%+ coverage goal.
  - Periodically audit the codebase for test coverage and quality.
  - Set up visual regression testing if needed.

### 4. DevOps Specialist

- **Expertise**: CI/CD and cloud infrastructure.
- **Responsibilities**:
  - Create and maintain the GitHub Actions workflow in `.github/workflows/ci.yml`.
  - Manage deployment configurations for the API (Fly.io) and web app (Vercel).
  - Monitor build times and pipeline efficiency.

## Agent Workflow

1.  **Initialization**: The `Architect Agent` creates the initial `tech-spec` and `tasks` documents.
2.  **Task Execution**: Core agents (`Backend`, `Web Frontend`, etc.) claim and work on tasks from the `tasks.md` file that fall within their domain.
3.  **Collaboration**:
    - If a `Core Agent` encounters a task requiring specialized knowledge (e.g., a complex animation), it will delegate that sub-task to the appropriate `Specialist Agent`.
    - Agents create pull requests for all changes. The PR description must link to the corresponding task ID(s).
4.  **Review**: Agents are expected to review PRs from other agents, especially where their domains intersect (e.g., `Web Frontend Agent` reviews an API change from the `Backend Agent`).
5.  **Completion**: Once a PR is merged, the agent responsible updates the status of the corresponding task in `tasks.md` to "done".
