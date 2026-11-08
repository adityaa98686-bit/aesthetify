# Contributing

Small, focused changes and reproducible bug reports are welcome. Open an issue before proposing large behavior or permission changes.

## Structure

- `extension/`: Manifest V3 runtime; load this directory directly in Chrome.
- `tests/`: Node built-in test runner and original text fixtures.
- `scripts/`: manifest/runtime validation and deterministic ZIP packaging.
- `docs/`: original interface preview and release preparation materials.

## Verify a change

Run `npm run check`, `npm test`, and `npm run build`. Reload the unpacked extension and verify the affected behavior on Spotify. State separately which checks used mocks/fixtures and which used the actual Spotify site.

For UI changes, check narrow and desktop windows, keyboard focus, Unicode/Hindi text spacing, and reduced motion. For player changes, test native-player fallback and compare behavior with the extension disabled. Keep captured screenshots free of personal data and copyrighted media unless you have permission to redistribute them.

Do not add audio capture, audio rerouting, private Spotify endpoints, credentials, analytics, or broader host permissions as an incidental change. A permission expansion needs an explicit feature proposal and review.

## Pull requests

Describe the user-visible problem, the change, verification performed, and remaining limitations. Avoid unrelated formatting changes. Do not include generated ZIPs, account data, local absolute paths, or secrets.

## Bugs

Include Chrome version, extension version, relevant palette/view, steps to reproduce, expected/actual behavior, and whether Spotify works with Aesthetify disabled. Redact personal information from screenshots and logs.
