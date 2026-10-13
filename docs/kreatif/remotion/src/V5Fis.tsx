// YZ_fis_v1 · Stil: Sipariş fişi. Krem kâğıt şerit yukarıdan iner, satırlar yazar kasa gibi tek tek basılır.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {F} from './fonts';
import {C, Shots, fadeIn, fadeOut, s} from './common';

const mono = F.mono;

type Row = {l: string; r?: string; b?: boolean; big?: boolean; hr?: boolean};
const ROWS: Row[] = [
	{l: 'YUMMY LIGHT', b: true},
	{l: 'SİPARİŞ FİŞİ'},
	{hr: true, l: ''},
	{l: '1 x fotoğrafın'},
	{l: '→ ışıklı gece lambası', b: true},
	{hr: true, l: ''},
	{l: 'KARGO', r: '0 TL', b: true, big: true},
	{l: 'ÖDEME', r: 'KAPIDA', b: true, big: true},
	{l: 'TAKSİT', r: '3 (peşin fiyatına)'},
	{l: 'TESLİMAT', r: 'hızlı kargo'},
];

const Receipt: React.FC<{startRow?: number; rowEvery?: number}> = ({rowEvery = 6}) => {
	const f = useCurrentFrame();
	const drop = interpolate(f, [0, 10], [-260, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const shown = Math.floor((f - 6) / rowEvery) + 1;
	return (
		<div style={{position: 'absolute', top: 100, left: 60, right: 60, transform: `translateY(${drop}px) rotate(-1.2deg)`}}>
			<div style={{background: '#FBF5E8', padding: '34px 44px 40px', boxShadow: '0 24px 60px rgba(0,0,0,0.45)', fontFamily: mono, color: '#1D1A16'}}>
				{ROWS.map((r, i) => {
					if (i >= shown) return <div key={i} style={{height: r.hr ? 22 : r.big ? 76 : 56}} />;
					if (r.hr) return <div key={i} style={{borderTop: '3px dashed #9C9283', margin: '9px 0 10px'}} />;
					const center = !r.r;
					return (
						<div key={i} style={{display: 'flex', justifyContent: center ? 'center' : 'space-between', fontWeight: r.b ? 700 : 400, fontSize: r.big ? 64 : 42, lineHeight: r.big ? '76px' : '56px', letterSpacing: center ? 2 : 0}}>
							<span>{r.l}</span>
							{r.r && <span style={{color: r.big ? '#B86E00' : '#1D1A16'}}>{r.r}</span>}
						</div>
					);
				})}
			</div>
			{/* Yırtık kenar */}
			<div style={{height: 22, background: 'linear-gradient(135deg, #FBF5E8 33%, transparent 33%) 0 0 / 28px 28px, linear-gradient(225deg, #FBF5E8 33%, transparent 33%) 0 0 / 28px 28px'}} />
		</div>
	);
};

export const V5Fis: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Shots
				shots={[
					{id: '4183', start: 0.0, dur: 3.0, zoom: [1.0, 1.04]},
					{id: '4185', start: 3.5, dur: 3.5, zoom: [1.0, 1.08]},
					{id: '4186', start: 3.8, dur: 2.5, zoom: [1.0, 1.05]},
				]}
			/>
			{/* Hook: fiş basılmadan önce tek satır */}
			<Sequence durationInFrames={s(0.9)}>
				<Hook />
			</Sequence>
			<Sequence from={s(0.8)} durationInFrames={s(4.6)}>
				<div style={{opacity: fadeOut(f - s(0.8), s(4.3), 6)}}>
					<Receipt />
				</div>
			</Sequence>
			<Sequence from={s(6.5)}>
				<End />
			</Sequence>
			<Audio src={staticFile('audio/v5.wav')} />
		</AbsoluteFill>
	);
};

const Hook: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<div style={{position: 'absolute', top: 260, width: '100%', textAlign: 'center', fontFamily: mono, fontWeight: 700, fontSize: 92, color: '#FBF5E8', lineHeight: 1.15, opacity: fadeIn(f, 0, 3), textShadow: '0 4px 20px rgba(0,0,0,0.8)'}}>
			Kargo 0 TL.
			<br />
			<span style={{color: C.amber}}>Ödeme kapıda.</span>
		</div>
	);
};

const End: React.FC = () => {
	const f = useCurrentFrame();
	const drop = interpolate(f, [0, 10], [-200, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	return (
		<div style={{position: 'absolute', top: 130, left: 80, right: 80, transform: `translateY(${drop}px) rotate(1deg)`, opacity: fadeIn(f, 0, 5)}}>
			<div style={{background: '#FBF5E8', padding: '36px 40px', boxShadow: '0 24px 60px rgba(0,0,0,0.45)', fontFamily: mono, color: '#1D1A16', textAlign: 'center'}}>
				<div style={{fontSize: 40, letterSpacing: 2}}>SIRADAKİ ADIM</div>
				<div style={{borderTop: '3px dashed #9C9283', margin: '16px 0'}} />
				<div style={{fontWeight: 700, fontSize: 88, lineHeight: 1.12}}>
					Fotoğrafını
					<br />
					yükle ↓
				</div>
				<div style={{borderTop: '3px dashed #9C9283', margin: '16px 0'}} />
				<div style={{fontSize: 42, color: '#B86E00', fontWeight: 700}}>Ücretsiz kargo · Kapıda ödeme</div>
			</div>
		</div>
	);
};
