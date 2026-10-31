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
import {Y1Gokyuzu} from './Y1Gokyuzu';
import {Y2Sarki} from './Y2Sarki';
import {Y3Tarih} from './Y3Tarih';
import {Y4Anket} from './Y4Anket';
import {Y5Not} from './Y5Not';
import {Y6Ani} from './Y6Ani';
import {Y7AniV2} from './Y7AniV2';
import {Y8AniV3} from './Y8AniV3';
import {Y9Hook, Y9Props} from './Y9Hook';
import {SuleymanHurrem, SH_DUR} from './SuleymanHurrem';
import {AtolyeGunluk} from './AtolyeGunluk';

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
		<Composition id="YH-gokyuzu-v1" component={Y1Gokyuzu} {...base} />
		<Composition id="YH-sarki-v1" component={Y2Sarki} {...base} />
		<Composition id="YH-tarih-v1" component={Y3Tarih} {...base} />
		<Composition id="YH-anket-v1" component={Y4Anket} {...base} />
		<Composition id="YH-not-v1" component={Y5Not} {...base} />
		<Composition id="YH-ani-v1" component={Y6Ani} {...base} durationInFrames={300} />
		<Composition id="YH-ani-v2" component={Y7AniV2} {...base} durationInFrames={300} />
		<Composition id="YH-ani-v3" component={Y8AniV3} {...base} durationInFrames={300} />
		<Composition id="YH-hook-a" component={Y9Hook} {...base} durationInFrames={300} defaultProps={{video: 'ai/YH_hook_1.mp4', music: 'audio/lofi1.wav', hook: [['Tanıştığınız', 'gece'], ['gökyüzü', 'nasıldı?']]} as Y9Props} />
		<Composition id="YH-hook-d" component={Y9Hook} {...base} durationInFrames={300} defaultProps={{video: 'ai/YH_hook_2.mp4', music: 'audio/lofi2.wav', reveal: true, hook: [['Bu', 'gece', 'gökyüzü'], ['bir', 'daha', 'asla'], ['aynı', 'olmayacak…']], hook2: [['…ama', 'sizinki'], ['burada', 'kaldı.']]} as Y9Props} />
		<Composition id="YH-hook-b" component={Y9Hook} {...base} durationInFrames={300} defaultProps={{video: 'ai/YH_hook_3.mp4', music: 'audio/lofi3.wav', blurBand: [[2, 0], [3, 540], [10, 540]], hook: [['Tanıştığınız', 'geceyi'], ['siz', 'unutsanız', 'da'], ['yıldızlar', 'unutmadı.']]} as Y9Props} />
		<Composition id="YH-hook-c" component={Y9Hook} {...base} durationInFrames={300} defaultProps={{video: 'ai/YH_hook_4.mp4', music: 'audio/lofi4.wav', blurBand: [[3.5, 0], [4.5, 540], [5.5, 520], [7, 400], [8, 320], [10, 320]], hook: [['Sevgilin', 'bunu', 'açınca'], ['3', 'saniye'], ['konuşamayacak.']]} as Y9Props} />
		<Composition id="SULEYMAN-hurrem-v1" component={SuleymanHurrem} {...base} durationInFrames={Math.round(SH_DUR * 30)} />
		<Composition id="ATOLYE-gunluk-26ekim" component={AtolyeGunluk} {...base} durationInFrames={300} />
	</>
);
