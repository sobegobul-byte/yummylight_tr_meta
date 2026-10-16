// YH_ani_v3 · yeni ürün referansı (urun_v2b, yazı akriliğin içinde) + mekan.png, Seedance 2.5 480p. v2 ile aynı yazı/gren düzeni. Stil: TikTok yerli altyazı. Tek AI planı (Seedance 2.5, geniş → yakın itme), üstte beyaz gölgeli hook,
// ortada cam efektli küçük teklif şeridi, sonda bulanık zemin üstüne çağrı. Ses: Seedance'in ürettiği sakin müzik.
import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {F} from './fonts';
import {fadeIn, fadeOut, s} from './common';
import track from './y7track.json'; // OVERLAY=true olursa y8track.json ile değiştir

// v2: Seedance lambayı yazısız üretti. Yıldız bandı kare kare izlendi (y7track.json: ölçek, x, y; 720x1280 kaynakta,
// ölçek birlesik_yakin görseline göre). Yazı yama olmadan, kazıma parlaması ve hafif blur ile camın üstüne basılıyor.
const K = 1080 / 480;
const OVERLAY = false; // Seedance lamba yazısını bozarsa true yap ve y8track.json üret
const LampText: React.FC = () => {
	const f = useCurrentFrame();
	const [sc, x, y] = (track as number[][])[Math.min(f, track.length - 1)];
	const u = sc * K;
	const line = (cy: number, size: number, txt: string) => (
		<div style={{position: 'absolute', top: (cy - size * 0.62) * u, left: -200 * u, width: 400 * u, textAlign: 'center', fontFamily: F.lora, fontWeight: 500, fontSize: size * u, lineHeight: 1.2, whiteSpace: 'nowrap', color: '#FFF3E2', mixBlendMode: 'screen', filter: `blur(${0.25 * u}px)`, textShadow: `0 0 ${1.2 * u}px rgba(255,214,160,0.95), 0 0 ${4 * u}px rgba(255,170,90,0.75), 0 0 ${10 * u}px rgba(255,150,70,0.35)`}}>{txt}</div>
	);
	return (
		<div style={{position: 'absolute', left: (x + 127 * sc) * K, top: y * K, width: 0, height: 0}}>
			{line(GEO[0], SZ, 'Seninle tanıştığımız gece')}
			{line(GEO[1], SZ, 'İstanbul')}
			{line(GEO[2], SZ, '22.12.2018 • 21:30')}
			{line(GEO[3], SZ, '41.0082°K • 28.9784°D')}
		</div>
	);
};
const GEO = [105, 128, 151, 176];
const SZ = 17.5;

// Film greni: her karede değişen ince gürültü, AI görüntüsüyle yazıları aynı dokuya oturtur
const Grain: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{mixBlendMode: 'overlay', opacity: 0.16, pointerEvents: 'none'}}>
			<svg width="1080" height="1920">
				<filter id="g">
					<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 24} />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="1080" height="1920" filter="url(#g)" />
			</svg>
		</AbsoluteFill>
	);
};

const TT: React.CSSProperties = {
	filter: 'blur(0.7px)',
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
		<div style={{position: 'absolute', top: 255, left: 70, right: 70, opacity: fadeOut(f, out, 8)}}>
			{lines.map((ws, i) => (
				<div key={i} style={{...TT, fontSize: 58, lineHeight: 1.2}}>
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

export const Y8AniV3: React.FC = () => {
	const f = useCurrentFrame();
	const END = s(8.0);
	const blur = interpolate(f, [END, END + 12], [0, 14], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const dim = interpolate(f, [END, END + 12], [0, 0.45], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const offer = Math.min(fadeIn(f, s(5), 10), fadeOut(f, END, 8));
	const endO = fadeIn(f, END + 6, 10);
	const endY = interpolate(f, [END + 6, END + 18], [30, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const arrow = Math.sin((f - END) / 5) * 8;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<AbsoluteFill style={{filter: `blur(${blur}px)`, transform: `scale(${1 + blur / 400})`}}>
				<OffthreadVideo muted src={staticFile('ai/YH_ani_v3_raw.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
				{OVERLAY && <LampText />}
			</AbsoluteFill>
			<AbsoluteFill style={{background: `rgba(10,6,18,${dim})`}} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 30%)'}} />
			{/* v3: lamba hook'un altına kadar büyüdüğü için hook süresince ek koyu degrade */}
			<AbsoluteFill style={{opacity: fadeOut(f, s(4.6), 8), background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.3) 22%, rgba(0,0,0,0) 36%)'}} />
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
			<Grain />
			<Audio src={staticFile('ai/YH_ani_v3_raw.mp4')} volume={(fr) => interpolate(fr, [0, 8, s(9.4), s(10)], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
		</AbsoluteFill>
	);
};
