// YZ_onizle_v1 · Stil: Sinema bandı. Üstte siyah film bandı, sarı italik altyazı; hafif film greni.
// Hook: açık döngü (1_Yz gibi): "Bu fotoğrafı yükledik… sipariş vermeden önce gördük… sonra ışığı yandı."
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {F} from './fonts';
import {C, END_L1, END_L2, END_PILL, MID_L1, MID_L2, MID_TAG, NIGHT, Shots, fadeIn, fadeOut, s} from './common';

const fr = F.fraunces;
const BAND = 560;

const Sub: React.FC<{at: number; out: number; children: React.ReactNode; size?: number}> = ({at, out, children, size = 76}) => {
	const f = useCurrentFrame();
	return (
		<div style={{position: 'absolute', top: 0, height: BAND, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 70, boxSizing: 'border-box', opacity: Math.min(fadeIn(f, at, 5), fadeOut(f, out, 5))}}>
			<div style={{fontFamily: fr, fontStyle: 'italic', fontWeight: 300, fontSize: size, lineHeight: 1.15, color: '#FFD86B', textAlign: 'center', padding: '0 70px'}}>{children}</div>
		</div>
	);
};

export const V9Onizle: React.FC = () => {
	const f = useCurrentFrame();
	const grain = random(`g${f}`);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<AbsoluteFill style={{top: BAND - 60}}>
				<Shots
					shots={[
						{id: '4190', start: 0.0, dur: 2.0, zoom: [1.0, 1.05], origin: '50% 40%'},
						{id: '4214', start: 6.5, dur: 2.5, zoom: [1.0, 1.06], origin: '50% 55%', grade: NIGHT},
						{id: '4191', start: 1.8, dur: 2.0, zoom: [1.0, 1.04]},
						{id: '4182', start: 0.2, dur: 2.5, zoom: [1.04, 1.0], grade: NIGHT},
					]}
				/>
			</AbsoluteFill>
			{/* Film bandı */}
			<div style={{position: 'absolute', top: 0, left: 0, right: 0, height: BAND, background: 'linear-gradient(180deg, #000 85%, rgba(0,0,0,0))'}} />
			<div style={{position: 'absolute', top: 60, left: 70, fontFamily: F.mono, fontSize: 30, color: 'rgba(255,255,255,0.45)', letterSpacing: 3}}>
				● REC 00:00:{String(Math.floor(f / 30)).padStart(2, '0')}
			</div>
			<AbsoluteFill style={{opacity: 0.06 + grain * 0.04, background: `repeating-radial-gradient(circle at ${grain * 100}% ${(1 - grain) * 100}%, rgba(255,255,255,0.5) 0 1px, transparent 1px 3px)`, mixBlendMode: 'overlay'}} />
			<Sub at={0} out={s(1.9)}>Bu fotoğrafı yükledik…</Sub>
			<Sub at={s(2.0)} out={s(3.7)}>
				sipariş vermeden önce
				<br />
				çizimini <b style={{fontWeight: 700, fontStyle: 'normal'}}>ücretsiz gördük</b>…
			</Sub>
			<Sub at={s(3.8)} out={s(4.9)} size={96}>
				sonra ışığı yandı ✨
			</Sub>
			<Sequence from={s(5.0)} durationInFrames={s(1.6)}>
				<Mid />
			</Sequence>
			<Sequence from={s(6.5)}>
				<End />
			</Sequence>
			<Audio src={staticFile('audio/v9.wav')} />
		</AbsoluteFill>
	);
};

const Mid: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<div style={{position: 'absolute', top: 0, height: BAND, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 60, boxSizing: 'border-box', opacity: Math.min(fadeIn(f, 0, 5), fadeOut(f, s(1.45), 4))}}>
			<div style={{fontFamily: F.mono, fontSize: 32, letterSpacing: 6, color: C.amber, marginBottom: 14}}>{MID_TAG.toLocaleUpperCase('tr')}</div>
			<div style={{fontFamily: fr, fontWeight: 700, fontSize: 92, lineHeight: 1.05, color: C.cream, textAlign: 'center'}}>
				{MID_L1}
				<br />
				<span style={{fontStyle: 'italic', fontWeight: 300, color: '#FFD86B'}}>{MID_L2}</span>
			</div>
		</div>
	);
};

const End: React.FC = () => {
	const f = useCurrentFrame();
	const y = interpolate(f, [0, 10], [20, 0], {extrapolateRight: 'clamp'});
	return (
		<div style={{position: 'absolute', top: 0, height: BAND + 40, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 40, boxSizing: 'border-box', opacity: fadeIn(f, 0, 8), transform: `translateY(${y}px)`}}>
			<div style={{fontFamily: fr, fontWeight: 700, fontSize: 92, lineHeight: 1.05, color: C.cream, textAlign: 'center'}}>{END_L1}</div>
			<div style={{fontFamily: fr, fontStyle: 'italic', fontWeight: 300, fontSize: 96, lineHeight: 1.1, color: '#FFD86B', textAlign: 'center'}}>{END_L2}</div>
			<div style={{marginTop: 26, opacity: fadeIn(f, 14, 8), fontFamily: F.mono, fontWeight: 700, fontSize: 38, color: C.cream, letterSpacing: 1, whiteSpace: 'nowrap'}}>{END_PILL}</div>
		</div>
	);
};
