<div align="center">

![Aesthetify animated neon banner](docs/atmosphere.gif)

# Your music. Your atmosphere.

**Turn Spotify Web into a world of lyrics, light, and motion.**

[![Download ZIP](https://img.shields.io/badge/DOWNLOAD-Extension_ZIP-9ee6c1?style=for-the-badge)](https://github.com/adityaa98686-bit/aesthetify/releases/download/v1.0.0-beta.3/Aesthetify-1.0.0.zip)
[![License MIT](https://img.shields.io/badge/License-MIT-e7ca86?style=for-the-badge)](LICENSE)
[![Checks](https://github.com/adityaa98686-bit/aesthetify/actions/workflows/ci.yml/badge.svg)](https://github.com/adityaa98686-bit/aesthetify/actions/workflows/ci.yml)

**Made by ADITYA** · [LinkedIn](https://www.linkedin.com/in/aditya-jain-72170037b/) · [GitHub](https://github.com/adityaa98686-bit)

[Download](https://github.com/adityaa98686-bit/aesthetify/releases/tag/v1.0.0-beta.3) · [Quick setup](#quick-setup) · [Report a problem](https://github.com/adityaa98686-bit/aesthetify/issues)

</div>

![Aesthetify interface with original sample text](docs/preview.jpg)

> **Public beta:** independent, not endorsed by Spotify, and not on the Chrome Web Store. Local checks pass; compatibility can change with Spotify updates. The animation above is decorative branding; the screenshot shows the interface.

## Quick setup

**Chrome desktop · no account or payment required for Aesthetify**

1. **[Download Aesthetify-1.0.0.zip](https://github.com/adityaa98686-bit/aesthetify/releases/download/v1.0.0-beta.3/Aesthetify-1.0.0.zip)** and extract it. On macOS, double-click the ZIP. On Windows, right-click → **Extract All**.
2. Open **`chrome://extensions`** in Chrome and switch **Developer mode** on at the top right.
3. Click **Load unpacked** → choose the extracted **Aesthetify-1.0.0** folder containing **`manifest.json`**. Keep this folder on your computer.
4. Open or refresh **[Spotify Web](https://open.spotify.com)**, play a song, and click the Aesthetify extension icon → **Open / close immersive view**.

**Already using an older copy?** Disable/remove older Neon or Aesthetify copies first. Keep one copy enabled. ZIP installs do not auto-update: download a newer release, extract it, remove the old copy, and load the new folder.

<details>
<summary><strong>Stuck? Open the quick fixes</strong></summary>

- **“Manifest missing”:** select the folder directly containing `manifest.json`, not the ZIP or its parent folder.
- **Cannot find the icon:** click Chrome’s puzzle-piece Extensions menu and pin Aesthetify.
- **No lyrics:** open Spotify’s lyrics panel once. Some songs/accounts have no available lyrics; Aesthetify cannot provide them.
- **Want Spotify back:** press **Escape**, use **Show Spotify player** in the popup, or disable Aesthetify.
- **Playback problem:** disable Aesthetify and test Spotify’s original Play button. Report whether it still happens without the extension.
- **Updating from source:** cloned repositories use the `extension/` folder instead of the release folder.

</details>

## What you are installing

- Readable, open-source code with an [MIT license](LICENSE).
- Permissions: **storage** and **activeTab**; automatic content scripts run on **open.spotify.com** only.
- No microphone, audio capture, recording, audio rerouting, analytics, or extension backend.
- Native Spotify controls remain available. See the [privacy details](PRIVACY.md).
- Release files include **SHA256SUMS** for integrity checking. Checksums verify the download, not an independent security audit.

## Features

- Bold lyric lines with spaced word-pop transitions, driven by Spotify's visible active line.
- Instrumental visuals when a clear lyric line is absent or an instrumental marker is shown.
- Emerald Gold shooting stars, Rose Quartz petals, Midnight Rain window droplets, Solar Fire flames, Violet Dream twinkles, Ocean Glow waves, and Golden Hour glints.
- Automatic palette changes and visual layouts on a 10-second timeline, plus per-track palette overrides.
- A persistent matching player dock with play/pause, skip, seek, volume, and a fallback to Spotify's original player.
- Search through Spotify's native search interface.
- Local preferences and optional timed-lyric imports.
- Reduced-motion support.

**No audio capture, microphone access, recording, audio analysis, or audio-output rerouting.** The small glow above the lyrics is decorative.

## Limitations

- Word pops are an animation of a Spotify-highlighted line, not measured vocal word timings. Explicit word timings require a matching imported file.
- Spotify's DOM is the compatibility adapter. Site updates, unavailable lyrics, account restrictions, or different markup can stop automatic detection.
- An old line may remain visible if Spotify leaves it highlighted throughout an instrumental break. Aesthetify does not infer vocals from audio.
- The custom player forwards actions to visible Spotify controls. It cannot initialize an unavailable Spotify playback device; unsupported controls are disabled.
- Search tries Spotify's own search input. Its normal-URL fallback can reload the page and interrupt playback.

If Spotify fails, use the native-player fallback, disable Aesthetify, and test Spotify alone. Please report whether the problem remains without the extension. Do not post account credentials or private logs.

## Development

Node.js 22 or newer. There are no npm dependencies and no build step is required to load `extension/`.

```sh
npm run check
npm test
npm run build
```

`build` creates `dist/Aesthetify-1.0.0.zip`, with `manifest.json` at its root. Only extension runtime assets and its user documentation enter the install ZIP. Tests, screenshots, and contributor documents stay in the source repository.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the project structure and verification workflow.

## Privacy and permissions

See [PRIVACY.md](PRIVACY.md). Preferences and optional imported lyrics stay in extension-local storage. No analytics or extension backend is included. Content scripts run only on `open.spotify.com`; `activeTab` identifies the Spotify tab when the toolbar popup is invoked.

## Distribution and rights

The MIT license covers this repository's original code and original icons. It does not grant rights to Spotify's trademarks, artwork, songs, lyrics, or third-party content. This repository contains no Spotify songs, fetched lyric catalog, or album artwork; its screenshot uses original sample text and a placeholder cover.

Before distributing or submitting this extension publicly, assess applicable Spotify policies, lyric rights, and Chrome Web Store requirements. Spotify's developer policy restricts synchronization with visual media; applicability and any required permissions must be resolved rather than assumed. See the [Spotify Developer Policy](https://developer.spotify.com/policy) and [Chrome Web Store policies](https://developer.chrome.com/docs/webstore/program-policies/).

## License

[MIT](LICENSE). Copyright 2026 Aesthetify contributors.

---

<div align="center">

**Made by ADITYA**

[LinkedIn](https://www.linkedin.com/in/aditya-jain-72170037b/) · [GitHub](https://github.com/adityaa98686-bit)

If Aesthetify makes your listening better, give the project a ⭐.

</div>
