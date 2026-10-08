---
name: claude-animation-base
description: Make short hand-painted cartoon videos of the character Clawd using p5.js and p5.brush, rendered headlessly to MP4. Use when the user asks for an animated video, a Clawd animation, a storyboarded cartoon, or mentions p5.brush / ClaudeAnimationBase.
---

# Claude Animation Base

Source: https://github.com/JohnHeibel/ClaudeAnimationBase (MIT license, see LICENSE).

Workflow:
1. Read `ANIMATION_GUIDE.md` in this folder fully before drawing anything.
2. Storyboard first, then write the scene in `src/scenes/` (see `src/scenes/demo.js` as example).
3. Run `npm install`, then render with `node render.mjs --clip --out=out/video.mp4`
   (needs Node.js, Chrome/Chromium and ffmpeg; add `--soft-gl` if there is no GPU).
4. Check work with contact sheets: `npm run sheet`.

See `README.md` for flags and file layout.
