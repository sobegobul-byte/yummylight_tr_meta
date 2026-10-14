// YZ_gecesaat_v1 · Stil: Telefon kilit ekranı. İnce dev saat "23:47", altında cümle; sonra bildirim kartı iner.
// Hook: öz-referans + gece ritüeli ("Uyumadan önce son baktığın şey…").
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {F} from './fonts';
import {C, END_L1, END_L2, END_PILL, MID_L1, MID_L2, MID_TAG, NIGHT, Shots, Vignette, fadeIn, fadeOut, s} from './common';

const inter = F.inter;
const shadow = '0 2px 18px rgba(0,0,0,0.65)';

export const V7Saat: React.FC = () => {
	const f = useCurrentFrame();
	const clockOut = fadeOut(f, s(4.6), 8);
	// Dakika 23:47 → 23:48 (zaman akıyor hissi)
	const min = f < s(3.0) ? '47' : '48';
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Shots
				shots={[
					{id: '4209', start: 0.4, dur: 2.4, zoom: [1.1, 1.02], grade: NIGHT},
					{id: '4190', start: 0.0, dur: 2.4, zoom: [1.0, 1.05]},
					{id: '4204', start: 0.4, dur: 2.0, zoom: [1.0, 1.06]},
					{id: '4203', start: 0.3, dur: 2.2, zoom: [1.05, 1.0]},
				]}
			/>
			<Vignette a={0.6} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 48%)'}} />
			{/* Kilit ekranı */}
			<div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center', color: C.cream, opacity: Math.min(fadeIn(f, 0, 4), clockOut)}}>
				<div style={{fontFamily: inter, fontWeight: 600, fontSize: 40, opacity: 0.85, textShadow: shadow}}>🔒</div>
				<div style={{fontFamily: inter, fontWeight: 200, fontSize: 230, lineHeight: 1, letterSpacing: -6, textShadow: shadow}}>23:{min}</div>
			</div>
			<Line at={3} out={s(2.35)} top={420}>
				Uyumadan önce
				<br />
				son baktığın şey…
			</Line>
			<Line at={s(2.45)} out={s(4.55)} top={420}>
				<span style={{textDecoration: 'line-through', textDecorationThickness: 5, opacity: 0.7}}>telefonun olmasın.</span>
				<br />
				<b style={{fontWeight: 800, color: C.amber}}>onun gülüşü olsun.</b>
			</Line>
			<Sequence from={s(4.7)} durationInFrames={s(2.3)}>
				<Notif />
			</Sequence>
			<Sequence from={s(6.8)}>
				<End />
			</Sequence>
			<Audio src={staticFile('audio/v7.wav')} />
		</AbsoluteFill>
	);
};

const Line: React.FC<{at: number; out: number; top: number; children: React.ReactNode}> = ({at, out, top, children}) => {
	const f = useCurrentFrame();
	const y = interpolate(f, [at, at + 8], [24, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	return (
		<div style={{position: 'absolute', top, width: '100%', textAlign: 'center', fontFamily: inter, fontWeight: 400, fontSize: 70, lineHeight: 1.18, color: C.cream, textShadow: shadow, opacity: Math.min(fadeIn(f, at, 8), fadeOut(f, out, 6)), transform: `translateY(${y}px)`}}>
			{children}
		</div>
	);
};

// iOS tarzı bildirim kartı
const Notif: React.FC = () => {
	const f = useCurrentFrame();
	const y = interpolate(f, [0, 9], [-260, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.4))});
	return (
		<div style={{position: 'absolute', top: 150, left: 60, right: 60, transform: `translateY(${y}px)`, opacity: fadeOut(f, s(2.15), 5)}}>
			<div style={{background: 'rgba(245,240,232,0.82)', backdropFilter: 'blur(20px)', borderRadius: 44, padding: '30px 36px', display: 'flex', gap: 26, alignItems: 'flex-start', boxShadow: '0 20px 50px rgba(0,0,0,0.45)'}}>
				<div style={{width: 92, height: 92, borderRadius: 22, background: C.amber, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 54}}>💡</div>
				<div style={{fontFamily: inter, color: '#1B1712', flex: 1}}>
					<div style={{display: 'flex', justifyContent: 'space-between', fontSize: 32, fontWeight: 600, opacity: 0.6}}>
						<span>{MID_TAG}</span>
						<span>şimdi</span>
					</div>
					<div style={{fontSize: 52, fontWeight: 800, lineHeight: 1.12, marginTop: 6}}>{MID_L1} {MID_L2}</div>
					<div style={{fontSize: 36, fontWeight: 400, marginTop: 8, opacity: 0.75}}>Fotoğrafın lambada nasıl duracak, önce sen bak.</div>
				</div>
			</div>
		</div>
	);
};

const End: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 55%)', opacity: fadeIn(f, 0, 8)}} />
			<div style={{position: 'absolute', top: 170, width: '100%', textAlign: 'center', color: C.cream, textShadow: shadow, opacity: fadeIn(f, 2, 8)}}>
				<div style={{fontFamily: inter, fontWeight: 200, fontSize: 104, lineHeight: 1.05}}>{END_L1}</div>
				<div style={{fontFamily: inter, fontWeight: 800, fontSize: 104, lineHeight: 1.05, color: C.amber}}>{END_L2}</div>
			</div>
			<div style={{position: 'absolute', top: 440, width: '100%', textAlign: 'center', opacity: fadeIn(f, 16, 8)}}>
				<span style={{fontFamily: inter, fontWeight: 600, fontSize: 40, color: '#1B1712', background: 'rgba(245,240,232,0.9)', padding: '16px 34px', borderRadius: 60, whiteSpace: 'nowrap'}}>{END_PILL}</span>
			</div>
		</>
	);
};
