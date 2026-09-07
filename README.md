# Ver-Dikt & Andy Dav

Static artist website. Russian editorial content, native WebGL logo sculpture, public catalogue and on-demand listening.

## Run and build

Use Node 18+ and Python 3:

```sh
npm run check
npm run build
python -m http.server 5177
```

The deployable output is `dist`. Local source audio is intentionally excluded from the build and Git. The site does not preload audio, resume playback, or advance automatically. Only explicit play actions start a streamed preview. Spotify loads only on request and is removed when its panel closes or a preview starts.

## Catalogue maintenance

`tools/beatport-source.tsv` contains the 141 public release records observed on the Ver-Dikt Beatport artist catalogue on 2026-09-07, including solo work, remixes and compilation appearances. This is a snapshot, not a claim of live synchronisation or 141 original duo singles. Release dates after the visitor's current date are marked upcoming.

`python tools/prepare-catalogue.py --refresh` refreshes the public Apple lookup and regenerates `src/catalogue.js`. The 89 unique previews retain distinct original, extended and mixed versions. Preview audio is streamed directly from Apple and never downloaded by the maintenance tool. Store attribution and the official iTunes badge appear alongside the player. Do not remove these when changing the design.

To update Beatport, verify the public artist releases page and edit the TSV. Do not invent cross-platform matches: platform profile links and direct Apple song links are separate from Beatport release links. A new snapshot date should be updated in both the generator and the visible catalogue note.

## Sources and editorial decisions

- [Ver-Dikt releases on Beatport](https://www.beatport.com/artist/ver-dikt/582610/releases?page=1&per_page=150): titles, labels, dates, artwork URLs and release links.
- [Andy Dav on Beatport](https://www.beatport.com/artist/andy-dav/870834): second artist profile linked for further catalogue browsing.
- [Apple public artist lookup](https://itunes.apple.com/lookup?id=1512000242&entity=song&limit=200): actual song identifiers, preview URLs, store links and credits.
- [Apple Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/): streamed promotional preview integration.
- [Apple badge guidelines](https://marketing.services.apple/itunes-identity-guidelines): official badge, retained without modification.
- [Telegram](https://t.me/verdiktandydav), [VK](https://vk.com/verdiktandydav), [Instagram](https://www.instagram.com/va.promo/): official group destinations from the supplied press kit. No private feed or automatic social import is claimed.
- [Coord](https://www.youtube.com/@coord1874), [Coord VK](https://vk.ru/coord51): independent stream project. The three individual live-video links come from the supplied press PDF.
- Yandex artist IDs 4894464 and 9171050 were verified against the public Yandex artist search. Full listening opens the service and may depend on region/account.
- [Martin Garrix](https://martingarrix.com/): clear catalogue and platform destinations informed the music-first layout.
- [Charlotte de Witte](https://charlottedewittemusic.com/): clear professional contacts informed the separate press and booking sections.
- [Anyma](https://www.anyma.com/): sculptural visual identity informed the interactive logo section. No third-party artwork or site code copied.

All eight supplied press-kit PDF pages were visually reviewed. Biographical facts and support names derive from that material. Local riders were rendered from the supplied original PSDs after old shared-drive links proved unavailable. Photos are crops of the supplied press material; they are not advertised as high-resolution original photography. The two supplied 1080px logo PNGs are included unchanged for download. The website header uses the white transparent original; favicon and 3D geometry follow its silhouette.

## Verification

`tools/check.js` checks actual local destinations, anchors, downloadable files, unique catalogue IDs, source hostnames, script syntax, and initial audio configuration. Browser checks cover catalogue search, year filtering, expansion, muted remote preview playback, next-track selection without autoplay, responsive layout, original logo, and mobile 3D bounds. Also check gallery, menu and copy actions whenever changing those components.

External services can change availability or require authentication. This website intentionally uses direct official destinations instead of impersonating an authenticated streaming subscription. No dates, ticket offers, endorsements or follower counts have been invented.
