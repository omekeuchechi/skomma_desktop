# Skomma Desktop — Deployment

## Build the production app

```bash
pnpm install
pnpm build          # frontend: vite build → dist/
pnpm tauri build    # native bundles (NSIS/MSI on Windows, DMG/AppImage elsewhere)
```

Output bundles land under `src-tauri/target/release/bundle/`. The Tauri build
embeds `frontendDist: ../dist` (from `tauri.conf.json`) into the binary, so the
frontend must be built first.

## Versioning and releases

Bump the version in `src-tauri/tauri.conf.json` (`version`) and `package.json`
before each release. The updater checks this version against the update manifest
hosted on your update server.

## Auto-updates

The updater plugin is configured with a public key in
`src-tauri/tauri.conf.json` → `plugins.updater.pubkey`.

1. **Private key**: kept in `src-tauri/keys/skomma_updater.key` (gitignored).
   Back it up; it is required to sign every release and cannot be recovered.
2. **Build artifacts**: `pnpm tauri build` produces the installer plus a
   `.sig` file (or sign manually:
   `pnpm tauri signer sign --private-key <key> <bundle>`).
3. **Host the update**: put the bundle + `.sig` on your update endpoint and set
   the endpoint in `plugins.updater.endpoints` in `tauri.conf.json`.
4. The app polls for updates and applies them at runtime.

> If the private key is lost, existing installs can no longer verify updates.
> Keep it in a password manager or CI secret store.

## Production configuration checklist

| Item                    | Action                                                            |
| ----------------------- | ----------------------------------------------------------------- |
| Server URL              | Set `VITE_API_BASE_URL` to the deployed `skomma_server` origin    |
| WebSocket URL           | Set `VITE_WS_URL` to the deployed chat WebSocket endpoint          |
| Updater endpoint        | Configure `plugins.updater.endpoints` + serve signed bundles       |
| Capabilities            | Confirm `capabilities/default.json` grants only needed permissions |
| Secrets                 | Never ship `.env` or `src-tauri/keys/` in bundles                  |
| Frontend dist           | Run `pnpm build` before `pnpm tauri build`                         |

## CI/CD guidance

A typical pipeline:

1. Install Node 20+, pnpm, Rust stable, and Tauri prerequisites.
2. `pnpm install`
3. `pnpm typecheck && pnpm lint`
4. `pnpm build`
5. `pnpm tauri build`
6. Sign the bundle with the stored private key.
7. Upload the bundle + `.sig` to the update host; publish release notes.

## Platform notes

- **Windows**: builds produce NSIS/MSI installers; ensure WebView2 is available
  (Windows 11 ships it).
- **Signing**: for public distribution, sign the Windows binary with a code
  signing certificate to avoid SmartScreen warnings.
- **Icons**: the icon set in `src-tauri/icons/` covers Windows, macOS, Linux,
  Android, and iOS; regenerate with `pnpm tauri icon` if branding changes.

## Rollback

Because updates are version-checked, rolling back is a matter of signing and
hosting the previous version's bundle. Downgrade installs may require the user to
install manually if the updater refuses version regression.
