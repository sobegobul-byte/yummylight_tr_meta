// YZ_avuc_v1 · Stil: Telefon notu. Efektsiz elde çekim, yazılar beyaz not kartında harf harf yazılır.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {F} from './fonts';
import {Shots, fadeIn, s} from './common';

const inter = F.inter;

const Note: React.FC<{lines: {t: string; w?: number; c?: string}[]; at?: number; cps?: number}> = ({lines, at = 0, cps = 28}) => {
	const f = useCurrentFrame();
	const pop = interpolate(f, [at, at + 8], [0.92, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
	const total = lines.reduce((a, l) => a + l.t.length, 0);
	const shown = Math.floor(Math.max(0, f - at - 4) * (cps / 30));
	let left = shown;
	const caretOn = Math.floor(f / 15) % 2 === 0;
	return (
		<div style={{position: 'absolute', top: 170, left: 56, right: 56, opacity: fadeIn(f, at, 6), transform: `scale(${pop})`, transformOrigin: '50% 0%'}}>
			<div style={{background: 'rgba(255,255,255,0.96)', borderRadius: 34, padding: '26px 40px 36px', boxShadow: '0 20px 60px rgba(0,0,0,0.35)'}}>
				<div style={{fontFamily: inter, fontWeight: 600, fontSize: 30, color: '#E0A100', marginBottom: 12, display: 'flex', justifyContent: 'space-between'}}>
					<span>‹ Notlar</span>
					<span style={{color: '#B8B8B8', fontWeight: 400}}>Bugün</span>
				</div>
				{lines.map((l, i) => {
					const n = Math.max(0, Math.min(l.t.length, left));
					left -= l.t.length;
					const typing = n < l.t.length && n > 0;
					const isLastTyped = shown >= total && i === lines.length - 1;
					return (
						<div key={i} style={{fontFamily: inter, fontWeight: l.w ?? 600, fontSize: i === 0 ? 76 : 56, lineHeight: 1.18, color: l.c ?? '#111', minHeight: i === 0 ? 90 : 66}}>
							{l.t.slice(0, n)}
							{(typing || isLastTyped) && caretOn ? <span style={{color: '#E0A100', fontWeight: 400}}>|</span> : null}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export const V3Avuc: React.FC = () => (
	<AbsoluteFill style={{background: '#000'}}>
		<Shots
			shots={[
				{id: '4191', start: 0.0, dur: 2.5, zoom: [1.0, 1.03]},
				{id: '4189', start: 1.6, dur: 2.5, zoom: [1.0, 1.03]},
				{id: '4189', start: 5.0, dur: 2.0, zoom: [1.04, 1.08]},
				{id: '4153', start: 2.0, dur: 2.0, zoom: [1.0, 1.05]},
			]}
		/>
		<Sequence durationInFrames={s(2.5)}>
			<Note lines={[{t: 'Avucuna sığan bir anı ✨', w: 800}]} cps={60} />
		</Sequence>
		<Sequence from={s(2.5)} durationInFrames={s(2.5)}>
			<Note lines={[{t: 'El büyüklüğünde', w: 800}, {t: 'masana, komodinine,', w: 400}, {t: 'tam başucuna', w: 400}]} cps={34} />
		</Sequence>
		<Sequence from={s(5.0)} durationInFrames={s(2.0)}>
			<Note cps={48} lines={[{t: 'Fotoğrafından yapıldı', w: 800}, {t: 'Hızlı kargo', w: 400, c: '#555'}, {t: 'Peşin fiyatına 3 taksit', w: 400, c: '#555'}]} />
		</Sequence>
		<Sequence from={s(7.0)}>
			<Note lines={[{t: 'Fotoğrafını yükle ↓', w: 800}, {t: 'Ücretsiz kargo', w: 600, c: '#C98A00'}, {t: 'Kapıda ödeme', w: 600, c: '#C98A00'}]} cps={40} />
		</Sequence>
		<Audio src={staticFile('audio/v3.wav')} />
	</AbsoluteFill>
);
