import React, {useEffect, useState} from 'react';
import {AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, delayRender, continueRender} from 'remotion';
import {theme as T} from './theme';

const TXT = {
  es: {clients: ['Clientes','que llegan'], biz: 'Tu negocio', leaks: [['Llamadas', 'sin contestar'], ['Presupuestos', 'sin retomar'], ['Citas a las que', 'no vienen']], fixed: [['Llamadas', 'contestadas'], ['Presupuestos', 'retomados'], ['Citas', 'cumplidas']], lost: 'Dinero que se escapa cada mes', msg: 'Cada fuga tapada es dinero que se queda.', ill: 'Ejemplo ilustrativo', money: (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €'},
  en: {clients: ['Customers','arriving'], biz: 'Your business', leaks: [['Unanswered', 'calls'], ['Quotes nobody', 'follows up'], ['No-shows', '']], fixed: [['Calls', 'answered'], ['Quotes', 'followed up'], ['Appointments', 'kept']], lost: 'Money slipping away each month', msg: 'Every leak you plug is money that stays.', ill: 'Illustrative example', money: (n: number) => '€' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')},
};
const CX = 150, PW = 100, Y0 = 130, Y1 = 700, H = Y1 - Y0;
const LEAK_Y = [255, 445, 635];
const OPEN = [30, 55, 80];
const PLUG = [205, 225, 245];
const isOpen = (k: number, t: number) => t >= OPEN[k] && t < PLUG[k];
const ICON = ['M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2zM15 3l5 5M20 3l-5 5', 'M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5', 'M4 5h16v16H4zM4 10h16M8 3v4M16 3v4M10 14l4 4M14 14l-4 4'];

export const HeroM: React.FC<{lang: 'es' | 'en'}> = ({lang}) => {
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
  const N = 8, LAP = 150;
  const coins: React.ReactNode[] = [];
  for (let i = 0; i < N; i++) {
    for (let lap = -1; lap < 4; lap++) {
      const s = i * (LAP / N) + lap * LAP + 12;
      const dt = f - s;
      if (dt < 0 || dt > LAP + 60) continue;
      const p = Math.min(dt / LAP, 1);
      let x = CX, y = Y0 + p * H, o = interpolate(dt, [0, 8], [0, 1], {extrapolateRight: 'clamp'}), grey = 0, sc = 1;
      for (let k = 0; k < 3; k++) {
        const tc = s + (LAP * (LEAK_Y[k] - Y0)) / H;
        const hit = ((i * 7 + (lap + 1) * 13 + k * 5) % 10) < 6;
        if (f >= tc && isOpen(k, tc) && hit) {
          const d = f - tc;
          x = 222 + Math.sin(d * 0.25) * 4; y = LEAK_Y[k] + 18 + 230 * Math.pow(d / 44, 2);
          o = interpolate(d, [0, 14, 48], [1, 1, 0], {extrapolateRight: 'clamp'}); grey = d > 4 ? 1 : 0; sc = 1 - d / 170;
          break;
        }
      }
      if (dt > LAP) o = interpolate(dt, [LAP, LAP + 10], [1, 0], {extrapolateRight: 'clamp'});
      if (o > 0.01) coins.push(
        <div key={`${i}-${lap}`} style={{position: 'absolute', left: x - 23, top: y - 23, width: 46, height: 46, borderRadius: 23, opacity: o * g, transform: `scale(${sc})`, background: grey ? '#d1d1d6' : '#f5f5f7', color: '#1d1d1f', font: `600 28px ${T.fonts.sans}`, display: 'grid', placeItems: 'center', boxShadow: grey ? '0 -24px 28px rgba(41,151,255,.35)' : 'none'}}>€</div>);
    }
  }
  const lostVal = Math.round(1595 * interpolate(f, [40, 205], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: T.ease.out}));
  const counterO = interpolate(f, [30, 52, 214, 250], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * g;
  const msgS = spring({frame: f - 252, fps, config: T.spring.soft});
  const msgO = interpolate(f, [252, 272], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * g;
  const termGlow = interpolate(f, [260, 300], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lineStyle = (k: number, blue: number): React.CSSProperties => ({position: 'absolute', left: 206, top: LEAK_Y[k] - 2, height: 4, width: 86 * interpolate(f, [OPEN[k] + 4, OPEN[k] + 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: T.ease.out}), background: blue > 0.5 ? T.colors.sky : T.colors.mute});
  return (
    <AbsoluteFill style={{background: T.colors.bg, fontFamily: T.fonts.sans, color: T.colors.ink, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(520px 520px at 20% 52%, rgba(0,102,204,${0.22 + 0.05 * breathe}), transparent 70%), radial-gradient(420px 320px at 25% 90%, rgba(41,151,255,${0.08 + 0.3 * termGlow}), transparent 70%)`}} />
      <div style={{opacity: g}}>
        <div style={{position: 'absolute', left: CX - PW / 2, top: Y0 - 10, width: PW, height: H + 30, borderRadius: 50, background: `linear-gradient(90deg,#26262a,${T.colors.pipe} 55%,#141416)`, border: `2px solid ${T.colors.edge}`}} />
        <div style={{position: 'absolute', left: CX - 17, top: Y0 + 20, width: 34, height: H - 20, borderRadius: 17, background: '#0b0b0d'}} />
        <div style={{position: 'absolute', left: 40, top: 26, font: `400 30px/1.15 ${T.fonts.sans}`, color: T.colors.dim}}><div>{t.clients[0]}</div><div>{t.clients[1]}</div></div>
        <div style={{position: 'absolute', left: 60, top: 690, width: 180, height: 160, borderRadius: 40, background: '#111114', border: `3px solid ${termGlow > 0.3 ? T.colors.sky : T.colors.edge}`, display: 'grid', placeItems: 'center', transform: `scale(${1 + 0.02 * breathe + 0.05 * termGlow})`}}>
          <div style={{font: `600 88px ${T.fonts.sans}`, color: termGlow > 0.3 ? T.colors.sky : T.colors.ink}}>€</div></div>
        <div style={{position: 'absolute', left: 270, top: 748, font: `600 36px ${T.fonts.sans}`}}>{t.biz}</div>
        {coins}
        {LEAK_Y.map((y, k) => {
          const pop = Math.min(spring({frame: f - OPEN[k], fps, config: T.spring.pop}), 1);
          const plug = Math.min(spring({frame: f - PLUG[k], fps, config: T.spring.pop}), 1);
          const open = f >= OPEN[k], plugged = f >= PLUG[k];
          const blue = interpolate(f, [PLUG[k], PLUG[k] + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const swap = interpolate(f, [PLUG[k] + 6, PLUG[k] + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const two = (a: string[], o: number) => <div style={{position: 'absolute', left: 92, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: o, font: `600 32px/1.15 ${T.fonts.sans}`}}><span>{a[0]}</span><span>{a[1]}</span></div>;
          return (
            <React.Fragment key={k}>
              <div style={lineStyle(k, blue)} />
              <div style={{position: 'absolute', left: 292, top: y - 56, width: 410, height: 112, borderRadius: 56, background: blue > 0.5 ? T.colors.blue : '#1c1c1e', border: `2px solid ${blue > 0.5 ? T.colors.sky : T.colors.edge}`, opacity: pop, transform: `translateX(${(1 - pop) * 30}px)`}}>
                <svg style={{position: 'absolute', left: 28, top: 36}} width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={blue > 0.5 ? '#fff' : T.colors.sky} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d={ICON[k]} /></svg>
                {two(t.leaks[k], 1 - swap)}{two(t.fixed[k], swap)}
              </div>
              {open && !plugged && <div style={{position: 'absolute', left: 186, top: y - 28, width: 26, height: 56, borderRadius: 13, background: T.colors.bg, border: `3px solid ${T.colors.mute}`}} />}
              {plugged && <div style={{position: 'absolute', left: 186 + (1 - plug) * 60, top: y - 38, width: 32, height: 76, borderRadius: 16, background: T.colors.sky, opacity: Math.min(plug * 2, 1)}} />}
            </React.Fragment>
          );
        })}
        <div style={{position: 'absolute', left: 292, width: 410, top: 40, opacity: counterO}}>
          <div style={{font: `400 28px/1.2 ${T.fonts.sans}`, color: T.colors.dim, marginBottom: 6}}>{t.lost}</div>
          <div style={{font: `600 84px/1.05 ${T.fonts.sans}`, letterSpacing: -2, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>{t.money(lostVal)}</div>
        </div>
        <div style={{position: 'absolute', left: 292, width: 410, top: 44, opacity: msgO, transform: `translateY(${(1 - msgS) * 24}px)`, font: `600 46px/1.12 ${T.fonts.sans}`, letterSpacing: -1}}>{t.msg}</div>
        <div style={{position: 'absolute', right: 24, bottom: 20, font: `400 22px ${T.fonts.sans}`, color: T.colors.mute}}>{t.ill}</div>
      </div>
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, opacity: 0.07, mixBlendMode: 'overlay'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};
