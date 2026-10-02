# Skomma Desktop — Installation

## Prerequisites

| Tool            | Minimum          | Purpose                                  |
| --------------- | ---------------- | ---------------------------------------- |
| Node.js         | 20.x             | Frontend tooling                         |
| pnpm            | 10.x             | Package manager                          |
| Rust toolchain  | stable (edition 2024) | Tauri shell, `cargo check/build`   |
| Tauri system deps | platform-specific | WebView2 (Windows), etc. for Tauri v2    |

Verify versions:

```bash
node --version
pnpm --version
rustc --version
cargo --version
```

> On Windows ensure **WebView2 Runtime** is installed (bundled with most recent
> Windows 11). For the Tauri Linux/Windows prerequisites see the
> [Tauri v2 prerequisites](https://tauri.app/start/prerequisites/).

## 1. Install dependencies

```bash
cd skomma_desktop
pnpm install
```

The Rust crates are fetched on first Tauri build (`pnpm tauri dev` /
`pnpm tauri build`) — the first run takes a while.

## 2. Configure the environment

Copy `.env.example` to `.env` and adjust:

```bash
cp .env.example .env
```

| Variable            | Example                          | Notes                            |
| ------------------- | -------------------------------- | -------------------------------- |
| `VITE_API_BASE_URL` | `http://127.0.0.1:3000`          | Base URL of `skomma_server`      |
| `VITE_WS_URL`       | `ws://127.0.0.1:3000/api/v1/chat/ws` | Chat WebSocket endpoint    |

The dev server runs on **http://localhost:1420** (matches `devUrl` in
`src-tauri/tauri.conf.json`).

## 3. Run the desktop app

```bash
pnpm dev
```

`pnpm dev` runs both the Vite dev server (port 1420) and `tauri dev`
concurrently (via `concurrently`), so frontend hot-reload and the native window
start together. Expect a long first compile from Cargo.

If you prefer to manage the processes yourself, start Vite in one terminal and
run `pnpm tauri:dev` in another — `tauri dev` reuses the already-running dev
server on `http://localhost:1420` (it does not spawn its own).

If the server is required for full functionality, start `skomma_server` first
(`pnpm dev` in `../skomma_server`).

## 4. Build for distribution

```bash
pnpm build        # frontend bundle (vite build)
pnpm tauri build  # native installers/bundles
```

## Troubleshooting

- **`cargo` command not found** — install the Rust toolchain via rustup and
  restart the terminal.
- **`transformWithEsbuild` error at build time** — the project must build with
  `minify: 'oxc'` (already configured in `vite.config.ts`); verify you did not
  change it to esbuild.
- **TypeScript errors about `@types`** — imports must be `from '@types'`
  (not `@types/index`); see `tsconfig.json`.
- **TypeScript version mismatch** — keep `typescript@^5.9`; upgrading to 7 breaks
  `typescript-eslint`.
- **Icon regeneration** — `pnpm tauri icon src-tauri/icons/icon.png` regenerates
  the full icon set from the source PNG.
- **Updater signing key** — `src-tauri/keys/` holds the private signing key; it
  is gitignored. Do not commit it.
