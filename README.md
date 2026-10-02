# Skomma Desktop

Desktop client for **Skomma**, a 3D virtual commerce platform. Built with Tauri
v2, React, and Babylon.js — a lightweight native window with a fully 3D world,
marketplace, inventory, orders, chat, and more.

## Tech Stack

| Concern               | Technology                                        |
| --------------------- | ------------------------------------------------- |
| Shell                 | Tauri v2 (Rust backend, WebView frontend)         |
| UI                    | React 19, TypeScript (strict), React Router, TanStack Query |
| Styling               | Tailwind CSS v4                                   |
| 3D engine             | Babylon.js 9.x                                    |
| State                 | Zustand                                           |
| HTTP client           | Axios                                             |
| Forms / validation    | react-hook-form + zod                             |
| Package manager       | pnpm                                              |

## Getting Started

Prerequisites: **Node.js 20+**, **pnpm 10+**, **Rust stable toolchain** (for the
Tauri shell), and the platform WebView requirements for Tauri v2.

```bash
cd skomma_desktop
pnpm install
pnpm dev          # runs Vite (port 1420) + `tauri dev` together
```

> `cargo check` output is cached in `src-tauri/cargo_check.log` — remove the file
> if it goes stale.

## Scripts

| Script              | Description                                       |
| ------------------- | ------------------------------------------------- |
| `pnpm dev`          | Vite + `tauri dev` together (concurrently)        |
| `pnpm tauri:dev`    | `tauri dev` only (reuses a running Vite on 1420)  |
| `pnpm build`        | Build the frontend (`vite build`)                 |
| `pnpm preview`      | Preview the built frontend                        |
| `pnpm tauri`        | Run the Tauri CLI (`build`, `dev`, `icon`, ...)   |
| `pnpm typecheck`    | `tsc --noEmit`                                    |
| `pnpm lint`         | ESLint (flat config)                              |
| `pnpm format`       | Prettier write                                    |

Build a distributable desktop app:

```bash
pnpm tauri build
```

## Project Structure

```
skomma_desktop/
├── docs/                    # architecture, install, dev, deployment guides
├── src/
│   ├── pages/               # Splash, Login, Register, Home, Marketplace,
│   │                        # Inventory, Orders, Profile, Settings, Chat,
│   │                        # WorldLoading, World3D
│   ├── engine/              # Babylon.js engine, scene, camera, lighting,
│   │                        # physics, assets, chunks, player, NPCs, vehicles
│   ├── components/          # Button, Card, Input, Spinner, Badge, ThemeToggle
│   ├── ui/                  # ToastHost (toast system)
│   ├── layouts/             # MainLayout, AuthLayout
│   ├── contexts/            # ThemeContext
│   ├── stores/              # authStore, uiStore, settingsStore (Zustand)
│   ├── hooks/               # useAuth, useThemeMode, useBabylonEngine
│   ├── network/             # axios instance + error mapping
│   ├── services/            # API + Tauri plugin/command wrappers
│   ├── config/ constants/   # app configuration and constants
│   ├── types/               # shared domain types
│   ├── utils/               # cn, formatDate, clamp, debounce
│   ├── terrain/ player/ npc/ vehicles/ inventory/ marketplace/
│   ├── chat/ orders/ delivery/ payments/ world/ workers/
│   └── assets/              # brand assets, worker scripts
└── src-tauri/
    ├── src/                 # Rust entry (main.rs, lib.rs, commands)
    ├── rust/                # pathfinding, chunk generation, AI, physics,
    │                        # mesh, procedural generation
    ├── capabilities/        # Tauri permissions
    ├── icons/               # app icon set
    └── tauri.conf.json      # app config (window, updater, plugins)
```

## Key Configuration Notes

- **Vite** (`vite.config.ts`): uses `minify: 'oxc'` (esbuild is not a
  dependency of Vite 8), and path aliases `@`, `@ui`, etc.
- **TypeScript** (`tsconfig.json`): pinned to `typescript@^5.9` — do not upgrade
  to TS 7 (it breaks `typescript-eslint`). `@types` maps exactly to
  `src/types/index.ts` (import as `from '@types'`, never `@types/index`).
- **Tauri updater**: public key embedded in `src-tauri/tauri.conf.json`; the
  private signing key lives in `src-tauri/keys/` (gitignored).
- **Tailwind v4**: custom `@theme` tokens (`primary`, `accent`, `surface`) and a
  `@custom-variant` for dark mode in `src/styles/index.css`.

## Documentation

See the `docs/` folder:

- [Architecture](docs/architecture.md)
- [Installation](docs/installation.md)
- [Development](docs/development.md)
- [Deployment](docs/deployment.md)

## License

Proprietary — part of the Skomma startup project.
