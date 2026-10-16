// YH_ani_v1 · Stil: TikTok yerli altyazı. Tek AI planı (Seedance 2.5, geniş → yakın itme), üstte beyaz gölgeli hook,
// ortada cam efektli küçük teklif şeridi, sonda bulanık zemin üstüne çağrı. Ses: Seedance'in ürettiği sakin müzik.
import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {F} from './fonts';
import {fadeIn, fadeOut, s} from './common';
import track from './y6track.json';

// Seedance lambadaki 'tanıştığımız' kelimesini bozdu. Yazı bloğu kare kare izlendi (y6track.json: ölçek, x, y; 480x854 kaynakta),
// üstü lamba camı rengiyle örtülüp dört satır temiz yazıyla yeniden basılıyor.
const K = 1080 / 480;
const LampText: React.FC = () => {
	const f = useCurrentFrame();
	const [sc, x, y] = (track as number[][])[Math.min(f, track.length - 1)];
	const u = sc * K;
	const line = (top: number, size: number, txt: string) => (
		<div style={{position: 'absolute', top: top * u, left: 0, width: 160 * u, textAlign: 'center', fontFamily: F.bodoni, fontWeight: 400, fontSize: size * u, lineHeight: 1, whiteSpace: 'nowrap', color: '#FFE6C4', textShadow: `0 0 ${3 * u}px rgba(255,190,110,0.9), 0 0 ${8 * u}px rgba(255,160,80,0.5)`}}>{txt}</div>
	);
	return (
		<div style={{position: 'absolute', left: x * K, top: y * K, width: 160 * u, height: 78 * u}}>
			<div style={{position: 'absolute', left: -6 * u, top: 1 * u, width: 172 * u, height: 77 * u, borderRadius: 10 * u, background: 'rgba(122,82,54,0.93)', boxShadow: `0 0 ${6 * u}px ${4 * u}px rgba(122,82,54,0.85)`, backdropFilter: `blur(${4 * u}px)`}} />
			{line(5, 15, 'Seninle tanıştığımız gece')}
			{line(23, 15, 'İstanbul')}
			{line(42, 14, '22.12.2018 · 21:30')}
			{line(60, 14, '41.0082°K · 28.9784°D')}
		</div>
	);
};


const TT: React.CSSProperties = {
	fontFamily: F.inter,
	fontWeight: 800,
	color: '#fff',
	textShadow: '0 0 2px #000, 0 2px 4px rgba(0,0,0,0.9), 0 6px 18px rgba(0,0,0,0.6)',
	textAlign: 'center',
};

// Kelime kelime beliren hook (TikTok otomatik altyazı hissi)
const Hook: React.FC<{lines: string[][]; at: number; out: number}> = ({lines, at, out}) => {
	const f = useCurrentFrame();
	let k = 0;
	return (
		<div style={{position: 'absolute', top: 290, left: 70, right: 70, opacity: fadeOut(f, out, 8)}}>
			{lines.map((ws, i) => (
				<div key={i} style={{...TT, fontSize: 62, lineHeight: 1.22}}>
					{ws.map((w, j) => {
						const t = at + k++ * 3;
						const o = fadeIn(f, t, 4);
						const y = interpolate(f, [t, t + 5], [14, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
						return (
							<span key={j} style={{display: 'inline-block', opacity: o, transform: `translateY(${y}px)`, marginRight: 16}}>
								{w}
							</span>
						);
					})}
				</div>
			))}
		</div>
	);
};

export const Y6Ani: React.FC = () => {
	const f = useCurrentFrame();
	const END = s(7.4);
	const blur = interpolate(f, [END, END + 12], [0, 14], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const dim = interpolate(f, [END, END + 12], [0, 0.45], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const offer = Math.min(fadeIn(f, s(5), 10), fadeOut(f, END, 8));
	const endO = fadeIn(f, END + 6, 10);
	const endY = interpolate(f, [END + 6, END + 18], [30, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const arrow = Math.sin((f - END) / 5) * 8;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<AbsoluteFill style={{filter: `blur(${blur}px)`, transform: `scale(${1 + blur / 400})`}}>
				<OffthreadVideo muted src={staticFile('ai/YH_ani_raw.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
				<LampText />
			</AbsoluteFill>
			<AbsoluteFill style={{background: `rgba(10,6,18,${dim})`}} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 30%)'}} />
			<Hook
				at={s(0.15)}
				out={s(4.6)}
				lines={[
					['Sevgilimin'],
					['“seninle', 'tanıştığımız', 'gece'],
					['yıldızlar', 'böyleydi”'],
					['diyerek', 'verdiği', 'hediye'],
				]}
			/>
			<div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: offer}}>
				<div style={{fontFamily: F.inter, fontWeight: 600, fontSize: 36, color: '#fff', padding: '16px 30px', borderRadius: 40, background: 'rgba(20,14,30,0.42)', border: '1px solid rgba(255,255,255,0.35)', backdropFilter: 'blur(8px)', textShadow: '0 2px 6px rgba(0,0,0,0.6)'}}>
					Ücretsiz kargo · Kapıda ödeme · Peşin fiyatına 3 taksit
				</div>
			</div>
			<div style={{position: 'absolute', top: 560, left: 60, right: 60, opacity: endO, transform: `translateY(${endY}px)`}}>
				<div style={{...TT, fontSize: 84, lineHeight: 1.12}}>
					Kendi gecenizin
					<br />
					gökyüzü
				</div>
				<div style={{...TT, fontSize: 90, marginTop: 10, transform: `translateY(${arrow}px)`}}>↓</div>
				<div style={{display: 'flex', justifyContent: 'center', marginTop: 18}}>
					<div style={{fontFamily: F.inter, fontWeight: 800, fontSize: 52, color: '#1A1226', background: '#fff', padding: '18px 48px', borderRadius: 18, boxShadow: '0 10px 30px rgba(0,0,0,0.45)'}}>Tarihini seç</div>
				</div>
				<div style={{fontFamily: F.inter, fontWeight: 600, fontSize: 32, color: '#fff', textAlign: 'center', marginTop: 28, textShadow: '0 2px 8px rgba(0,0,0,0.8)'}}>
					Ücretsiz kargo · Kapıda ödeme · Peşin fiyatına 3 taksit
				</div>
			</div>
			<Audio src={staticFile('ai/YH_ani_raw.mp4')} volume={(fr) => interpolate(fr, [0, 8, s(9.4), s(10)], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
		</AbsoluteFill>
	);
};
