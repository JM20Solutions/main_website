import {Easing} from 'remotion';
export const theme = {
  colors: {bg: '#050507', ink: '#f5f5f7', dim: '#a1a1a6', mute: '#636366', blue: '#0066cc', sky: '#2997ff', pipe: '#1b1b1e', edge: '#3a3a3c'},
  fonts: {sans: 'Inter, system-ui, sans-serif'},
  ease: {out: Easing.bezier(0.16, 1, 0.3, 1), inOut: Easing.bezier(0.65, 0, 0.35, 1), in: Easing.bezier(0.5, 0, 0.9, 0.4)},
  spring: {soft: {damping: 200}, pop: {damping: 11, stiffness: 190, mass: 0.6}},
};
