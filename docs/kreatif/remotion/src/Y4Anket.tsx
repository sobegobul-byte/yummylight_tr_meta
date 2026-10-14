// YH_anket_v1 · Stil: Hikâye anket çıkartması. Beyaz anket kutusu, parmak dokunuşu, seçilen şık sıcak sarıyla dolar.
// Hook: karşılaştırma / kayıp ("Çiçek mi, sizin gökyüzünüz mü?" → "Çiçek solar, gökyüzünüz kalır.")
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {F} from './fonts';
import {C, Shots, Vignette, fadeIn, fadeOut, s} from './common';

const Poll: React.FC<{at: number; tap: number; q: string; a: string; b: string}> = ({at, tap, q, a, b}) => {
	const f = useCurrentFrame();
	const sc = interpolate(f, [at, at + 8], [0.7, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.8))});
	const fill = interpolate(f, [tap, tap + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const ring = interpolate(f, [tap - 2, tap + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const opt = (label: string, chosen: boolean) => (
		<div style={{position: 'relative', height: 108, borderRadius: 54, background: '#EFEFEF', overflow: 'hidden', marginTop: 20}}>
			{chosen && <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: C.amber}} />}
			<div style={{position: 'relative', lineHeight: '108px', textAlign: 'center', fontFamily: F.inter, fontWeight: 800, fontSize: 48, color: chosen && fill > 0.5 ? C.night : chosen ? '#222' : fill > 0 ? 'rgba(0,0,0,0.35)' : '#222'}}>{label}</div>
			{chosen && ring > 0 && ring < 1 && <div style={{position: 'absolute', left: '62%', top: 54 - 40 * ring - 10, width: 20 + 80 * ring, height: 20 + 80 * ring, marginLeft: -40 * ring, borderRadius: '50%', border: '4px solid rgba(0,0,0,0.35)', opacity: 1 - ring}} />}
		</div>
	);
	return (
		<div style={{position: 'absolute', top: 120, left: 110, right: 110, transform: `scale(${sc}) rotate(-2deg)`, opacity: fadeIn(f, at, 5), background: '#fff', borderRadius: 40, padding: '34px 36px 40px', boxShadow: '0 18px 50px rgba(0,0,0,0.45)'}}>
			<div style={{textAlign: 'center', fontFamily: F.inter, fontWeight: 800, fontSize: 50, color: '#111', lineHeight: 1.12}}>{q}</div>
			{opt(a, false)}
			{opt(b, true)}
		</div>
	);
};

const Line: React.FC<{at: number; out: number; top: number; size: number; color?: string; children: React.ReactNode}> = ({at, out, top, size, color = C.cream, children}) => {
	const f = useCurrentFrame();
	return (
		<div style={{position: 'absolute', top, left: 60, right: 60, textAlign: 'center', fontFamily: F.inter, fontWeight: 800, fontSize: size, lineHeight: 1.1, letterSpacing: -1, color, opacity: Math.min(fadeIn(f, at, 6), fadeOut(f, out, 6)), textShadow: '0 4px 22px rgba(0,0,0,0.85)'}}>
			{children}
		</div>
	);
};

export const Y4Anket: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Shots
				shots={[
					{id: '2860', start: 3.8, dur: 2.0, zoom: [1.06, 1.12], origin: '50% 70%'},
					{id: '2862', start: 1.9, dur: 1.9, zoom: [1.1, 1.04], origin: '50% 70%'},
					{id: '2859', start: 4.0, dur: 1.8, zoom: [1.0, 1.06], origin: '50% 70%'},
					{id: '2892', start: 3.2, dur: 1.4, zoom: [1.05, 1.0], origin: '50% 75%'},
					{id: '2853', start: 2.0, dur: 1.9, zoom: [1.06, 1.12], origin: '50% 70%'},
				]}
			/>
			<Vignette a={0.45} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 30%, rgba(0,0,0,0) 45%)'}} />
			<div style={{opacity: fadeOut(f, s(2.9), 6)}}>
				<Poll at={0} tap={s(1.3)} q="Sevgiline hediye?" a="🌹 Çiçek" b="✨ Sizin gökyüzünüz" />
			</div>
			<Sequence from={s(3.0)} durationInFrames={s(3.6)}>
				<Mid />
			</Sequence>
			<Sequence from={s(6.6)}>
				<End />
			</Sequence>
			<Audio src={staticFile('audio/y4.wav')} />
		</AbsoluteFill>
	);
};

const Mid: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<div style={{opacity: fadeOut(f, s(3.4), 6)}}>
			<Line at={0} out={9999} top={140} size={66} color="rgba(255,244,227,0.75)">
				Çiçek birkaç günde solar.
			</Line>
			<Line at={14} out={9999} top={230} size={76}>
				Tanıştığınız gecenin
				<br />
				<span style={{color: C.amber}}>gökyüzü her gece yanar.</span>
			</Line>
			<div style={{position: 'absolute', top: 440, width: '100%', textAlign: 'center', opacity: fadeIn(f, 32, 8), fontFamily: F.inter, fontWeight: 600, fontSize: 44, color: C.cream, textShadow: '0 3px 16px rgba(0,0,0,0.85)'}}>
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
			<Poll at={2} tap={s(0.6)} q="Tarihini seç, şarkını ekle" a="Sonra bakarım" b="Hemen tasarla ↓" />
			<div style={{position: 'absolute', top: 600, width: '100%', textAlign: 'center', opacity: fadeIn(f, 24, 8)}}>
				<span style={{fontFamily: F.inter, fontWeight: 800, fontSize: 40, color: C.cream, textShadow: '0 3px 16px rgba(0,0,0,0.9)', whiteSpace: 'nowrap'}}>Ücretsiz kargo · Kapıda ödeme</span>
			</div>
		</>
	);
};
