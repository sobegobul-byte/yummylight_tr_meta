// ARABA_motor_v1 · Stil: Gösterge paneli (HUD). İnce çizgili hız göstergesi dolar, eğik kalın yazılar hız çizgileriyle girer.
// Hook: "Motorunu odana park et." (kimlik + sahiplik).
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {F} from './fonts';
import {C, Shots, Vignette, fadeIn, fadeOut, s} from './common';

const inter = F.inter;
const mono = F.mono;

const Gauge: React.FC<{p: number}> = ({p}) => {
	const R = 120;
	const len = Math.PI * 1.5 * R;
	return (
		<svg width={300} height={300} viewBox="0 0 300 300">
			<circle cx={150} cy={150} r={R} fill="none" stroke="rgba(255,244,227,0.18)" strokeWidth={14} strokeDasharray={`${len} 999`} transform="rotate(135 150 150)" />
			<circle cx={150} cy={150} r={R} fill="none" stroke={C.amber} strokeWidth={14} strokeLinecap="round" strokeDasharray={`${len * p} 999`} transform="rotate(135 150 150)" />
			<text x={150} y={165} textAnchor="middle" fontFamily={inter} fontWeight={800} fontSize={72} fill={C.cream}>{Math.round(p * 240)}</text>
			<text x={150} y={205} textAnchor="middle" fontFamily={mono} fontSize={22} fill="rgba(255,244,227,0.6)">km/s</text>
		</svg>
	);
};

const Fast: React.FC<{at: number; out: number; top: number; size: number; color?: string; children: React.ReactNode}> = ({at, out, top, size, color = C.cream, children}) => {
	const f = useCurrentFrame();
	const x = interpolate(f, [at, at + 6], [700, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.exp)});
	const blur = interpolate(f, [at, at + 6], [16, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<div style={{position: 'absolute', top, left: 70, right: 40, fontFamily: inter, fontWeight: 800, fontStyle: 'italic', fontSize: size, lineHeight: 1, letterSpacing: -2, color, transform: `translateX(${x}px) skewX(-8deg)`, filter: `blur(${blur}px)`, opacity: Math.min(fadeIn(f, at, 3), fadeOut(f, out, 6)), textShadow: '0 6px 26px rgba(0,0,0,0.7)'}}>
			{children}
		</div>
	);
};

export const A2Motor: React.FC = () => {
	const f = useCurrentFrame();
	const p = interpolate(f, [0, s(2.2)], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const lines = Array.from({length: 7});
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Shots
				shots={[
					{id: '0656', start: 0.0, dur: 2.3, zoom: [1.35, 1.2], origin: '45% 62%'},
					{id: '0662', start: 0.8, dur: 1.8, zoom: [1.0, 1.08], origin: '50% 65%'},
					{id: '0660', start: 1.0, dur: 1.8, zoom: [1.06, 1.0], origin: '50% 60%'},
					{id: '0658', start: 1.5, dur: 3.1, zoom: [1.0, 1.08], origin: '50% 60%'},
				]}
			/>
			<Vignette a={0.55} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 45%)'}} />
			{/* Hız çizgileri (sadece hook boyunca) */}
			{f < s(2.3) &&
				lines.map((_, i) => {
					const y = 140 + i * 70;
					const x = ((f * 90 + i * 260) % 1600) - 400;
					return <div key={i} style={{position: 'absolute', top: y, left: 1080 - x, width: 220, height: 3, background: 'rgba(255,244,227,0.35)'}} />;
				})}
			<div style={{position: 'absolute', top: 110, right: 50, opacity: Math.min(fadeIn(f, 0, 4), fadeOut(f, s(2.15), 5))}}>
				<Gauge p={p} />
			</div>
			<Fast at={3} out={s(2.15)} top={170} size={128}>
				Motorunu
			</Fast>
			<Fast at={9} out={s(2.15)} top={300} size={128} color={C.amber}>
				odana park et.
			</Fast>
			<Sequence from={s(2.4)} durationInFrames={s(3.9)}>
				<Mid />
			</Sequence>
			<Sequence from={s(6.3)}>
				<End />
			</Sequence>
			<Audio src={staticFile('audio/a2.wav')} />
		</AbsoluteFill>
	);
};

const Mid: React.FC = () => {
	const f = useCurrentFrame();
	const rows = [
		['MODEL', 'senin motorun'],
		['SÜRÜCÜ', 'sen'],
		['YAZI', 'adın, plakan'],
	];
	return (
		<div style={{opacity: fadeOut(f, s(3.7), 5)}}>
			{rows.map(([k, v], i) => (
				<div key={k} style={{position: 'absolute', top: 160 + i * 96, left: 70, right: 70, display: 'flex', alignItems: 'baseline', gap: 24, opacity: fadeIn(f, i * 9, 5), borderBottom: '2px solid rgba(255,181,74,0.5)', paddingBottom: 12}}>
					<span style={{fontFamily: mono, fontSize: 34, color: C.amber, width: 200, letterSpacing: 3}}>{k}</span>
					<span style={{fontFamily: inter, fontWeight: 800, fontStyle: 'italic', fontSize: 62, color: C.cream, textShadow: '0 3px 16px rgba(0,0,0,0.8)'}}>{v}</span>
				</div>
			))}
			<div style={{position: 'absolute', top: 480, left: 70, fontFamily: inter, fontWeight: 600, fontSize: 46, color: C.cream, opacity: fadeIn(f, 34, 8), textShadow: '0 3px 16px rgba(0,0,0,0.8)'}}>
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
			<Fast at={2} out={9999} top={170} size={104}>
				Fotoğrafını
			</Fast>
			<Fast at={7} out={9999} top={285} size={104} color={C.amber}>
				yükle ↓
			</Fast>
			<div style={{position: 'absolute', top: 450, left: 70, opacity: fadeIn(f, 16, 8), fontFamily: mono, fontWeight: 700, fontSize: 40, color: C.night, background: C.amber, padding: '12px 26px', whiteSpace: 'nowrap'}}>
				ÜCRETSİZ KARGO · KAPIDA ÖDEME
			</div>
		</>
	);
};
