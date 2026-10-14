// YH_gokyuzu_v1 · Stil: Takımyıldız. Yıldız noktaları parlayarak belirir, çizgiler tek tek bağlanır; yazı ince serifle altından gelir.
// Hook: anı + merak ("Tanıştığınız gece gökyüzü tam olarak böyleydi.")
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {F} from './fonts';
import {C, Shots, Vignette, fadeIn, fadeOut, s} from './common';

const PTS: [number, number][] = [[90, 210], [230, 120], [380, 170], [520, 90], [660, 150], [800, 70], [930, 160], [700, 260], [460, 250]];
const LINKS: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [4, 7], [7, 8], [8, 2]];

const Constellation: React.FC<{at: number; out: number}> = ({at, out}) => {
	const f = useCurrentFrame();
	const o = Math.min(fadeIn(f, at, 4), fadeOut(f, out, 6));
	return (
		<svg width={1080} height={330} style={{position: 'absolute', top: 90, left: 0, opacity: o}}>
			{LINKS.map(([a, b], i) => {
				const p = interpolate(f, [at + 4 + i * 2.5, at + 9 + i * 2.5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
				const [x1, y1] = PTS[a];
				const [x2, y2] = PTS[b];
				return <line key={i} x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke="rgba(255,244,227,0.75)" strokeWidth={2.5} />;
			})}
			{PTS.map(([x, y], i) => {
				const tw = 0.7 + 0.3 * Math.sin((f + i * 7) / 5);
				const r = interpolate(f, [at + i * 2, at + i * 2 + 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
				return (
					<g key={i}>
						<circle cx={x} cy={y} r={22 * r} fill={C.amber} opacity={0.18 * tw} />
						<circle cx={x} cy={y} r={7 * r} fill={C.cream} opacity={tw} />
					</g>
				);
			})}
		</svg>
	);
};

const Serif: React.FC<{at: number; out: number; top: number; size: number; color?: string; italic?: boolean; children: React.ReactNode}> = ({at, out, top, size, color = C.cream, italic, children}) => {
	const f = useCurrentFrame();
	const ls = interpolate(f, [at, at + 14], [14, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	return (
		<div style={{position: 'absolute', top, left: 60, right: 60, textAlign: 'center', fontFamily: F.bodoni, fontStyle: italic ? 'italic' : 'normal', fontWeight: italic ? 400 : 800, fontSize: size, lineHeight: 1.08, letterSpacing: ls, color, opacity: Math.min(fadeIn(f, at, 10), fadeOut(f, out, 6)), textShadow: '0 4px 24px rgba(0,0,0,0.85)'}}>
			{children}
		</div>
	);
};

export const Y1Gokyuzu: React.FC = () => (
	<AbsoluteFill style={{background: '#000'}}>
		<Shots
			shots={[
				{id: '2734', start: 0.0, dur: 1.5, zoom: [1.2, 1.08], origin: '50% 70%'},
				{id: '2736', start: 0.5, dur: 1.5, zoom: [1.05, 1.12], origin: '50% 75%'},
				{id: '2733', start: 1.0, dur: 2.0, zoom: [1.1, 1.0], origin: '50% 75%'},
				{id: '2746', start: 1.0, dur: 1.6, zoom: [1.0, 1.08], origin: '50% 75%'},
				{id: '2800', start: 7.0, dur: 2.4, zoom: [1.0, 1.06], origin: '50% 70%'},
			]}
		/>
		<Vignette a={0.55} />
		<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,6,18,0.92) 0%, rgba(5,6,18,0.7) 25%, rgba(0,0,0,0) 42%)'}} />
		<Constellation at={0} out={s(2.9)} />
		<Serif at={6} out={s(2.9)} top={400} size={72} italic>
			Tanıştığınız gece
		</Serif>
		<Serif at={s(1.0)} out={s(2.9)} top={485} size={90} color={C.amber}>
			gökyüzü böyleydi.
		</Serif>
		<Sequence from={s(3.0)} durationInFrames={s(3.6)}>
			<Mid />
		</Sequence>
		<Sequence from={s(6.6)}>
			<End />
		</Sequence>
		<Audio src={staticFile('audio/y1.wav')} />
	</AbsoluteFill>
);

const Mid: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<div style={{opacity: fadeOut(f, s(3.4), 6)}}>
			<Serif at={0} out={9999} top={150} size={76}>
				O tarihin, o şehrin
				<br />
				<span style={{color: C.amber}}>gerçek yıldız haritası</span>
			</Serif>
			<Serif at={14} out={9999} top={340} size={52} italic>
				altında ilk şarkınızın kodu
			</Serif>
			<div style={{position: 'absolute', top: 440, width: '100%', textAlign: 'center', opacity: fadeIn(f, 30, 8), fontFamily: F.inter, fontWeight: 600, fontSize: 44, color: C.cream, textShadow: '0 3px 16px rgba(0,0,0,0.85)'}}>
				Hızlı kargo · Peşin fiyatına 3 taksit
			</div>
		</div>
	);
};

const End: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,6,18,0.85) 0%, rgba(0,0,0,0) 55%)', opacity: fadeIn(f, 0, 8)}} />
			<Constellation at={0} out={9999} />
			<Serif at={6} out={9999} top={300} size={82}>
				Tarihini seç,
				<br />
				<span style={{color: C.amber}}>şarkını ekle ↓</span>
			</Serif>
			<div style={{position: 'absolute', top: 500, width: '100%', textAlign: 'center', opacity: fadeIn(f, 20, 8)}}>
				<span style={{fontFamily: F.inter, fontWeight: 800, fontSize: 40, color: C.night, background: C.cream, padding: '14px 32px', borderRadius: 60, whiteSpace: 'nowrap'}}>Ücretsiz kargo · Kapıda ödeme</span>
			</div>
		</>
	);
};
