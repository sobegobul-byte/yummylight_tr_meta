import React from 'react';
import {Composition} from 'remotion';
import {V1Isik} from './V1Isik';
import {V2Karanlik} from './V2Karanlik';
import {V3Avuc} from './V3Avuc';
import {V4Kime} from './V4Kime';
import {V5Fis} from './V5Fis';
import {V6Kapat} from './V6Kapat';
import {V7Saat} from './V7Saat';
import {V8Ozlem} from './V8Ozlem';
import {V9Onizle} from './V9Onizle';
import {V10Galeri} from './V10Galeri';
import {A1OnceSonra} from './A1OnceSonra';
import {A2Motor} from './A2Motor';
import {A3Plaka} from './A3Plaka';
import {A4Meslek} from './A4Meslek';

const base = {durationInFrames: 270, fps: 30, width: 1080, height: 1920};

export const Root: React.FC = () => (
	<>
		<Composition id="YZ-isik-v1" component={V1Isik} {...base} />
		<Composition id="YZ-karanlik-v1" component={V2Karanlik} {...base} />
		<Composition id="YZ-avuc-v1" component={V3Avuc} {...base} />
		<Composition id="YZ-kime-v1" component={V4Kime} {...base} />
		<Composition id="YZ-fis-v1" component={V5Fis} {...base} />
		<Composition id="YZ-isikkapat-v1" component={V6Kapat} {...base} />
		<Composition id="YZ-gecesaat-v1" component={V7Saat} {...base} />
		<Composition id="YZ-ozlem-v1" component={V8Ozlem} {...base} />
		<Composition id="YZ-onizle-v1" component={V9Onizle} {...base} />
		<Composition id="YZ-galeri-v1" component={V10Galeri} {...base} />
		<Composition id="ARABA-oncesonra-v1" component={A1OnceSonra} {...base} />
		<Composition id="ARABA-motor-v1" component={A2Motor} {...base} />
		<Composition id="ARABA-baba-v1" component={A3Plaka} {...base} />
		<Composition id="ARABA-meslek-v1" component={A4Meslek} {...base} />
	</>
);
