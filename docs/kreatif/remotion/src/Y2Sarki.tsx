// YH_sarki_v1 · Stil: Müzik çalar kartı. Koyu kart, dönen plak, ekolayzır çubukları ve dolan ilerleme çubuğu.
// Hook: gösterim + merak ("Bu lambayı telefonla okut… ilk şarkınız çalsın.") Kanıt: telefonla kodu okutma klibi.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {F} from './fonts';
import {C, Shots, Vignette, fadeIn, fadeOut, s} from './common';

const syne = F.syne;

const Player: React.FC<{at: number; title: string; sub: string}> = ({at, title, sub}) => {
	const f = useCurrentFrame();
	const y = interpolate(f, [at, at + 10], [-80, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.4))});
	const prog = interpolate(f, [at, at + s(6)], [0.05, 0.85], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<div style={{position: 'absolute', top: 120, left: 70, right: 70, transform: `translateY(${y}px)`, opacity: fadeIn(f, at, 6), background: 'rgba(18,14,24,0.88)', borderRadius: 36, padding: '30px 34px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', border: '2px solid rgba(255,181,74,0.25)'}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 28}}>
				<div style={{width: 120, height: 120, borderRadius: 60, background: `radial-gradient(circle, ${C.amber} 0 14%, #1a1a1a 15% 40%, #2a2a2a 41% 44%, #1a1a1a 45%)`, transform: `rotate(${f * 6}deg)`, flexShrink: 0}} />
				<div style={{flex: 1, minWidth: 0}}>
					<div style={{fontFamily: syne, fontWeight: 800, fontSize: 50, color: C.cream, lineHeight: 1.05, whiteSpace: 'nowrap'}}>{title}</div>
					<div style={{fontFamily: syne, fontWeight: 500, fontSize: 32, color: 'rgba(255,244,227,0.6)', marginTop: 6}}>{sub}</div>
				</div>
				<div style={{display: 'flex', alignItems: 'flex-end', gap: 6, height: 70}}>
					{[0, 1, 2, 3].map((i) => (
						<div key={i} style={{width: 12, borderRadius: 6, background: C.amber, height: 18 + 50 * Math.abs(Math.sin((f + i * 9) / (5 + i)))}} />
					))}
				</div>
			</div>
			<div style={{marginTop: 26, height: 8, borderRadius: 4, background: 'rgba(255,244,227,0.18)'}}>
				<div style={{width: `${prog * 100}%`, height: '100%', borderRadius: 4, background: C.amber}} />
			</div>
		</div>
	);
};

const Big: React.FC<{at: number; out: number; top: number; size: number; color?: string; children: React.ReactNode}> = ({at, out, top, size, color = C.cream, children}) => {
	const f = useCurrentFrame();
	const sc = interpolate(f, [at, at + 8], [0.85, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	return (
		<div style={{position: 'absolute', top, left: 70, right: 70, fontFamily: syne, fontWeight: 800, fontSize: size, lineHeight: 1.02, letterSpacing: -1, color, transform: `scale(${sc})`, transformOrigin: '0% 50%', opacity: Math.min(fadeIn(f, at, 5), fadeOut(f, out, 6)), textShadow: '0 4px 24px rgba(0,0,0,0.8)'}}>
			{children}
		</div>
	);
};

export const Y2Sarki: React.FC = () => (
	<AbsoluteFill style={{background: '#000'}}>
		<Shots
			shots={[
				{id: '2734', start: 0.0, dur: 1.4, zoom: [1.15, 1.05], origin: '50% 70%'},
				{id: '2747', start: 5.9, dur: 1.5, zoom: [1.0, 1.05], origin: '50% 60%'},
				{id: '2748', start: 8.0, dur: 1.9, zoom: [1.05, 1.0], origin: '50% 60%'},
				{id: '2746', start: 1.0, dur: 1.8, zoom: [1.0, 1.06], origin: '50% 75%'},
				{id: '2800', start: 7.0, dur: 2.4, zoom: [1.0, 1.06], origin: '50% 70%'},
			]}
		/>
		<Vignette a={0.5} />
		<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0) 45%)'}} />
		<Big at={2} out={s(1.45)} top={170} size={96}>
			Bu lambayı
			<br />
			<span style={{color: C.amber}}>telefonla okut…</span>
		</Big>
		<Sequence from={s(1.5)} durationInFrames={s(1.6)}>
			<Player at={0} title="İlk şarkınız" sub="şimdi çalıyor" />
			<Big at={6} out={s(1.4)} top={400} size={72} color={C.amber}>
				…ve çalsın ▶
			</Big>
		</Sequence>
		<Sequence from={s(3.1)} durationInFrames={s(3.5)}>
			<Mid />
		</Sequence>
		<Sequence from={s(6.6)}>
			<End />
		</Sequence>
		<Audio src={staticFile('audio/y2.wav')} />
	</AbsoluteFill>
);

const Mid: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<div style={{opacity: fadeOut(f, s(3.3), 6)}}>
			<Big at={0} out={9999} top={150} size={64}>
				Yıldız haritanız
				<br />
				<span style={{color: C.amber}}>+ şarkınızın kodu</span>
			</Big>
			<Big at={10} out={9999} top={310} size={56}>
				tek lambada.
			</Big>
			<div style={{position: 'absolute', top: 440, left: 70, opacity: fadeIn(f, 24, 8), fontFamily: F.inter, fontWeight: 600, fontSize: 44, color: C.cream, textShadow: '0 3px 16px rgba(0,0,0,0.85)', whiteSpace: 'nowrap'}}>
				Hızlı kargo · Peşin fiyatına 3 taksit
			</div>
		</div>
	);
};

const End: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 55%)', opacity: fadeIn(f, 0, 8)}} />
			<Player at={0} title="Sizin şarkınız" sub="tarihini seç, şarkını ekle" />
			<Big at={8} out={9999} top={400} size={66} color={C.amber}>
				Hemen tasarla ↓
			</Big>
			<div style={{position: 'absolute', top: 520, left: 70, opacity: fadeIn(f, 18, 8), fontFamily: F.inter, fontWeight: 800, fontSize: 40, color: C.cream, whiteSpace: 'nowrap', textShadow: '0 3px 16px rgba(0,0,0,0.85)'}}>
				Ücretsiz kargo · Kapıda ödeme
			</div>
		</>
	);
};
