import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';
import D from './data/shots.json';
import {W, H} from './lib';
export const Root: React.FC = () => (
  <Composition id="Main" component={Main} durationInFrames={Math.round((D as any).total * 24)} fps={24} width={W} height={H} />
);
