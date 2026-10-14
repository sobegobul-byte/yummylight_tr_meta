// YZ_ozlem_v1 · Stil: Mesajlaşma balonları. İki kişi gece yazışıyor; balonlar tek tek gelir, "yazıyor…" noktaları.
// Hook: özlem / ayna nöronları ("Uyuyamadım… seni özledim").
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {F} from './fonts';
import {C, END_L1, END_L2, END_PILL, MID_L1, MID_L2, MID_TAG, NIGHT, Shots, Vignette, fadeIn, fadeOut, s} from './common';

const inter = F.inter;

type Msg = {t: string; me?: boolean; at: number};
const MSGS: Msg[] = [
	{t: 'Uyuyamadım 🥺', at: 0.1},
	{t: 'Seni çok özledim', at: 0.75},
	{t: 'Başucundaki lambayı yak 💛', me: true, at: 1.7},
	{t: 'Yaktım… sanki yanımdasın ✨', at: 3.0},
];

const Bubble: React.FC<{m: Msg}> = ({m}) => {
	const f = useCurrentFrame();
	const at = s(m.at);
	const sc = interpolate(f, [at, at + 6], [0.6, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.8))});
	if (f < at) return null;
	return (
		<div style={{display: 'flex', justifyContent: m.me ? 'flex-end' : 'flex-start', marginBottom: 16}}>
			<div style={{transform: `scale(${sc})`, transformOrigin: m.me ? '100% 100%' : '0% 100%', background: m.me ? C.amber : 'rgba(58,56,62,0.92)', color: m.me ? '#1B1408' : '#F4F1EC', fontFamily: inter, fontWeight: 600, fontSize: 56, lineHeight: 1.2, padding: '22px 34px', borderRadius: 44, borderBottomLeftRadius: m.me ? 44 : 12, borderBottomRightRadius: m.me ? 12 : 44, maxWidth: 820, boxShadow: '0 8px 24px rgba(0,0,0,0.35)'}}>
				{m.t}
			</div>
		</div>
	);
};

const Typing: React.FC<{from: number; to: number}> = ({from, to}) => {
	const f = useCurrentFrame();
	if (f < s(from) || f >= s(to)) return null;
	return (
		<div style={{display: 'flex', marginBottom: 16}}>
			<div style={{background: 'rgba(58,56,62,0.92)', borderRadius: 44, padding: '26px 30px', display: 'flex', gap: 12}}>
				{[0, 1, 2].map((i) => (
					<div key={i} style={{width: 18, height: 18, borderRadius: 9, background: '#BDB8B0', opacity: 0.4 + 0.6 * Math.abs(Math.sin((f + i * 5) / 6))}} />
				))}
			</div>
		</div>
	);
};

export const V8Ozlem: React.FC = () => {
	const f = useCurrentFrame();
	const chatOut = fadeOut(f, s(4.3), 8);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Shots
				shots={[
					{id: '4206', start: 0.2, dur: 2.2, zoom: [1.18, 1.12], origin: '50% 15%', grade: NIGHT},
					{id: '4210', start: 2.6, dur: 2.2, zoom: [1.15, 1.1], origin: '50% 15%', grade: NIGHT},
					{id: '4203', start: 0.4, dur: 2.2, zoom: [1.0, 1.05]},
					{id: '4202', start: 2.0, dur: 2.4, zoom: [1.05, 1.0]},
				]}
			/>
			<Vignette a={0.6} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 45%)'}} />
			<div style={{position: 'absolute', top: 110, left: 56, right: 56, opacity: chatOut}}>
				<div style={{textAlign: 'center', fontFamily: inter, fontWeight: 600, fontSize: 30, color: 'rgba(255,255,255,0.65)', marginBottom: 18}}>Bugün 00:12</div>
				{MSGS.map((m, i) => (
					<Bubble key={i} m={m} />
				))}
				<Typing from={2.3} to={3.0} />
			</div>
			<Sequence from={s(4.5)} durationInFrames={s(2.2)}>
				<Mid />
			</Sequence>
			<Sequence from={s(6.6)}>
				<End />
			</Sequence>
			<Audio src={staticFile('audio/v8.wav')} />
		</AbsoluteFill>
	);
};

const Mid: React.FC = () => {
	const f = useCurrentFrame();
	const o = Math.min(fadeIn(f, 0, 6), fadeOut(f, s(2.05), 5));
	return (
		<div style={{position: 'absolute', top: 170, width: '100%', textAlign: 'center', opacity: o, color: C.cream, textShadow: '0 3px 18px rgba(0,0,0,0.7)'}}>
			<div style={{fontFamily: inter, fontWeight: 600, fontSize: 60, lineHeight: 1.2}}>
				Uzaktaki sevdiğine
				<br />
				her gece yanan bir anı.
			</div>
			<div style={{marginTop: 34, opacity: fadeIn(f, 14, 6)}}>
				<span style={{fontFamily: inter, fontWeight: 800, fontSize: 46, color: '#1B1408', background: C.amber, padding: '14px 30px', borderRadius: 44, borderBottomLeftRadius: 12}}>
					{MID_TAG}: {MID_L1.toLocaleLowerCase('tr')} {MID_L2}
				</span>
			</div>
		</div>
	);
};

const End: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 55%)', opacity: fadeIn(f, 0, 8)}} />
			<div style={{position: 'absolute', top: 160, left: 56, right: 56}}>
				<Sequence from={2} layout="none">
					<Bubble m={{t: END_L1 + ' ' + END_L2, me: true, at: 0}} />
				</Sequence>
			</div>
			<div style={{position: 'absolute', top: 470, width: '100%', textAlign: 'center', opacity: fadeIn(f, 16, 8)}}>
				<span style={{fontFamily: inter, fontWeight: 800, fontSize: 42, color: C.cream, textShadow: '0 3px 16px rgba(0,0,0,0.8)', whiteSpace: 'nowrap'}}>{END_PILL}</span>
			</div>
		</>
	);
};
