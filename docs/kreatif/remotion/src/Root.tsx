import React from 'react';
import {Composition} from 'remotion';
import {V1Isik} from './V1Isik';
import {V2Karanlik} from './V2Karanlik';
import {V3Avuc} from './V3Avuc';
import {V4Kime} from './V4Kime';
import {V5Fis} from './V5Fis';

const base = {durationInFrames: 270, fps: 30, width: 1080, height: 1920};

export const Root: React.FC = () => (
	<>
		<Composition id="YZ-isik-v1" component={V1Isik} {...base} />
		<Composition id="YZ-karanlik-v1" component={V2Karanlik} {...base} />
		<Composition id="YZ-avuc-v1" component={V3Avuc} {...base} />
		<Composition id="YZ-kime-v1" component={V4Kime} {...base} />
		<Composition id="YZ-fis-v1" component={V5Fis} {...base} />
	</>
);
