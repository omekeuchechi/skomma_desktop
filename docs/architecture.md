# Skomma Desktop — Architecture

## Overview

The desktop app is a Tauri v2 shell hosting a React frontend and a Babylon.js
3D world. The React layer owns the UI (auth, marketplace, inventory, orders,
settings, chat) and the engine layer owns the 3D simulation. The two talk
through hooks and stores; both talk to the Skomma server over HTTP/WS and to the
OS through Tauri plugins/commands.

```
┌─────────────────────────── skomma_desktop ───────────────────────────┐
│  Tauri shell (Rust)                                                   │
│  ├─ plugins: notification, dialog, store, shell, updater              │
│  └─ custom commands (src-tauri/src/commands)                          │
│                                                                       │
│  React UI (WebView)          Babylon.js World                          │
│  ├─ pages/ routes            ├─ WorldEngine (index.ts)                │
│  ├─ stores (Zustand)         │  ├─ SceneManager / CameraManager       │
│  ├─ services/ network        │  ├─ LightingManager / PhysicsManager   │
│  └─ hooks (useBabylonEngine) │  ├─ AssetManager / ChunkManager        │
│                               │  ├─ PlayerManager / NPCManager         │
│                               │  └─ VehicleManager                    │
└───────────────────────────────────────┬───────────────────────────────┘
                                        │
                       HTTPS / WS  ───► │ ── skomma_server (API)
                                        └── Tauri IPC (invoke / event)
```

## Layers

### 1. Shell (Tauri / Rust)

- `src-tauri/src/main.rs` and `src-tauri/src/lib.rs` set up the app, register
  plugins (notification, dialog, store, shell, updater) and wire the command
  handlers (`src-tauri/src/commands/mod.rs`).
- Native helpers live in `src-tauri/rust/`: `pathfinding`, `chunk_generation`,
  `ai`, `physics`, `mesh`, and `procedural` modules. These expose CPU-heavy
  operations (terrain chunk generation, pathfinding) off the JS thread.
- Permissions are declared in `src-tauri/capabilities/default.json`.
- `tauri.conf.json` configures the window, the dev server URL (port 1420), the
  frontend dist folder, and the updater public key.

### 2. UI Layer (React)

- **Routing**: `src/App.tsx` defines routes — splash/auth screens
  (`SplashScreen`, `Login`, `Register`) and the main app (`Home`, `Marketplace`,
  `Inventory`, `Orders`, `Profile`, `Settings`, `Chat`, `WorldLoading`,
  `World3D`).
- **State**: Zustand stores (`authStore`, `uiStore`, `settingsStore`) hold
  session, UI, and user settings. `ThemeContext` uses `useSyncExternalStore` for
  theme switching.
- **Data fetching**: `services/api.ts` calls the server through
  `network/http.ts` (Axios + interceptor that maps transport errors to
  `ApiError`). Server wrappers for Tauri plugins live in
  `services/plugins.ts`; native command wrappers in `services/tauriCommands.ts`.
- **Shared UI**: `components/` (Button, Card, Input, Spinner, Badge,
  ThemeToggle) and `ui/ToastHost.tsx` (toast notifications).

### 3. Engine Layer (Babylon.js)

- `src/engine/index.ts` exports `WorldEngine`, the orchestrator that wires the
  engine systems together and drives the render loop.
- **SceneManager** owns the Babylon `Scene`; **CameraManager** creates an
  `ArcRotateCamera`; **LightingManager** sets up scene lights; **PhysicsManager**
  initializes the Havok physics plugin (awaited during `start()`).
- **AssetManager** loads glTF/mesh assets (Babylon 9 uses `onTaskError` and no
  `dispose()` on `AssetsManager`).
- **ChunkManager / PlayerManager / NPCManager / VehicleManager** manage world
  chunks, the local player (WASD + sprint), NPCs, and vehicles.
- The hook `useBabylonEngine` (in `hooks/`) binds the engine to a canvas
  element and exposes it to React.

### 4. Domain folders

Typed domain modules keep the code organized: `terrain/` (procedural terrain),
`player/`, `npc/`, `vehicles/`, `inventory/`, `marketplace/`, `chat/`,
`orders/`, `delivery/`, `payments/`, and `world/` (config). A Web Worker
(`workers/worldWorker.ts`) can run world simulation off the main thread.

## Key data flows

**Login → World:**
1. `Login` page posts to `POST /api/v1/auth/login` via `services/api.ts`.
2. `authStore` persists the tokens; `useAuth` exposes the session.
3. On success the router moves to `WorldLoading`, which calls `WorldEngine.start()`
   — physics init, asset load, terrain chunk generation.
4. `World3D` renders the Babylon canvas; the player can walk the world.

**Theme toggle:**
1. `Settings` / `ThemeToggle` update `settingsStore`.
2. `ThemeContext` (useSyncExternalStore) applies the class and persists via the
   Tauri store plugin.

## Design decisions

- **TypeScript pinned to 5.9**: TS 7 breaks `typescript-eslint`; do not upgrade.
- **`minify: 'oxc'` in Vite**: Vite 8 no longer ships esbuild.
- **Rust helpers**: heavy world math (chunks, pathfinding, physics) is moved to
  Rust so the WebView stays responsive.
- **Path aliases**: `@` → `src`, `@ui/*` → `src/ui/*`, `@types` → the exact
  `src/types/index.ts` file.
