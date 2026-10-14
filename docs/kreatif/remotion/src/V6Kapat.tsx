// YZ_isikkapat_v1 · Stil: Ampul gibi yanan yazı. Harfler önce sönük, sonra titreyip sıcak ışıkla yanar.
// Hook: komut + desen kırma ("Işığı kapat."). Oda kararır, lamba yanar.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {F} from './fonts';
import {C, END_L1, END_L2, END_PILL, MID_L1, MID_L2, MID_TAG, NIGHT, Shots, Vignette, fadeIn, fadeOut, s} from './common';

const fr = F.fraunces;

// Titreyerek yanan yazı: 0 → kısa titreşim → tam parlak
const flick = (f: number, at: number) => {
	const t = f - at;
	if (t < 0) return 0.08;
	const seq = [0.08, 0.7, 0.15, 0.9, 0.35, 1];
	return t < seq.length ? seq[t] : 1;
};

const Glow: React.FC<{at: number; out?: number; size: number; italic?: boolean; color?: string; top: number; children: React.ReactNode; weight?: number}> = ({at, out = 9999, size, italic, color = C.cream, top, children, weight = 700}) => {
	const f = useCurrentFrame();
	const o = flick(f, at) * fadeOut(f, out, 8);
	const glow = o > 0.5 ? `0 0 18px ${C.amber}cc, 0 0 60px ${C.amber}77` : 'none';
	return (
		<div style={{position: 'absolute', top, width: '100%', textAlign: 'center', fontFamily: fr, fontStyle: italic ? 'italic' : 'normal', fontWeight: italic ? 300 : weight, fontSize: size, lineHeight: 1.05, color, opacity: Math.max(o, 0), textShadow: `${glow}, 0 4px 20px rgba(0,0,0,0.8)`}}>
			{children}
		</div>
	);
};

export const V6Kapat: React.FC = () => {
	const f = useCurrentFrame();
	// İlk 1 sn oda karanlık; "kapat" denince lamba öne çıkar
	const dark = interpolate(f, [0, 10, 26], [0.7, 0.7, 0], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Shots
				shots={[
					{id: '4182', start: 0.0, dur: 2.6, zoom: [1.12, 1.02], grade: NIGHT},
					{id: '4214', start: 6.4, dur: 2.4, zoom: [1.0, 1.06], grade: NIGHT},
					{id: '4204', start: 0.3, dur: 1.6, zoom: [1.06, 1.0]},
					{id: '4202', start: 1.0, dur: 2.4, zoom: [1.0, 1.05]},
				]}
			/>
			<AbsoluteFill style={{background: '#000', opacity: dark}} />
			<Vignette a={0.75} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 45%)'}} />
			{/* Hook */}
			<Glow at={2} out={s(2.45)} size={140} top={210}>Işığı kapat.</Glow>
			<Glow at={s(1.0)} out={s(2.45)} size={72} italic top={400}>
				Şimdi en sevdiğin anı
				<br />
				<span style={{color: C.amber, fontStyle: 'normal', fontWeight: 700}}>karanlıkta yanıyor.</span>
			</Glow>
			{/* Teklif: önizleme */}
			<Sequence from={s(2.7)} durationInFrames={s(3.8)}>
				<Mid />
			</Sequence>
			<Sequence from={s(6.6)}>
				<End />
			</Sequence>
			<Audio src={staticFile('audio/v6.wav')} />
		</AbsoluteFill>
	);
};

const Mid: React.FC = () => {
	const f = useCurrentFrame();
	const out = fadeOut(f, s(3.6), 6);
	return (
		<div style={{opacity: out}}>
			<div style={{position: 'absolute', top: 190, width: '100%', textAlign: 'center', opacity: fadeIn(f, 0, 6)}}>
				<span style={{fontFamily: F.inter, fontWeight: 600, fontSize: 40, letterSpacing: 6, color: C.night, background: C.amber, padding: '10px 26px', borderRadius: 40}}>{MID_TAG.toLocaleUpperCase('tr')}</span>
			</div>
			<Glow at={4} size={118} top={300}>{MID_L1}</Glow>
			<Glow at={s(1.1)} size={92} italic color={C.amber} top={440}>{MID_L2}</Glow>
		</div>
	);
};

const End: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 55%)', opacity: fadeIn(f, 0, 8)}} />
			<Glow at={2} size={96} top={170}>{END_L1}</Glow>
			<Glow at={10} size={104} italic color={C.amber} top={290}>{END_L2}</Glow>
			<div style={{position: 'absolute', top: 470, width: '100%', textAlign: 'center', opacity: fadeIn(f, 20, 8)}}>
				<span style={{fontFamily: F.inter, fontWeight: 800, fontSize: 40, color: C.cream, border: `3px solid ${C.amber}`, padding: '14px 30px', borderRadius: 60, whiteSpace: 'nowrap'}}>{END_PILL}</span>
			</div>
		</>
	);
};
