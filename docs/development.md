# Skomma Desktop — Development

## Workflow

```bash
pnpm dev   # runs Vite (port 1420) + `tauri dev` together via concurrently
```

Frontend edits hot-reload through Vite. Rust edits in `src-tauri/` require a
full rebuild (Tauri restarts the app automatically on `tauri dev`). Stopping the
process (`Ctrl+C`) kills both Vite and the Tauri app (`concurrently -k`).

Run the quality gate before committing:

```bash
pnpm typecheck     # strict TypeScript
pnpm lint          # ESLint (flat config)
pnpm format        # Prettier
pnpm build         # vite build (production frontend)
cargo check        # (in src-tauri) validates Rust modules
```

## Conventions

- **TypeScript is pinned to `^5.9`** — do not upgrade to TS 7; it breaks
  `typescript-eslint`. This is enforced in `package.json`.
- **Vite minifier is `oxc`** — keep `minify: 'oxc'` in `vite.config.ts`.
- **Aliases**: use `@` → `src`. Domain types import from `@types` (exact file
  mapping). UI components use `@ui/*` → `src/ui/*`.
- **React 19 + hooks**: follow `react-hooks` v7 rules — no synchronous
  `setState` inside effects, no ref reads during render (see the `useBabylonEngine`
  hook and `Settings.tsx` for the pattern).
- **Components**: add to `src/components/` following the existing Button/Card
  primitives; add to `src/ui/` for overlay systems (ToastHost).
- **No secrets**: never commit tokens or the updater private key
  (`src-tauri/keys/` is gitignored).

## Adding a page

1. Create the page under `src/pages/`, e.g. `src/pages/Vendors.tsx`.
2. Register the route in `src/App.tsx` using `react-router-dom`.
3. Pull data through `services/api.ts` (server) or stores (local state).
4. If it needs the 3D world, use the `useBabylonEngine` hook to access the scene.

## Working with the Babylon engine

The engine entry is `src/engine/index.ts` (`WorldEngine`). Systems:

| System            | File                | Responsibility                    |
| ----------------- | ------------------- | --------------------------------- |
| Scene             | `engine/SceneManager.ts` | Babylon scene lifecycle      |
| Camera            | `engine/CameraManager.ts` | ArcRotateCamera control     |
| Lighting          | `engine/LightingManager.ts` | Scene lights             |
| Physics           | `engine/PhysicsManager.ts`  | Havok physics init        |
| Assets            | `engine/AssetManager.ts`    | glTF/mesh asset loading   |
| Chunks            | `engine/ChunkManager.ts`    | Terrain chunk streaming   |
| Player            | `engine/PlayerManager.ts`   | WASD + sprint movement    |
| NPC / Vehicles    | `engine/NPCManager.ts`, `engine/VehicleManager.ts` | AI actors |

Notes specific to Babylon 9:
- `AssetsManager` reports errors via `onTaskError` (task has
  `task.errorObject.message`), and has no `dispose()`.
- `Scene.ambientColor` is a `Color3`.
- `MeshAssetTask.loadedMeshes` may contain `AbstractMesh` — narrow with
  `instanceof Mesh`.

## Working with Tauri

- **Custom commands**: implement in `src-tauri/src/commands/` and register in
  `src-tauri/src/lib.rs`; call from JS via `services/tauriCommands.ts`
  (`@tauri-apps/api/core` `invoke`).
- **Permissions**: a capability must list every command/plugin permission you
  use (`src-tauri/capabilities/default.json`). New plugins require new
  permissions.
- **Rust helpers**: put CPU-heavy logic (chunk generation, pathfinding,
  procedural meshes) in `src-tauri/rust/` modules, exposed through commands.
- **Icons**: regenerate with `pnpm tauri icon src-tauri/icons/icon.png`.

## Updater (releases)

The app uses the Tauri updater plugin.

- Public key is embedded in `src-tauri/tauri.conf.json` → `plugins.updater.pubkey`.
- Sign releases with the private key from `src-tauri/keys/`:
  `pnpm tauri signer sign --private-key <path> <bundle>`.
- Publish bundles + signature to your update host; configure the endpoint in
  `tauri.conf.json`.

## Testing

There is no automated test suite yet. Manual checks:

```bash
pnpm typecheck && pnpm lint && pnpm build && cargo check
```

Add unit tests beside modules when behavior is non-trivial (e.g. `utils/`, domain
types, Rust `rust/` modules with `#[cfg(test)]`).
