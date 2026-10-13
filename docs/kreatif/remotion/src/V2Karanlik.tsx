// YZ_karanlik_v1 · Stil: Siyah zemin, dev ince serif, kelimeler tek tek ve geniş harf aralığıyla açılır.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {F} from './fonts';
import {C, Shots, fadeIn, fadeOut, s} from './common';

const bodoni = F.bodoni;
const bodoniI = F.bodoni;

const Line: React.FC<{text: string; at: number; out: number; size: number; italic?: boolean; weight?: number; color?: string; top: number}> = ({text, at, out, size, italic, weight = 400, color = C.cream, top}) => {
	const f = useCurrentFrame();
	const o = Math.min(fadeIn(f, at, 12), fadeOut(f, out, 8));
	const ls = interpolate(f, [at, at + 24], [18, 2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const blur = interpolate(f, [at, at + 12], [10, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<div style={{position: 'absolute', top, width: '100%', textAlign: 'center', opacity: o, filter: `blur(${blur}px)`, fontFamily: italic ? bodoniI : bodoni, fontStyle: italic ? 'italic' : 'normal', fontWeight: weight, fontSize: size, color, letterSpacing: ls, lineHeight: 1, textShadow: '0 0 40px rgba(0,0,0,0.9)'}}>
			{text}
		</div>
	);
};

export const V2Karanlik: React.FC = () => {
	const f = useCurrentFrame();
	// İlk 6 karede tam siyah, sonra lamba karanlıktan belirir
	const black = interpolate(f, [0, 2, 12], [0.6, 0.6, 0], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Shots
				shots={[
					{id: '4204', start: 0.0, dur: 2.0, zoom: [1.1, 1.02], dim: 0.15},
					{id: '4154', start: 0.0, dur: 2.0, zoom: [1.0, 1.06], dim: 0.45},
					{id: '4202', start: 2.0, dur: 2.5, zoom: [1.06, 1.0], dim: 0.15},
					{id: '4203', start: 0.0, dur: 2.5, zoom: [1.0, 1.05], dim: 0.1},
				]}
			/>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 62%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.75) 85%)'}} />
			<AbsoluteFill style={{background: '#000', opacity: black}} />
			<Line text="Işıklar" at={0} out={s(1.9)} size={150} top={190} />
			<Line text="sönünce…" at={10} out={s(1.9)} size={118} italic top={355} />
			<Line text="en sevdiğin" at={s(2.1)} out={s(3.9)} size={110} italic top={190} />
			<Line text="ANI" at={s(2.35)} out={s(3.9)} size={200} weight={800} color={C.amber} top={310} />
			<Line text="başucunda" at={s(4.1)} out={s(5.25)} size={120} italic top={190} />
			<Line text="yanar." at={s(4.35)} out={s(5.25)} size={160} weight={800} color={C.amber} top={330} />
			<Sequence from={s(5.45)} durationInFrames={s(1.1)}>
				<Small />
			</Sequence>
			<Sequence from={s(6.5)}>
				<End />
			</Sequence>
			<Audio src={staticFile('audio/v2.wav')} />
		</AbsoluteFill>
	);
};

const Small: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<div style={{position: 'absolute', top: 230, width: '100%', textAlign: 'center', opacity: Math.min(fadeIn(f, 0, 5), fadeOut(f, 28, 5)), fontFamily: bodoniI, fontStyle: 'italic', fontSize: 76, color: C.cream, lineHeight: 1.25}}>
			Hızlı kargo
			<br />
			Peşin fiyatına 3 taksit
		</div>
	);
};

const End: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 62%)', opacity: fadeIn(f, 0, 10)}} />
			<Line text="Fotoğrafını" at={2} out={999} size={104} italic top={180} />
			<Line text="YÜKLE ↓" at={10} out={999} size={150} weight={800} color={C.amber} top={300} />
			<div style={{position: 'absolute', top: 490, width: '100%', textAlign: 'center', opacity: fadeIn(f, 22, 10), fontFamily: bodoni, fontWeight: 800, fontSize: 50, color: C.cream, letterSpacing: 2}}>
				ÜCRETSİZ KARGO · KAPIDA ÖDEME
			</div>
		</>
	);
};
