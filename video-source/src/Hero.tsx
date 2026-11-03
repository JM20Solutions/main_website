import React, {useEffect, useState} from 'react';
import {AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, delayRender, continueRender} from 'remotion';
import {theme as T} from './theme';

const TXT = {
  es: {clients: 'Clientes que llegan', biz: 'Tu negocio', leaks: ['Llamadas sin contestar', 'Presupuestos sin retomar', 'Citas a las que no vienen'], fixed: ['Llamadas contestadas', 'Presupuestos retomados', 'Citas cumplidas'], lost: 'Dinero que se escapa cada mes', msg: 'Cada fuga tapada es dinero que se queda.', ill: 'Ejemplo ilustrativo', money: (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €'},
  en: {clients: 'Customers arriving', biz: 'Your business', leaks: ['Unanswered calls', 'Quotes nobody follows up', 'No-shows'], fixed: ['Calls answered', 'Quotes followed up', 'Appointments kept'], lost: 'Money slipping away each month', msg: 'Every leak you plug is money that stays.', ill: 'Illustrative example', money: (n: number) => '€' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')},
};
const PIPE = {x0: 100, x1: 1130, y: 345, h: 100};
const LEAK_X = [300, 640, 980];
const OPEN = [30, 55, 80];
const PLUG = [205, 225, 245];
const isOpen = (k: number, t: number) => t >= OPEN[k] && t < PLUG[k];

const Icon: React.FC<{k: number; c: string}> = ({k, c}) => {
  const d = [
    'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2zM15 3l5 5M20 3l-5 5',
    'M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5',
    'M4 5h16v16H4zM4 10h16M8 3v4M16 3v4M10 14l4 4M14 14l-4 4',
  ][k];
  return <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
};

const Coin: React.FC<{x: number; y: number; o: number; grey: number; s?: number}> = ({x, y, o, grey, s = 1}) => (
  <div style={{position: 'absolute', left: x - 19, top: y - 19, width: 38, height: 38, borderRadius: 19, opacity: o, transform: `scale(${s})`,
    background: grey > 0.5 ? '#d1d1d6' : '#f5f5f7', boxShadow: grey > 0.5 ? '0 -22px 26px rgba(41,151,255,.35)' : 'none', color: '#1d1d1f', font: `600 22px ${T.fonts.sans}`, display: 'grid', placeItems: 'center'}}>€</div>
);

export const Hero: React.FC<{lang: 'es' | 'en'}> = ({lang}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = TXT[lang];
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const a = new FontFace('Inter', `url(${staticFile('fonts/inter-400.woff2')})`, {weight: '400'});
    const b = new FontFace('Inter', `url(${staticFile('fonts/inter-600.woff2')})`, {weight: '600'});
    Promise.all([a.load(), b.load()]).then((fs) => { fs.forEach((x) => document.fonts.add(x)); continueRender(h); });
  }, [h]);

  const fadeIn = interpolate(f, [0, 22], [0, 1], {extrapolateRight: 'clamp', easing: T.ease.out});
  const fadeOut = interpolate(f, [338, 358], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: T.ease.in});
  const g = Math.min(fadeIn, fadeOut);
  const breathe = Math.sin(f / fps * 2) * 0.5 + 0.5;

  // coins: 12 per lap, 150 frames to cross the pipe
  const N = 12, LAP = 150, W = PIPE.x1 - PIPE.x0;
  const coins: React.ReactNode[] = [];
  for (let i = 0; i < N; i++) {
    for (let lap = -1; lap < 4; lap++) {
      const s = i * (LAP / N) + lap * LAP + 12;
      const dt = f - s;
      if (dt < 0 || dt > LAP + 60) continue;
      const p = Math.min(dt / LAP, 1);
      let x = PIPE.x0 + p * W, y = PIPE.y, o = interpolate(dt, [0, 8], [0, 1], {extrapolateRight: 'clamp'}), grey = 0, sc = 1;
      for (let k = 0; k < 3; k++) {
        const tc = s + (LAP * (LEAK_X[k] - PIPE.x0)) / W;
        const hit = ((i * 7 + (lap + 1) * 13 + k * 5) % 10) < 6;
        if (f >= tc && isOpen(k, tc) && hit) {
          const d = f - tc;
          x = LEAK_X[k] + Math.sin(d * 0.25) * 4; y = PIPE.y + PIPE.h / 2 + 200 * Math.pow(d / 42, 2);
          o = interpolate(d, [0, 14, 46], [1, 1, 0], {extrapolateRight: 'clamp'}); grey = d > 4 ? 1 : 0; sc = 1 - d / 160;
          break;
        }
        if (f >= tc && !(isOpen(k, tc) && hit)) continue;
      }
      if (dt > LAP) o = interpolate(dt, [LAP, LAP + 10], [1, 0], {extrapolateRight: 'clamp'});
      if (o > 0.01) coins.push(<Coin key={`${i}-${lap}`} x={x} y={y} o={o * g} grey={grey} s={sc} />);
    }
  }

  // counter
  const lostVal = Math.round(1595 * interpolate(f, [40, 205], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: T.ease.out}));
  const counterO = interpolate(f, [30, 52, 214, 250], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * g;
  const msgS = spring({frame: f - 252, fps, config: T.spring.soft});
  const msgO = interpolate(f, [252, 272], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * g;
  const termGlow = interpolate(f, [260, 300], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: T.colors.bg, fontFamily: T.fonts.sans, color: T.colors.ink, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(900px 420px at 50% 46%, rgba(0,102,204,${0.20 + 0.04 * breathe}), transparent 70%), radial-gradient(500px 300px at 88% 46%, rgba(41,151,255,${0.10 + 0.25 * termGlow}), transparent 70%)`}} />
      <div style={{opacity: g}}>
        {/* pipe */}
        <div style={{position: 'absolute', left: PIPE.x0, top: PIPE.y - PIPE.h / 2, width: W, height: PIPE.h, borderRadius: 38, background: `linear-gradient(180deg,#26262a,${T.colors.pipe} 55%,#141416)`, border: `2px solid ${T.colors.edge}`}} />
        <div style={{position: 'absolute', left: PIPE.x0 + 30, top: PIPE.y - 14, width: W - 60, height: 28, borderRadius: 14, background: '#0b0b0d'}} />
        {/* labels at ends */}
        <div style={{position: 'absolute', left: 40, top: PIPE.y + 70, width: 300, font: `400 24px ${T.fonts.sans}`, color: T.colors.dim}}>{t.clients}</div>
        <div style={{position: 'absolute', left: 1130, top: PIPE.y - 62, width: 124, height: 124, borderRadius: 30, background: '#111114', border: `2px solid ${termGlow > 0.3 ? T.colors.sky : T.colors.edge}`, display: 'grid', placeItems: 'center', transform: `scale(${1 + 0.02 * breathe + 0.05 * termGlow})`}}>
          <div style={{font: `600 56px ${T.fonts.sans}`, color: termGlow > 0.3 ? T.colors.sky : T.colors.ink}}>€</div></div>
        <div style={{position: 'absolute', left: 1102, top: PIPE.y + 76, width: 180, textAlign: 'center', font: `600 22px ${T.fonts.sans}`}}>{t.biz}</div>
        {coins}
        {/* holes, callouts, plugs */}
        {LEAK_X.map((x, k) => {
          const open = f >= OPEN[k];
          const pop = spring({frame: f - OPEN[k], fps, config: T.spring.pop});
          const plugged = f >= PLUG[k];
          const plug = spring({frame: f - PLUG[k], fps, config: T.spring.pop});
          const lineS = interpolate(f, [OPEN[k] + 4, OPEN[k] + 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: T.ease.out});
          const swap = interpolate(f, [PLUG[k] + 6, PLUG[k] + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const blue = interpolate(f, [PLUG[k], PLUG[k] + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <React.Fragment key={k}>
              {open && <div style={{position: 'absolute', left: x - 70, top: PIPE.y - 196, width: 140 + 0, height: 0}} />}
              <div style={{position: 'absolute', left: x, top: PIPE.y - PIPE.h / 2 - 50, width: 3, height: 50 * lineS, marginLeft: -1, background: blue > 0.5 ? T.colors.sky : T.colors.mute, transformOrigin: 'bottom'}} />
              <div style={{position: 'absolute', left: x - 158, top: PIPE.y - 214, width: 316, height: 72, borderRadius: 36, display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', boxSizing: 'border-box',
                background: blue > 0.5 ? T.colors.blue : '#1c1c1e', border: `1.5px solid ${blue > 0.5 ? T.colors.sky : T.colors.edge}`, opacity: Math.min(pop, 1) * 1, transform: `translateY(${(1 - Math.min(pop, 1)) * 18}px) scale(${0.9 + 0.1 * Math.min(pop, 1)})`,
                font: `600 20px ${T.fonts.sans}`, color: T.colors.ink, whiteSpace: 'nowrap'}}><Icon k={k} c={blue > 0.5 ? '#fff' : T.colors.sky} /><span style={{position: 'relative', display: 'inline-block'}}><span style={{opacity: 1 - swap}}>{t.leaks[k]}</span><span style={{position: 'absolute', left: 0, top: 0, opacity: swap}}>{t.fixed[k]}</span></span></div>
              {open && !plugged && <div style={{position: 'absolute', left: x - 24, top: PIPE.y + PIPE.h / 2 - 10, width: 48, height: 20, borderRadius: 10, background: T.colors.bg, border: `2px solid ${T.colors.mute}`}} />}
              {plugged && <div style={{position: 'absolute', left: x - 38, top: PIPE.y + PIPE.h / 2 - 14 - (1 - Math.min(plug, 1)) * 70, width: 76, height: 28, borderRadius: 14, background: T.colors.sky, opacity: Math.min(plug * 2, 1)}} />}
            </React.Fragment>
          );
        })}
        {/* counter, then message */}
        <div style={{position: 'absolute', left: 0, width: 1280, top: 520, textAlign: 'center', opacity: counterO}}>
          <div style={{font: `400 26px ${T.fonts.sans}`, color: T.colors.dim, marginBottom: 4}}>{t.lost}</div>
          <div style={{font: `600 104px/1.05 ${T.fonts.sans}`, letterSpacing: -2, fontVariantNumeric: 'tabular-nums'}}>{t.money(lostVal)}</div>
        </div>
        <div style={{position: 'absolute', left: 0, width: 1280, top: 560, textAlign: 'center', opacity: msgO, transform: `translateY(${(1 - msgS) * 24}px)`, font: `600 54px/1.15 ${T.fonts.sans}`, letterSpacing: -1}}>{t.msg}</div>
        <div style={{position: 'absolute', right: 28, bottom: 20, font: `400 15px ${T.fonts.sans}`, color: T.colors.mute}}>{t.ill}</div>
      </div>
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, opacity: 0.07, mixBlendMode: 'overlay'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};
