// ARABA_baba_v1 · Stil: Türk plakası. Yazılar beyaz plaka kutusunun içinde, solda mavi TR şeridi; plaka "damga" gibi iner.
// Hook: nostalji + kişi ("Babanın ilk arabası…"). Hikâye 3 sn'yi geçmez, sonra ürün ve teklif.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {F} from './fonts';
import {C, Shots, Vignette, fadeIn, fadeOut, s} from './common';

const inter = F.inter;
const black = F.black;

const Plate: React.FC<{text: string; at: number; size?: number; w?: number}> = ({text, at, size = 96, w = 900}) => {
	const f = useCurrentFrame();
	const sc = interpolate(f, [at, at + 6], [1.6, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.6))});
	if (f < at) return null;
	return (
		<div style={{width: w, margin: '0 auto', transform: `scale(${sc}) rotate(-2deg)`, display: 'flex', background: '#F7F7F2', border: '6px solid #111', borderRadius: 18, overflow: 'hidden', boxShadow: '0 18px 50px rgba(0,0,0,0.55)', opacity: fadeIn(f, at, 3)}}>
			<div style={{width: 84, background: '#1F4FB4', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 12, fontFamily: inter, fontWeight: 800, fontSize: 40, color: '#fff'}}>TR</div>
			<div style={{flex: 1, textAlign: 'center', fontFamily: black, fontSize: size, color: '#111', letterSpacing: 6, padding: '14px 10px 10px', whiteSpace: 'nowrap'}}>{text}</div>
		</div>
	);
};

const Line: React.FC<{at: number; out: number; top: number; children: React.ReactNode; size?: number; color?: string}> = ({at, out, top, children, size = 76, color = C.cream}) => {
	const f = useCurrentFrame();
	return (
		<div style={{position: 'absolute', top, width: '100%', textAlign: 'center', fontFamily: inter, fontWeight: 800, fontSize: size, lineHeight: 1.12, color, opacity: Math.min(fadeIn(f, at, 6), fadeOut(f, out, 6)), textShadow: '0 4px 22px rgba(0,0,0,0.85)'}}>
			{children}
		</div>
	);
};

export const A3Plaka: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Shots
				shots={[
					{id: '0463', start: 0.3, dur: 2.4, zoom: [1.2, 1.08], origin: '50% 75%'},
					{id: '0519', start: 1.0, dur: 1.8, zoom: [1.05, 1.12], origin: '50% 70%'},
					{id: '0666', start: 3.0, dur: 2.0, zoom: [1.0, 1.08], origin: '50% 65%'},
					{id: '0470', start: 1.0, dur: 2.8, zoom: [1.06, 1.0], origin: '50% 70%'},
				]}
			/>
			<Vignette a={0.5} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 50%)'}} />
			{/* Hook */}
			<Line at={0} out={s(2.6)} top={150}>Babanın ilk arabası…</Line>
			<div style={{position: 'absolute', top: 290, width: '100%', opacity: fadeOut(f, s(2.6), 6)}}>
				<Plate text="34 BABA 1985" at={8} />
			</div>
			<Line at={s(1.5)} out={s(2.6)} top={470} size={64} color={C.amber}>
				hâlâ aklında mı?
			</Line>
			<Sequence from={s(2.75)} durationInFrames={s(3.85)}>
				<Mid />
			</Sequence>
			<Sequence from={s(6.6)}>
				<End />
			</Sequence>
			<Audio src={staticFile('audio/a3.wav')} />
		</AbsoluteFill>
	);
};

const Mid: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<div style={{opacity: fadeOut(f, s(3.65), 6)}}>
			<Line at={0} out={9999} top={150} size={70}>
				Fotoğrafından çizilir,
				<br />
				<span style={{color: C.amber}}>plakasıyla birlikte</span>
				<br />
				her gece yanar.
			</Line>
			<div style={{position: 'absolute', top: 470, width: '100%', textAlign: 'center', opacity: fadeIn(f, 22, 8), fontFamily: inter, fontWeight: 600, fontSize: 46, color: C.cream, textShadow: '0 3px 16px rgba(0,0,0,0.85)'}}>
				Hızlı kargo · Peşin fiyatına 3 taksit
			</div>
		</div>
	);
};

const End: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 55%)', opacity: fadeIn(f, 0, 8)}} />
			<Line at={2} out={9999} top={150} size={84}>
				Babana hediye et
			</Line>
			<div style={{position: 'absolute', top: 270, width: '100%'}}>
				<Plate text="FOTOĞRAF YÜKLE ↓" at={8} size={66} w={960} />
			</div>
			<Line at={20} out={9999} top={440} size={44}>
				Ücretsiz kargo · Kapıda ödeme
			</Line>
		</>
	);
};
