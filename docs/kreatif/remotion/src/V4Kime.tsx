// YZ_kime_v1 · Stil: Kinetik liste. Her 0,7 sn'de yeni klip ve yeni kelime; önceki kelimeler üstte soluk kalır.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {F} from './fonts';
import {C, Shots, fadeIn, fadeOut, s} from './common';

const syne = F.syne;

const WORDS = ['Sevgiline.', 'Annene.', 'Kankana.', 'Babana.', 'Kendine.'];
const STEP = 0.7;

const Word: React.FC<{w: string; i: number}> = ({w, i}) => {
	const f = useCurrentFrame();
	const at = s(i * STEP);
	const local = f - at;
	const sc = interpolate(local, [0, 6], [1.35, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const active = f < at + s(STEP);
	const o = local < 0 ? 0 : active ? 1 : 0.32;
	const under = interpolate(local, [2, 10], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<div style={{fontFamily: syne, fontWeight: 800, fontSize: 118, lineHeight: 1.02, color: active ? C.cream : C.cream, opacity: o, transform: `scale(${active ? sc : 1})`, transformOrigin: '0% 50%', textShadow: '0 6px 30px rgba(0,0,0,0.6)', position: 'relative', width: 'fit-content'}}>
			{w}
			{active && <div style={{position: 'absolute', left: 0, bottom: 4, height: 12, width: `${under}%`, background: C.amber}} />}
		</div>
	);
};

export const V4Kime: React.FC = () => {
	const f = useCurrentFrame();
	const listOut = fadeOut(f, s(3.6), 6);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Shots
				shots={[
					{id: '4151', start: 0.2, dur: STEP, zoom: [1.1, 1.04]},
					{id: '4205', start: 0.6, dur: STEP, zoom: [1.0, 1.06]},
					{id: '4191', start: 2.0, dur: STEP, zoom: [1.0, 1.04]},
					{id: '4187', start: 1.8, dur: STEP, zoom: [1.06, 1.0]},
					{id: '4204', start: 0.3, dur: STEP, zoom: [1.0, 1.05]},
					{id: '4189', start: 2.4, dur: 2.1, zoom: [1.0, 1.06]},
					{id: '4154', start: 0.5, dur: 3.4, zoom: [1.0, 1.06]},
				]}
			/>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,8,16,0.72) 0%, rgba(10,8,16,0) 58%)'}} />
			<div style={{position: 'absolute', top: 170, left: 80, opacity: listOut}}>
				{WORDS.map((w, i) => (
					<Word key={w} w={w} i={i} />
				))}
			</div>
			<Sequence from={s(3.75)} durationInFrames={s(2.55)}>
				<Big />
			</Sequence>
			<Sequence from={s(6.3)}>
				<End />
			</Sequence>
			<Audio src={staticFile('audio/v4.wav')} />
		</AbsoluteFill>
	);
};

const Big: React.FC = () => {
	const f = useCurrentFrame();
	const y = interpolate(f, [0, 8], [60, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const out = fadeOut(f, s(2.35), 6);
	return (
		<div style={{position: 'absolute', top: 230, left: 80, right: 80, opacity: Math.min(fadeIn(f, 0, 6), out), transform: `translateY(${y}px)`}}>
			<div style={{fontFamily: syne, fontWeight: 500, fontSize: 76, color: C.cream, textShadow: '0 4px 24px rgba(0,0,0,0.6)'}}>Bir fotoğraf</div>
			<div style={{fontFamily: syne, fontWeight: 800, fontSize: 150, color: C.amber, lineHeight: 1, textShadow: '0 4px 24px rgba(0,0,0,0.5)'}}>yeter.</div>
			<div style={{marginTop: 40, opacity: fadeIn(f, s(1.0), 8), fontFamily: syne, fontWeight: 500, fontSize: 54, color: C.cream, lineHeight: 1.3, textShadow: '0 3px 16px rgba(0,0,0,0.7)'}}>
				Hızlı kargo
				<br />
				Peşin fiyatına 3 taksit
			</div>
		</div>
	);
};

const End: React.FC = () => {
	const f = useCurrentFrame();
	const sc = interpolate(f, [0, 7], [1.25, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	return (
		<>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,8,16,0.8) 0%, rgba(10,8,16,0) 60%)', opacity: fadeIn(f, 0, 6)}} />
			<div style={{position: 'absolute', top: 220, left: 80, right: 80, transform: `scale(${sc})`, transformOrigin: '0% 0%'}}>
				<div style={{fontFamily: syne, fontWeight: 800, fontSize: 112, color: C.cream, lineHeight: 1.02}}>Fotoğrafını</div>
				<div style={{fontFamily: syne, fontWeight: 800, fontSize: 112, color: C.amber, lineHeight: 1.02}}>yükle ↓</div>
			</div>
			<div style={{position: 'absolute', top: 500, left: 80, opacity: fadeIn(f, 12, 8), fontFamily: syne, fontWeight: 800, fontSize: 34, color: C.night, background: C.amber, padding: '14px 24px', whiteSpace: 'nowrap'}}>
				Ücretsiz kargo · Kapıda ödeme
			</div>
		</>
	);
};
