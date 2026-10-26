// Atölye günlük paylaşım (26 Ekim) · Fatih'in iPhone çekimi IMG_9860 (4K HLG, tonemap yok). 10 sn organik.
// Stil: "atölye günlüğü" — sol üstte daktilo tarih damgası, ritme oturan hızlandırma, vuruşta küçük zoom, el yazısı etiketler.
// İsimli tabanların yakın planı (8,4-10,8 sn) kullanılmadı: müşteri adları ve soyadı okunuyor.
import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {F} from './fonts';
import {fadeIn, fadeOut, s} from './common';

const SRC = 'clips/IMG_9860.mp4';
const BEAT = 60 / 100; // atolye.wav 100 bpm

type Seg = {from: number; dur: number; start: number; rate: number; zoom: [number, number]; origin: string};
const SEGS: Seg[] = [
	{from: 0, dur: 3.0, start: 0.0, rate: 1, zoom: [1.12, 1.02], origin: '35% 60%'},
	{from: 3.0, dur: 3.4, start: 3.0, rate: 1.6, zoom: [1.0, 1.08], origin: '60% 60%'},
	{from: 6.4, dur: 3.6, start: 11.3, rate: 0.9, zoom: [1.04, 1.12], origin: '55% 62%'},
];

// İsimli taban yığını (müşteri adları) kaynakta kare kare elle işaretlendi: [kaynak karesi, x1, x2, y1, y2] (1080x1920)
const NAMES: number[][] = [
	[0, 830, 1100, 370, 870],
	[15, 770, 1100, 370, 870],
	[30, 650, 1100, 370, 760],
	[45, 505, 920, 380, 785],
	[60, 350, 790, 380, 785],
	[75, 220, 660, 400, 785],
	[90, 90, 530, 420, 785],
	[105, -20, 350, 420, 785],
	[120, -20, 190, 420, 785],
	[130, -20, -20, 420, 785],
	// geniş plan (11,3 sn sonrası)
	[338, 420, 720, 750, 1010],
	[339, 420, 720, 750, 1010],
	[354, 490, 740, 705, 935],
	[369, 485, 730, 665, 890],
	[384, 385, 650, 665, 890],
	[399, 235, 480, 685, 885],
	[414, 85, 350, 645, 865],
	[429, -20, 220, 625, 840],
	[440, -20, 120, 620, 835],
];
const NameBlur: React.FC<{src: number}> = ({src}) => {
	if (src > 130 && src < 338) return null;
	const k = (i: number) => interpolate(src, NAMES.map((r) => r[0]), NAMES.map((r) => r[i]), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const [x1, x2, y1, y2] = [k(1), k(2), k(3), k(4)];
	if (x2 - x1 < 4) return null;
	return <div style={{position: 'absolute', left: x1, top: y1, width: x2 - x1, height: y2 - y1, backdropFilter: 'blur(16px)', borderRadius: 30}} />;
};

const Clip: React.FC<{seg: Seg}> = ({seg}) => {
	const f = useCurrentFrame();
	const z = interpolate(f, [0, s(seg.dur)], seg.zoom, {extrapolateRight: 'clamp'});
	// vuruşta kısa "punch" zoom
	const beatF = s(BEAT);
	const k = (f % beatF) / beatF;
	const punch = 1 + 0.018 * Math.exp(-k * 6);
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `scale(${z * punch})`, transformOrigin: seg.origin}}>
				<OffthreadVideo muted src={staticFile(SRC)} startFrom={s(seg.start)} playbackRate={seg.rate} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.05) contrast(1.04)'}} />
				<NameBlur src={s(seg.start) + f * seg.rate} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// Kesmelerde beyaz flaş
const Flash: React.FC<{at: number}> = ({at}) => {
	const f = useCurrentFrame();
	const o = interpolate(f, [s(at) - 2, s(at), s(at) + 5], [0, 0.55, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return <AbsoluteFill style={{background: '#FFF4E3', opacity: o}} />;
};

const Stamp: React.FC = () => {
	const f = useCurrentFrame();
	const blink = Math.floor(f / 15) % 2 === 0;
	return (
		<div style={{position: 'absolute', top: 150, left: 64, display: 'flex', alignItems: 'center', gap: 14, fontFamily: F.mono, fontWeight: 700, fontSize: 30, color: '#fff', letterSpacing: 2, textShadow: '0 2px 8px rgba(0,0,0,0.7)', opacity: fadeIn(f, 3, 6)}}>
			<div style={{width: 16, height: 16, borderRadius: 8, background: '#FF4A3D', opacity: blink ? 1 : 0.25}} />
			26 EKİM · ATÖLYE
		</div>
	);
};

const TT: React.CSSProperties = {fontFamily: F.inter, fontWeight: 800, color: '#fff', textAlign: 'center', textShadow: '0 0 2px #000, 0 2px 4px rgba(0,0,0,0.9), 0 6px 18px rgba(0,0,0,0.6)'};

const Pop: React.FC<{at: number; out: number; children: React.ReactNode; top: number; size?: number; hand?: boolean; rot?: number}> = ({at, out, children, top, size = 64, hand, rot = 0}) => {
	const f = useCurrentFrame();
	const sc = interpolate(f, [s(at), s(at) + 6], [0.7, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2.2))});
	const o = Math.min(fadeIn(f, s(at), 4), fadeOut(f, s(out), 6));
	return (
		<div style={{position: 'absolute', top, left: 50, right: 50, opacity: o, transform: `scale(${sc}) rotate(${rot}deg)`}}>
			<div style={hand ? {...TT, fontFamily: F.caveat, fontWeight: 700, fontSize: size * 1.25, color: '#FFE2A8'} : {...TT, fontSize: size, lineHeight: 1.15}}>{children}</div>
		</div>
	);
};

export const AtolyeGunluk: React.FC = () => {
	const f = useCurrentFrame();
	const END = s(8.0);
	const blur = interpolate(f, [END, END + 12], [0, 12], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const dim = interpolate(f, [END, END + 12], [0, 0.42], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<AbsoluteFill style={{filter: `blur(${blur}px)`}}>
				{SEGS.map((sg, i) => (
					<Sequence key={i} from={s(sg.from)} durationInFrames={s(sg.dur)}>
						<Clip seg={sg} />
					</Sequence>
				))}
			</AbsoluteFill>
			<AbsoluteFill style={{background: `rgba(10,6,18,${dim})`}} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 32%)'}} />
			<Flash at={3.0} />
			<Flash at={6.4} />
			<Stamp />
			<Pop at={0.15} out={2.8} top={260}>
				Bugün atölyeden
				<br />
				çıkanlar
			</Pop>
			<Pop at={0.9} out={2.8} top={430} hand rot={-4}>
				hepsi yola çıkıyor
			</Pop>
			<Pop at={3.1} out={4.6} top={300} size={56}>
				Fotoğrafınızdan lamba
			</Pop>
			<Pop at={4.7} out={6.3} top={300} size={56}>
				Yıldız haritası lamba
			</Pop>
			<Pop at={6.5} out={7.9} top={280} size={60}>
				Her biri kişiye özel,
				<br />
				her biri tek tek
			</Pop>
			<Pop at={8.2} out={11} top={640} size={76}>
				Sıradaki
				<br />
				sizinki olsun
			</Pop>
			<Pop at={8.6} out={11} top={860} hand>
				link profilde
			</Pop>
			<Audio src={staticFile('audio/atolye.wav')} volume={0.7} />
		</AbsoluteFill>
	);
};
