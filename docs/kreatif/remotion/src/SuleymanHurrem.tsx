// Süleyman & Hürrem yıldız haritası reklamı (31 Ekim) · Seedance 2.5, 480p, 25 sn, Fatih'in üretimi.
// Ses tamamen yenilendi: ElevenLabs v3 (Orçun Togan = Süleyman, Gökçe Deniz = Hürrem + kapanış) + sentez yaylı/kanun altlığı (suleyman_mix.wav).
// Son sahnede yapay zekânın bozduğu iki yazı kapatıldı: üstteki çağrı yazısı ve lambadaki gravür. Yerlerine temiz yazı konur, gravür lambanın yaklaşmasını takip eder.
import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {F} from './fonts';
import {FPS} from './common';

const SLOW_AT = 24.0; // son 1 sn yavaşlatılır, kapanış cümlesine yer açılır
const SLOW_RATE = 0.58;
export const SH_DUR = 25.8;
const srcT = (t: number) => (t < SLOW_AT ? t : SLOW_AT + (t - SLOW_AT) * SLOW_RATE);

// Lamba gravürü, 480x854 kaynakta elle ölçüldü: [kaynak sn, merkez x, başlık y, başlık genişliği, son satır y]
const ENG: number[][] = [
	[20.15, 218.2, 548.8, 165, 593.5],
	[20.4, 218, 550, 166, 595],
	[21.6, 217.5, 556, 172, 603],
	[22.8, 216, 562.5, 179.5, 611],
	[24.0, 216, 567.5, 185, 618],
	[25.05, 215.5, 572.5, 191, 624],
];
const K = 1080 / 480;

const Engraving: React.FC<{st: number}> = ({st}) => {
	if (st < 20.15) return null;
	const k = (i: number) => interpolate(st, ENG.map((r) => r[0]), ENG.map((r) => r[i]), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const cx = k(1) * K;
	const ty = k(2) * K;
	const w = k(3) * K;
	const ly = k(4) * K;
	const top = ty - 0.085 * w;
	const bottom = ly + 0.1 * w;
	const gap = (ly - ty) / 3;
	const line = (y: number, size: number, txt: string, weight = 500) => (
		<div style={{position: 'absolute', left: cx - w, width: 2 * w, top: y - size * 0.62, textAlign: 'center', fontFamily: F.lora, fontWeight: weight, fontSize: size, lineHeight: 1.2, color: '#FFF3E0', textShadow: '0 0 6px rgba(255,190,110,0.9), 0 0 14px rgba(255,160,70,0.55)'}}>{txt}</div>
	);
	return (
		<>
			<div
				style={{
					position: 'absolute',
					left: cx - 0.72 * w,
					width: 1.44 * w,
					top,
					height: bottom - top,
					backdropFilter: 'blur(9px)',
					background: 'rgba(58,30,14,0.55)',
					WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 70%, transparent 100%)',
				}}
			/>
			{line(ty, w * 0.11, 'Süleyman & Hürrem', 600)}
			{line(ty + gap, w * 0.072, 'Seni ilk gördüğüm gece')}
			{line(ty + 2 * gap, w * 0.064, 'İstanbul · 1520 civarı')}
			{line(ty + 3 * gap, w * 0.064, '41.0111° K · 28.9642° D')}
		</>
	);
};

// Üstteki bozuk çağrı yazısı (kaynakta 23,0 sn'de beliriyor) bulanık bir şeritle kapanır, üstüne temiz yazı gelir
const Cta: React.FC<{t: number}> = ({t}) => {
	const band = interpolate(t, [22.5, 22.85], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const txt = interpolate(t, [22.75, 23.15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const y = interpolate(t, [22.75, 23.15], [16, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	if (band <= 0) return null;
	const sh = '0 2px 6px rgba(0,0,0,0.85), 0 0 18px rgba(0,0,0,0.5)';
	return (
		<>
			<div style={{position: 'absolute', left: 30, right: 30, top: 340, height: 280, opacity: band, backdropFilter: 'blur(18px)', background: 'rgba(14,8,6,0.32)', WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 62%, transparent 100%)'}} />
			<div style={{position: 'absolute', left: 40, right: 40, top: 378, textAlign: 'center', opacity: txt, transform: `translateY(${y}px)`}}>
				<div style={{fontFamily: F.serif, fontStyle: 'italic', fontWeight: 600, fontSize: 54, color: '#FFE2A8', textShadow: sh}}>Yıldız haritanı ücretsiz önizle</div>
				<div style={{fontFamily: F.inter, fontWeight: 800, fontSize: 60, color: '#fff', marginTop: 10, textShadow: sh}}>yummylightstore.com</div>
				<div style={{fontFamily: F.inter, fontWeight: 500, fontSize: 32, color: '#fff', marginTop: 8, opacity: 0.9, textShadow: sh}}>Profildeki link</div>
			</div>
		</>
	);
};

export const SuleymanHurrem: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / FPS;
	const st = srcT(t);
	const vid = {width: '100%', height: '100%', objectFit: 'cover'} as const;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Sequence durationInFrames={Math.round(SLOW_AT * FPS)}>
				<OffthreadVideo muted src={staticFile('clips/suleyman_src.mp4')} style={vid} />
			</Sequence>
			<Sequence from={Math.round(SLOW_AT * FPS)}>
				<OffthreadVideo muted src={staticFile('clips/suleyman_src.mp4')} startFrom={Math.round(SLOW_AT * FPS)} playbackRate={SLOW_RATE} style={vid} />
			</Sequence>
			<Engraving st={st} />
			<Cta t={t} />
			<Audio src={staticFile('audio/suleyman_mix.wav')} />
		</AbsoluteFill>
	);
};
