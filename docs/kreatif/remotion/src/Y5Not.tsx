// YH_not_v1 · Stil: Daktilo notu. Krem kâğıt şerit, harfler daktilo gibi basılır; el yazısı yerine mono daktilo + Fraunces italik.
// Hook: söylenemeyen söz ("Ona hiç söyleyemediğin o cümle…") → lambada yazan mesaj.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {F} from './fonts';
import {C, Shots, Vignette, fadeIn, fadeOut, s} from './common';

const Paper: React.FC<{at: number; lines: string[]; cps?: number; top?: number; size?: number}> = ({at, lines, cps = 1.1, top = 140, size = 50}) => {
	const f = useCurrentFrame();
	const y = interpolate(f, [at, at + 10], [-60, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	let budget = Math.max(0, Math.floor((f - at - 6) * cps));
	return (
		<div style={{position: 'absolute', top, left: 80, right: 80, transform: `translateY(${y}px) rotate(-1.5deg)`, opacity: fadeIn(f, at, 5), background: '#F6EEDD', borderRadius: 6, padding: '34px 40px', boxShadow: '0 16px 40px rgba(0,0,0,0.5)', backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 66px, rgba(120,90,50,0.12) 66px 68px)'}}>
			{lines.map((l, i) => {
				const n = Math.min(l.length, budget);
				budget -= n;
				return (
					<div key={i} style={{fontFamily: F.mono, fontSize: size, lineHeight: '68px', color: '#2A2118', minHeight: 68, whiteSpace: 'nowrap'}}>
						{l.slice(0, n)}
						{n < l.length && n > 0 && <span style={{opacity: Math.floor(f / 6) % 2 ? 1 : 0}}>▍</span>}
					</div>
				);
			})}
		</div>
	);
};

const Ital: React.FC<{at: number; out: number; top: number; size: number; color?: string; children: React.ReactNode}> = ({at, out, top, size, color = C.cream, children}) => {
	const f = useCurrentFrame();
	return (
		<div style={{position: 'absolute', top, left: 70, right: 70, textAlign: 'center', fontFamily: F.serif, fontStyle: 'italic', fontWeight: 400, fontSize: size, lineHeight: 1.1, color, opacity: Math.min(fadeIn(f, at, 8), fadeOut(f, out, 6)), textShadow: '0 4px 22px rgba(0,0,0,0.85)'}}>
			{children}
		</div>
	);
};

export const Y5Not: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Shots
				shots={[
					{id: '2737', start: 0.0, dur: 1.6, zoom: [1.12, 1.04], origin: '50% 70%'},
					{id: '2736', start: 0.4, dur: 1.5, zoom: [1.0, 1.08], origin: '50% 70%'},
					{id: '2860', start: 4.2, dur: 2.2, zoom: [1.08, 1.14], origin: '50% 72%'},
					{id: '2859', start: 5.0, dur: 1.8, zoom: [1.05, 1.0], origin: '50% 70%'},
					{id: '2733', start: 2.0, dur: 1.9, zoom: [1.0, 1.06], origin: '50% 75%'},
				]}
			/>
			<Vignette a={0.5} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.6) 28%, rgba(0,0,0,0) 44%)'}} />
			<Ital at={0} out={s(1.5)} top={170} size={92}>
				Ona hiç söyleyemediğin
				<br />
				<span style={{color: C.amber}}>o cümle…</span>
			</Ital>
			<Sequence from={s(1.5)} durationInFrames={s(1.6)}>
				<div style={{opacity: fadeOut(f - s(1.5), s(1.45), 5)}}>
					<Paper at={0} lines={['İlk şarkımız,', 'ilk tanışmamız…', 'Her şey seninle', 'anlam buldu.']} cps={2.4} size={46} />
				</div>
			</Sequence>
			<Sequence from={s(3.1)} durationInFrames={s(3.5)}>
				<Mid />
			</Sequence>
			<Sequence from={s(6.6)}>
				<End />
			</Sequence>
			<Audio src={staticFile('audio/y5.wav')} />
		</AbsoluteFill>
	);
};

const Mid: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<div style={{opacity: fadeOut(f, s(3.3), 6)}}>
			<Ital at={0} out={9999} top={140} size={92}>
				…her gece
				<br />
				<span style={{color: C.amber}}>başucunda yazsın.</span>
			</Ital>
			<div style={{position: 'absolute', top: 370, width: '100%', textAlign: 'center', opacity: fadeIn(f, 14, 8), fontFamily: F.mono, fontWeight: 700, fontSize: 42, color: C.cream, textShadow: '0 2px 12px rgba(0,0,0,0.9)'}}>
				mesajın · tarihin · şarkın
			</div>
			<div style={{position: 'absolute', top: 440, width: '100%', textAlign: 'center', opacity: fadeIn(f, 28, 8), fontFamily: F.inter, fontWeight: 600, fontSize: 44, color: C.cream, textShadow: '0 3px 16px rgba(0,0,0,0.85)'}}>
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
			<Paper at={0} lines={['Tarihini seç,', 'şarkını ekle ↓']} cps={2.4} top={130} size={60} />
			<div style={{position: 'absolute', top: 470, width: '100%', textAlign: 'center', opacity: fadeIn(f, 26, 8)}}>
				<span style={{fontFamily: F.inter, fontWeight: 800, fontSize: 40, color: C.night, background: C.amber, padding: '14px 32px', borderRadius: 8, whiteSpace: 'nowrap'}}>Ücretsiz kargo · Kapıda ödeme</span>
			</div>
		</>
	);
};
