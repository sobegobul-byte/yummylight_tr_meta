// ARABA_oncesonra_v1 · Stil: Bölünmüş ekran. Üstte telefondaki fotoğraf ("ÖNCE"), altta yanan lamba ("SONRA");
// sonra perde gibi açılan geçişle tam ekran lamba. Hook: dönüşüm (fotoğraf → lamba) ilk 2 sn'de.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {F} from './fonts';
import {C, Clip, Shots, fadeIn, fadeOut, s} from './common';

const black = F.black;
const inter = F.inter;

const Tag: React.FC<{t: string; color: string; top: number; at: number}> = ({t, color, top, at}) => {
	const f = useCurrentFrame();
	const x = interpolate(f, [at, at + 7], [-260, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	return (
		<div style={{position: 'absolute', top, left: 0, transform: `translateX(${x}px)`, background: color, color: color === C.amber ? C.night : C.cream, fontFamily: black, fontSize: 46, letterSpacing: 4, padding: '12px 30px 12px 48px'}}>{t}</div>
	);
};

const Split: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill>
			{/* Üst yarı: telefondaki fotoğraf */}
			<div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 960, overflow: 'hidden'}}>
				<Img src={staticFile('stills/a1_foto.jpg')} style={{position: 'absolute', top: -420, left: 0, width: 1080, height: 1920, objectFit: 'cover', transform: `scale(${interpolate(f, [0, s(2.8)], [1.12, 1.22])})`, transformOrigin: '55% 45%'}} />
			</div>
			{/* Alt yarı: yanan lamba */}
			<div style={{position: 'absolute', top: 960, left: 0, right: 0, height: 960, overflow: 'hidden'}}>
				<div style={{position: 'absolute', top: -620, left: 0, width: 1080, height: 1920}}>
					<Clip id="5570" start={7.0} zoom={[1.15, 1.05]} origin="50% 45%" />
				</div>
			</div>
			<div style={{position: 'absolute', top: 954, left: 0, right: 0, height: 12, background: C.amber, transform: `scaleX(${interpolate(f, [0, 10], [0, 1], {extrapolateRight: 'clamp'})})`}} />
			<Tag t="ÖNCE" color="rgba(14,11,22,0.85)" top={70} at={2} />
			<Tag t="SONRA" color={C.amber} top={990} at={10} />
		</AbsoluteFill>
	);
};

export const A1OnceSonra: React.FC = () => {
	const f = useCurrentFrame();
	// Perde: bölünmüş ekran yukarı kayarak tam ekrana geçer
	const lift = interpolate(f, [s(2.4), s(2.8)], [0, -1920], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Sequence from={s(2.4)}>
				<Shots
					shots={[
						{id: '5574', start: 1.2, dur: 2.0, zoom: [1.12, 1.04], origin: '50% 70%'},
						{id: '5571', start: 2.6, dur: 2.0, zoom: [1.1, 1.03], origin: '50% 70%'},
						{id: '5566', start: 5.2, dur: 2.6, zoom: [1.0, 1.08], origin: '50% 65%'},
					]}
				/>
				<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 45%)'}} />
			</Sequence>
			<Sequence durationInFrames={s(2.8)}>
				<AbsoluteFill style={{transform: `translateY(${lift}px)`}}>
					<Split />
					{/* Hook ortada, iki yarının birleştiği yerde */}
					<div style={{position: 'absolute', top: 760, width: '100%', textAlign: 'center', opacity: fadeIn(f, 4, 6)}}>
						<span style={{fontFamily: black, fontSize: 70, color: C.cream, background: 'rgba(14,11,22,0.85)', padding: '10px 28px', lineHeight: 1.5, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'}}>Bu fotoğraf…</span>
					</div>
					<div style={{position: 'absolute', top: 1110, width: '100%', textAlign: 'center', opacity: fadeIn(f, 16, 6)}}>
						<span style={{fontFamily: black, fontSize: 70, color: C.night, background: C.amber, padding: '10px 28px'}}>…bu lambaya dönüştü.</span>
					</div>
				</AbsoluteFill>
			</Sequence>
			{/* Orta: neyi gönderirsen */}
			<Sequence from={s(2.9)} durationInFrames={s(3.7)}>
				<Mid />
			</Sequence>
			<Sequence from={s(6.6)}>
				<End />
			</Sequence>
			<Audio src={staticFile('audio/a1.wav')} />
		</AbsoluteFill>
	);
};

const Mid: React.FC = () => {
	const f = useCurrentFrame();
	const items = ['Araban', 'Kamyonun', 'İş makinen'];
	return (
		<div style={{position: 'absolute', top: 150, left: 80, right: 80, opacity: fadeOut(f, s(3.5), 6)}}>
			{items.map((t, i) => (
				<div key={t} style={{fontFamily: black, fontSize: 92, lineHeight: 1.08, color: i === Math.min(2, Math.floor(f / s(1.2))) ? C.amber : 'rgba(255,244,227,0.45)', opacity: fadeIn(f, i * s(1.2), 5), textShadow: '0 4px 20px rgba(0,0,0,0.6)'}}>
					{t}
				</div>
			))}
			<div style={{marginTop: 26, fontFamily: inter, fontWeight: 600, fontSize: 50, color: C.cream, opacity: fadeIn(f, s(1.4), 8), textShadow: '0 3px 16px rgba(0,0,0,0.8)', lineHeight: 1.3}}>
				Fotoğrafından çizilir, plakasıyla.
				<br />
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
			<Tag t="SIRA SENDE" color={C.amber} top={110} at={0} />
			<div style={{position: 'absolute', top: 200, left: 80, right: 60, fontFamily: black, fontSize: 86, lineHeight: 1.04, color: C.cream, opacity: fadeIn(f, 6, 8)}}>
				Aracının
				<br />
				fotoğrafını
				<br />
				<span style={{color: C.amber}}>yükle ↓</span>
			</div>
			<div style={{position: 'absolute', top: 505, left: 80, opacity: fadeIn(f, 18, 8), fontFamily: inter, fontWeight: 800, fontSize: 42, color: C.cream, borderLeft: `8px solid ${C.amber}`, paddingLeft: 22, whiteSpace: 'nowrap'}}>
				Ücretsiz kargo · Kapıda ödeme
			</div>
		</>
	);
};
