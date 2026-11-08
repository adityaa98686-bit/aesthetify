# Aesthetify privacy

Aesthetify runs on `https://open.spotify.com/`. It reads the page's visible track details, artwork URL, playback position and lyrics to display its interface. It forwards your play/pause, skip, seek and volume actions to Spotify's visible controls. It can open the native lyrics panel when available.

Preferences and optional imported lyric files are stored locally using Chrome extension storage. Lyrics mirrored from Spotify are displayed transiently and are not saved. Removing the extension removes its extension-local stored data.

Search submits your query to Spotify's search field or search URL. Aesthetify does not store search queries. A temporary expiry-only flag prevents the immersive view covering search results after navigation.

There is no tab-audio capture, microphone or camera access, audio analysis, recording, audio rerouting, analytics, advertising SDK, cloud AI call, external lyrics provider, or extension backend. Artwork uses the URL already present on the Spotify page. All visual effects are drawn locally in code.

Required extension capabilities are local storage and activeTab. The toolbar popup uses activeTab to identify the Spotify tab you invoke it on. Content scripts are restricted to Spotify Web.

Aesthetify is independent and not affiliated with Spotify.
