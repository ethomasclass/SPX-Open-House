# St. Pius X Social Studies · Open House

A kiosk app for open house Chromebooks. Visitors pick **one** experience (about 5 minutes each), and each one ends with a short scavenger hunt.

| Experience | Course | What happens |
|---|---|---|
| **A Day in the Lowell Mills** (`lowell/`) | U.S. History | Watch Lowell grow, pick a mill worker, ring the boarding house bells, find the dangers on a loom, and make 3 choices (payday, a third loom, the ten-hour petition) that change her savings, health and future. |
| **Housing Around the World: Japan** (`japan/`) | AP Human Geography | Watch a gassho-zukuri farmhouse get built (narrated, about 3 min), then explore it in 3D. Scavenger-hunt questions unlock as visitors find the right spots. |

`worksheet.html` is a one-page printable version of both scavenger hunts (the answer key shows on screen but does not print).

## Open house setup

1. **Host it:** in the GitHub repo go to *Settings → Pages* and publish from this branch, root folder. The menu is the site's home page.
2. **On each Chromebook:** open the site in Chrome, then press the full-screen key (the one with a box above the number 4, or `F4`) to hide the tabs and address bar. For a locked-down setup, your Google Admin can add the URL as a kiosk app.
3. **Sound:** the Lowell bells and loom noise and the Japan narration are generated in the browser. Headphones help in a noisy room. Visitors can turn narration off on the Japan start screen.
4. **Do one test run on a real school Chromebook** before the event, since both experiences use 3D graphics.

## Kiosk behavior

- **Home** button (top left) on every screen goes back to the menu.
- After **2 minutes with no input**, a "Still exploring?" countdown appears. After 20 more seconds, it returns to the menu for the next family. (Watching the Japan narrated build counts as activity.)
- Nothing is saved between visitors. Reloading always starts fresh.
- Keyboard shortcuts: `1` / `2` on the menu, `A` / `B` / `C` for Lowell choices.

## How it is built

- Everything is static HTML/JS with no build step, and it works offline once loaded. Three.js and the fonts are in `assets/` instead of loading from the internet.
- `lowell/` is a new short guided version that reuses the 3D scene (`lowell-scene.js`) from the [lowellmill](https://github.com/ethomasclass/lowellmill) classroom game. Its only change is loading Three.js from `assets/vendor/`.
- `japan/index.html` is a copy of the [housingstylestour](https://github.com/ethomasclass/housingstylestour) tour, unchanged except for 3 lines at the end that load `japan/open-house.js`. That file adds the start screen, hides Levittown and VR, and runs the scavenger hunt.
- Shared look and kiosk features are in `assets/brand.css` and `assets/kiosk.js`.
