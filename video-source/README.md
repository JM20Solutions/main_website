# Hero video (Remotion)

Not deployed (listed in `.assetsignore`). To change the video:

```
npm install
npx remotion render src/index.ts Hero ../assets/video/hero-es.mp4 --codec h264 --crf 24 --props='{"lang":"es"}'
npx remotion render src/index.ts Hero ../assets/video/hero-en.mp4 --codec h264 --crf 24 --props='{"lang":"en"}'
npx remotion still src/index.ts Hero ../assets/img/hero-es.jpg --frame 190 --image-format=jpeg --props='{"lang":"es"}'
npx remotion still src/index.ts Hero ../assets/img/hero-en.jpg --frame 190 --image-format=jpeg --props='{"lang":"en"}'
```

Phone (portrait 720x900) version, same texts and timing:
```
npx remotion render src/index.ts HeroM ../assets/video/hero-es-m.mp4 --codec h264 --crf 24 --props='{"lang":"es"}'
npx remotion render src/index.ts HeroM ../assets/video/hero-en-m.mp4 --codec h264 --crf 24 --props='{"lang":"en"}'
npx remotion still src/index.ts HeroM ../assets/img/hero-es-m.jpg --frame 190 --image-format=jpeg --props='{"lang":"es"}'
npx remotion still src/index.ts HeroM ../assets/img/hero-en-m.jpg --frame 190 --image-format=jpeg --props='{"lang":"en"}'
```

- Texts and labels (desktop): `src/Hero.tsx` (`TXT`); phone: `src/HeroM.tsx` (`TXT`). `src/Hero.tsx` (`TXT`).
- Timing of each leak opening and being plugged: `OPEN` and `PLUG` at the top of `src/Hero.tsx`.
- Colors and easing: `src/theme.ts`.
