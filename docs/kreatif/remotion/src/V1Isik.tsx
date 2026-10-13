// YZ_isik_v1 · Stil: Işık süpürmesi. Karanlık üst bölgede soldan sağa ışık şeridi geçer, yazı şeridin geçtiği yerde açılır.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {F} from './fonts';
import {C, Shots, TopShade, fadeIn, fadeOut, s} from './common';

const serif = F.serif;
const black = F.black;

// Yazıyı soldan sağa açan maske + üstünden geçen parlak şerit
const Sweep: React.FC<{at: number; len?: number; children: React.ReactNode; top: number}> = ({at, len = 18, children, top}) => {
	const f = useCurrentFrame();
	const p = interpolate(f, [at, at + len], [-20, 120], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
	const mask = `linear-gradient(90deg, #000 ${p - 12}%, rgba(0,0,0,0.25) ${p}%, transparent ${p + 6}%)`;
	const barOp = interpolate(f, [at, at + 4, at + len - 4, at + len], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<div style={{position: 'absolute', top, left: 0, right: 0}}>
			<div style={{WebkitMaskImage: mask, maskImage: mask, textAlign: 'center'}}>{children}</div>
			<div style={{position: 'absolute', top: -40, bottom: -40, left: `${p}%`, width: 70, transform: 'translateX(-50%) skewX(-14deg)', background: `linear-gradient(90deg, transparent, ${C.cream}cc, transparent)`, filter: 'blur(14px)', opacity: barOp, mixBlendMode: 'screen'}} />
		</div>
	);
};

const thin: React.CSSProperties = {fontFamily: serif, fontStyle: 'italic', color: C.cream, fontSize: 92, lineHeight: 1.05, textShadow: '0 4px 24px rgba(0,0,0,0.6)'};
const bold: React.CSSProperties = {fontFamily: black, color: C.amber, fontSize: 112, lineHeight: 1.0, letterSpacing: -1, textTransform: 'uppercase', textShadow: '0 4px 30px rgba(0,0,0,0.55)'};

export const V1Isik: React.FC = () => {
	const f = useCurrentFrame();
	const hookOut = fadeOut(f, s(4.3));
	return (
		<AbsoluteFill style={{background: C.night}}>
			<Shots
				shots={[
					{id: '4151', start: 0.0, dur: 2.0, zoom: [1.12, 1.0]},
					{id: '4184', start: 0.6, dur: 2.5, zoom: [1.0, 1.05]},
					{id: '4205', start: 0.5, dur: 2.0, zoom: [1.0, 1.08]},
					{id: '4187', start: 0.0, dur: 2.5, zoom: [1.0, 1.03], origin: '50% 75%'},
				]}
			/>
			<TopShade h={45} a={0.75} />
			{/* Hook */}
			<div style={{opacity: hookOut}}>
				<Sweep at={2} top={250}>
					<div style={thin}>Fotoğrafın</div>
				</Sweep>
				<Sweep at={10} top={360}>
					<div style={bold}>ışıklı lambaya</div>
				</Sweep>
				<Sweep at={18} top={490}>
					<div style={thin}>dönüşsün</div>
				</Sweep>
			</div>
			{/* Teklif (orta) */}
			<Sequence from={s(4.6)} durationInFrames={s(1.9)}>
				<Offer />
			</Sequence>
			{/* Son kare */}
			<Sequence from={s(6.5)}>
				<End />
			</Sequence>
			<Audio src={staticFile('audio/v1.wav')} />
		</AbsoluteFill>
	);
};

const Offer: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<Sweep at={0} len={14} top={110}>
			<div style={{...thin, fontSize: 70, opacity: fadeOut(f, 48)}}>Hızlı kargo</div>
			<div style={{...bold, fontSize: 74, color: C.cream, marginTop: 14, opacity: fadeOut(f, 48)}}>3 taksit</div>
			<div style={{...thin, fontSize: 46, marginTop: 10, opacity: fadeOut(f, 48)}}>peşin fiyatına</div>
		</Sweep>
	);
};

const End: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(14,11,22,0.78) 0%, rgba(14,11,22,0.15) 55%, rgba(14,11,22,0) 70%)', opacity: fadeIn(f, 0, 10)}} />
			<Sweep at={4} len={16} top={150}>
				<div style={{...thin, fontSize: 84}}>Fotoğrafını</div>
				<div style={{...bold, fontSize: 124, marginTop: 6}}>yükle ↓</div>
			</Sweep>
			<div style={{position: 'absolute', top: 420, width: '100%', textAlign: 'center', opacity: fadeIn(f, 22, 10)}}>
				<span style={{fontFamily: black, fontSize: 46, color: C.night, background: C.cream, padding: '16px 34px', borderRadius: 60, letterSpacing: 0.5}}>Ücretsiz kargo · Kapıda ödeme</span>
			</div>
		</>
	);
};
