import React from 'react';
import {Composition} from 'remotion';
import {Hero} from './Hero';
import {HeroM} from './HeroM';
export const Root: React.FC = () => (
  <>
  <Composition id="Hero" component={Hero} durationInFrames={360} fps={30} width={1280} height={720} defaultProps={{lang: 'es' as 'es' | 'en'}} />
  <Composition id="HeroM" component={HeroM} durationInFrames={360} fps={30} width={720} height={900} defaultProps={{lang: 'es' as 'es' | 'en'}} />
  </>
);
