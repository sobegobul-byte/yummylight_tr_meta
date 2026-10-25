// YH 4'lü hook testi (25 Ekim) · Kling 4.0 1080p 10 sn, yazısız. Her videoda farklı hook, aynı teklif ve çağrı.
// Stil: TikTok yerli altyazı (11_YH). Ses: lofi.py ile sentezlenen lofi; "reveal" açılışında karanlık + tık sesi.
import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {F} from './fonts';
import {fadeIn, fadeOut, s} from './common';

export type Y9Props = {
	video: string;
	music: string;
	hook: string[][];
	hook2?: string[][]; // ikinci cümle (D hook'u: "…ama sizinki burada kaldı.")
	reveal?: boolean; // ilk 0,7 sn karanlık, tık ile lamba yanıyor
	blurBand?: [number, number][]; // set 2: kartpostallardaki anlamsız yazılar için üst bulanık bant, [saniye, yükseklik px] anahtarları
};

const TT: React.CSSProperties = {
	filter: 'blur(0.6px)',
	fontFamily: F.inter,
	fontWeight: 800,
	color: '#fff',
	textShadow: '0 0 2px #000, 0 2px 4px rgba(0,0,0,0.9), 0 6px 18px rgba(0,0,0,0.6)',
	textAlign: 'center',
};

const Words: React.FC<{lines: string[][]; at: number; out: number; top?: number}> = ({lines, at, out, top = 255}) => {
	const f = useCurrentFrame();
	let k = 0;
	return (
		<div style={{position: 'absolute', top, left: 70, right: 70, opacity: fadeOut(f, out, 8)}}>
			{lines.map((ws, i) => (
				<div key={i} style={{...TT, fontSize: 60, lineHeight: 1.2}}>
					{ws.map((w, j) => {
						const t = at + k++ * 3;
						const y = interpolate(f, [t, t + 5], [14, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
						return (
							<span key={j} style={{display: 'inline-block', opacity: fadeIn(f, t, 4), transform: `translateY(${y}px)`, marginRight: 16}}>
								{w}
							</span>
						);
					})}
				</div>
			))}
		</div>
	);
};

const Grain: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{mixBlendMode: 'overlay', opacity: 0.12, pointerEvents: 'none'}}>
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

const OFFER = 'Ücretsiz kargo · Kapıda ödeme · Peşin fiyatına 3 taksit';

export const Y9Hook: React.FC<Y9Props> = ({video, music, hook, hook2, reveal, blurBand}) => {
	const f = useCurrentFrame();
	const END = s(8.0);
	const HOOK_OUT = hook2 ? s(2.6) : s(4.6);
	const blur = interpolate(f, [END, END + 12], [0, 14], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const dim = interpolate(f, [END, END + 12], [0, 0.45], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const dark = reveal ? interpolate(f, [0, s(0.7), s(0.7) + 4, s(1.3)], [0.94, 0.94, 0.35, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
	const offer = Math.min(fadeIn(f, s(5), 10), fadeOut(f, END, 8));
	const endO = fadeIn(f, END + 6, 10);
	const endY = interpolate(f, [END + 6, END + 18], [30, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const arrow = Math.sin((f - END) / 5) * 8;
	const blurTop = blurBand ? interpolate(f, blurBand.map(([sec]) => s(sec)), blurBand.map(([, h]) => h), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<AbsoluteFill style={{filter: `blur(${blur}px)`, transform: `scale(${1 + blur / 400})`}}>
				<OffthreadVideo muted src={staticFile(video)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
				{blurTop > 0 && (
					<AbsoluteFill style={{height: blurTop, backdropFilter: 'blur(12px)', WebkitMaskImage: 'linear-gradient(180deg, #000 85%, transparent)'}} />
				)}
			</AbsoluteFill>
			<AbsoluteFill style={{background: `rgba(4,3,8,${dark})`}} />
			<AbsoluteFill style={{background: `rgba(10,6,18,${dim})`}} />
			<AbsoluteFill style={{opacity: fadeOut(f, s(4.6), 8), background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 22%, rgba(0,0,0,0) 38%)'}} />
			<Words lines={hook} at={s(0.15)} out={HOOK_OUT} />
			{hook2 && <Words lines={hook2} at={s(2.75)} out={s(4.6)} />}
			<div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: offer}}>
				<div style={{fontFamily: F.inter, fontWeight: 600, fontSize: 36, color: '#fff', padding: '16px 30px', borderRadius: 40, background: 'rgba(20,14,30,0.42)', border: '1px solid rgba(255,255,255,0.35)', backdropFilter: 'blur(8px)', textShadow: '0 2px 6px rgba(0,0,0,0.6)'}}>
					{OFFER}
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
				<div style={{fontFamily: F.inter, fontWeight: 600, fontSize: 32, color: '#fff', textAlign: 'center', marginTop: 28, textShadow: '0 2px 8px rgba(0,0,0,0.8)'}}>{OFFER}</div>
			</div>
			<Grain />
			<Audio src={staticFile(music)} volume={0.55} />
			{reveal && (
				<Sequence from={s(0.7) - 2}>
					<Audio src={staticFile('audio/tik.wav')} volume={0.9} />
				</Sequence>
			)}
		</AbsoluteFill>
	);
};
