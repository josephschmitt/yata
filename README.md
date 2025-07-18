# Yata - A Modern, Offline-First Task Manager

Yata (Yet Another Task App) is a multi-platform, offline-first task management application designed for speed, efficiency, and a seamless user experience across web, mobile, and the terminal. It leverages a modern, TypeScript-first technology stack and a robust synchronization engine to ensure your tasks are always available, whether you're online or off.

## Project Documentation

The development of Yata is guided by a clear product vision and technical strategy. For a detailed understanding of the project's goals, architecture, and current progress, please refer to the following documents:

-   **[📄 Product Requirements Document (PRD)](./docs/prd-2025-07-17.md)**: The "what" and "why" of the project. This document outlines the user stories, features, and overall product vision.
-   **[🛠️ Technical Specification](./docs/tech-spec-2025-07-17.md)**: The "how" of the project. This document details the system architecture, data models, API design, and technology choices.
-   **[✅ Implementation Tasks & Progress](./docs/tasks-2025-07-17.md)**: A live look at the development progress. This file breaks down the tech spec into actionable tasks and tracks their completion status.

## Core Features

-   **Offline-First Sync**: Built with WatermelonDB, Yata is fully functional without an internet connection. All changes sync seamlessly when you're back online.
-   **Multi-Platform**: A single, unified experience across the Web, Mobile (iOS/Android), and a Terminal UI (TUI).
-   **Natural Language Input**: Quickly create tasks using natural language for dates, projects, and tags (e.g., "Fix the login bug @WebApp #Urgent tomorrow").
-   **Fluid & Fast UI**: A keyboard-driven interface with 60fps animations ensures a productive and enjoyable experience.

## Technology Stack

Yata is built as a monorepo using **Bun** as the core toolkit.

| Component         | Technology                                              |
| ----------------- | ------------------------------------------------------- |
| **Runtime/Toolkit** | **Bun**                                                 |
| **Backend**       | **Hono**                                                |
| **Database**      | **Supabase (PostgreSQL)**                               |
| **ORM**           | **Prisma**                                              |
| **Web Frontend**  | **React (Vite)**                                        |
| **Mobile App**    | **React Native**                                        |
| **Terminal App**  | **Ink**                                                 |
| **Offline Sync**  | **WatermelonDB**                                        |
| **Shared UI**     | **Tamagui**                                             |
| **Testing**       | **Vitest** & **Playwright**                             |
| **CI/CD**         | **GitHub Actions**                                      |

## Getting Started

### Prerequisites

Ensure you have [Bun](https://bun.sh) installed on your system.

### 1. Installation

Clone the repository and install all dependencies using Bun. This will install dependencies for all workspaces (`apps` and `packages`).

```bash
git clone <repository-url>
cd yata
bun install
```

### 2. Environment Setup

You will need to connect to a Supabase instance for the database and authentication.

1.  Copy the example environment file for the database package: `cp packages/db/.env.example packages/db/.env`
2.  Create a project on [Supabase](https://supabase.com/).
3.  Navigate to your project's **Settings > Database** and copy the **Connection String** (URI).
4.  Paste the connection string into `packages/db/.env`.

### 3. Running the Applications

You can run each application in development mode from the root directory using Bun's `--filter` flag.

```bash
# Run the backend API (on http://localhost:3000)
bun --filter api dev

# Run the web application (on http://localhost:5173)
bun --filter web dev

# Run the Terminal UI
bun --filter tui dev
```

## Monorepo Structure

The project is organized into two main directories:

-   `apps/`: Contains the user-facing applications (the Hono API, the React web app, the React Native mobile app, and the Ink TUI).
-   `packages/`: Contains shared code and utilities used across the different apps, such as the database schema, core business logic, and the universal UI component library.
