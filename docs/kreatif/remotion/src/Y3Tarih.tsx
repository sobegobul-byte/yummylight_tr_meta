// YH_tarih_v1 · Stil: Sayaç (odometre). Tarih rakamları yukarıdan dönerek yerine oturur, koordinatlar daktilo gibi yazılır.
// Hook: kişisel soru ("Hangi tarih hayatını değiştirdi?")
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {F} from './fonts';
import {C, Shots, Vignette, fadeIn, fadeOut, s} from './common';

const H = 120;
const Digit: React.FC<{d: number; at: number; turns: number}> = ({d, at, turns}) => {
	const f = useCurrentFrame();
	const total = turns * 10 + d;
	const p = interpolate(f, [at, at + 16], [0, total], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	return (
		<div style={{height: H, width: 78, overflow: 'hidden', background: 'rgba(14,11,22,0.9)', borderRadius: 12, margin: '0 3px', position: 'relative', boxShadow: 'inset 0 -20px 30px rgba(0,0,0,0.6), inset 0 20px 30px rgba(0,0,0,0.6)'}}>
			<div style={{transform: `translateY(${-p * H}px)`}}>
				{Array.from({length: total + 1}).map((_, i) => (
					<div key={i} style={{height: H, lineHeight: `${H}px`, textAlign: 'center', fontFamily: F.black, fontSize: 88, color: C.amber}}>{i % 10}</div>
				))}
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: H / 2 - 1, height: 2, background: 'rgba(0,0,0,0.5)'}} />
		</div>
	);
};

const Odometer: React.FC<{date: string; at: number}> = ({date, at}) => (
	<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
		{date.split('').map((ch, i) =>
			ch === '.' ? (
				<div key={i} style={{fontFamily: F.black, fontSize: 70, color: C.cream, margin: '0 2px', alignSelf: 'flex-end', paddingBottom: 6}}>.</div>
			) : (
				<Digit key={i} d={parseInt(ch, 10)} at={at + i * 2} turns={1 + (i % 3)} />
			),
		)}
	</div>
);

const Type: React.FC<{text: string; at: number; cps?: number; style?: React.CSSProperties}> = ({text, at, cps = 1.2, style}) => {
	const f = useCurrentFrame();
	const n = Math.max(0, Math.min(text.length, Math.floor((f - at) * cps)));
	const cursor = f >= at && Math.floor(f / 8) % 2 === 0;
	return (
		<div style={{fontFamily: F.mono, ...style}}>
			{text.slice(0, n)}
			<span style={{opacity: cursor ? 1 : 0}}>▍</span>
		</div>
	);
};

const Head: React.FC<{at: number; out: number; top: number; size: number; color?: string; children: React.ReactNode}> = ({at, out, top, size, color = C.cream, children}) => {
	const f = useCurrentFrame();
	return (
		<div style={{position: 'absolute', top, left: 60, right: 60, textAlign: 'center', fontFamily: F.inter, fontWeight: 800, fontSize: size, lineHeight: 1.08, letterSpacing: -1.5, color, opacity: Math.min(fadeIn(f, at, 6), fadeOut(f, out, 6)), textShadow: '0 4px 22px rgba(0,0,0,0.85)'}}>
			{children}
		</div>
	);
};

export const Y3Tarih: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Shots
				shots={[
					{id: '2800', start: 0.5, dur: 2.0, zoom: [1.12, 1.04], origin: '50% 70%'},
					{id: '2799', start: 2.0, dur: 1.7, zoom: [1.0, 1.08], origin: '50% 70%'},
					{id: '2801', start: 3.0, dur: 1.8, zoom: [1.06, 1.0], origin: '50% 70%'},
					{id: '2796', start: 1.5, dur: 1.5, zoom: [1.1, 1.18], origin: '50% 55%'},
					{id: '2800', start: 7.2, dur: 2.0, zoom: [1.0, 1.06], origin: '50% 70%'},
				]}
			/>
			<Vignette a={0.55} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0) 46%)'}} />
			<Head at={0} out={s(2.9)} top={130} size={78}>
				Hangi tarih
				<br />
				<span style={{color: C.amber}}>hayatını değiştirdi?</span>
			</Head>
			<div style={{position: 'absolute', top: 340, width: '100%', opacity: Math.min(fadeIn(f, s(0.9), 4), fadeOut(f, s(2.9), 6))}}>
				<Odometer date="12.06.2019" at={s(0.9)} />
			</div>
			<Sequence from={s(3.0)} durationInFrames={s(3.6)}>
				<Mid />
			</Sequence>
			<Sequence from={s(6.6)}>
				<End />
			</Sequence>
			<Audio src={staticFile('audio/y3.wav')} />
		</AbsoluteFill>
	);
};

const Mid: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<div style={{opacity: fadeOut(f, s(3.4), 6)}}>
			<Type text="41.0082° K · 28.9784° D" at={0} style={{position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', fontSize: 48, color: C.amber, textShadow: '0 3px 14px rgba(0,0,0,0.9)'}} />
			<Head at={24} out={9999} top={240} size={66}>
				O gece, o şehirden görünen
				<br />
				gökyüzü lambanda.
			</Head>
			<div style={{position: 'absolute', top: 440, width: '100%', textAlign: 'center', opacity: fadeIn(f, 40, 8), fontFamily: F.inter, fontWeight: 600, fontSize: 44, color: C.cream, textShadow: '0 3px 16px rgba(0,0,0,0.85)'}}>
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
			<Head at={2} out={9999} top={140} size={86}>
				Tarihini seç,
				<br />
				<span style={{color: C.amber}}>şarkını ekle ↓</span>
			</Head>
			<Type text="ÜCRETSİZ KARGO · KAPIDA ÖDEME" at={16} cps={2} style={{position: 'absolute', top: 360, left: 0, right: 0, textAlign: 'center', fontSize: 40, fontWeight: 700, color: C.cream, textShadow: '0 3px 14px rgba(0,0,0,0.9)'}} />
		</>
	);
};
