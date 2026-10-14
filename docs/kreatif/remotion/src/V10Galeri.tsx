// YZ_galeri_v1 · Stil: Karaoke vurgusu. Cümle baştan soluk yazılı durur, kelimeler okundukça sıcak sarıya boyanır.
// Hook: kayıp korkusu + tamamlanmamış iş ("Galerinde binlerce fotoğraf var… en güzeli orada kaybolmasın").
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {F} from './fonts';
import {C, END_L1, END_L2, END_PILL, MID_L1, MID_L2, MID_TAG, NIGHT, Shots, Vignette, fadeIn, fadeOut, s} from './common';

const caveat = F.caveat;
const inter = F.inter;

// words: kelime listesi, at: başlangıç (kare), per: kelime başına kare
const Karaoke: React.FC<{words: string[]; at: number; per: number; out: number; top: number; size: number; hot?: number[]}> = ({words, at, per, out, top, size, hot = []}) => {
	const f = useCurrentFrame();
	return (
		<div style={{position: 'absolute', top, left: 70, right: 70, textAlign: 'center', opacity: Math.min(fadeIn(f, at - 4, 4), fadeOut(f, out, 6)), fontFamily: inter, fontWeight: 800, fontSize: size, lineHeight: 1.1, letterSpacing: -1}}>
			{words.map((w, i) => {
				const p = interpolate(f, [at + i * per, at + i * per + 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
				const isHot = hot.includes(i);
				const col = p >= 1 ? (isHot ? C.amber : C.cream) : `rgba(255,244,227,${0.28 + p * 0.5})`;
				return (
					<span key={i} style={{color: col, textShadow: p >= 1 && isHot ? `0 0 30px ${C.amber}99, 0 4px 20px rgba(0,0,0,0.7)` : '0 4px 20px rgba(0,0,0,0.7)'}}>
						{w}{' '}
					</span>
				);
			})}
		</div>
	);
};

export const V10Galeri: React.FC = () => {
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Shots
				shots={[
					{id: '4204', start: 0.2, dur: 2.2, zoom: [1.1, 1.02]},
					{id: '4208', start: 0.6, dur: 2.2, zoom: [1.0, 1.06], grade: NIGHT},
					{id: '4190', start: 4.2, dur: 2.0, zoom: [1.0, 1.04], dim: 0.3},
					{id: '4202', start: 1.5, dur: 2.6, zoom: [1.06, 1.0]},
				]}
			/>
			<Vignette a={0.6} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 48%)'}} />
			<Karaoke words={['Galerinde', 'binlerce', 'fotoğraf', 'var…']} at={2} per={7} out={s(2.25)} top={210} size={110} hot={[1]} />
			<Karaoke words={['En', 'güzeli', 'orada', 'kaybolmasın.']} at={s(2.4)} per={7} out={s(4.3)} top={210} size={110} hot={[3]} />
			<Sequence from={s(4.4)} durationInFrames={s(2.0)}>
				<Mid />
			</Sequence>
			<Sequence from={s(6.4)}>
				<End />
			</Sequence>
			<Audio src={staticFile('audio/v10.wav')} />
		</AbsoluteFill>
	);
};

const Mid: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<>
			<Karaoke words={['Her', 'gece', 'başucunda', 'yansın.']} at={0} per={5} out={s(1.85)} top={180} size={104} hot={[2]} />
			<div style={{position: 'absolute', top: 520, width: '100%', textAlign: 'center', opacity: Math.min(fadeIn(f, 18, 6), fadeOut(f, s(1.85), 6)), fontFamily: caveat, fontWeight: 700, fontSize: 76, lineHeight: 1.05, color: C.amber, transform: 'rotate(-3deg)', textShadow: '0 3px 14px rgba(0,0,0,0.8)'}}>
				{MID_TAG}:
				<br />
				{MID_L1.toLocaleLowerCase('tr')} {MID_L2}
			</div>
		</>
	);
};

const End: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 55%)', opacity: fadeIn(f, 0, 8)}} />
			<Karaoke words={END_L1.split(' ').concat(END_L2.split(' '))} at={4} per={4} out={9999} top={170} size={104} hot={[2, 3, 4]} />
			<div style={{position: 'absolute', top: 470, width: '100%', textAlign: 'center', opacity: fadeIn(f, 24, 8)}}>
				<span style={{fontFamily: inter, fontWeight: 800, fontSize: 40, color: C.night, background: C.cream, padding: '14px 32px', borderRadius: 60, whiteSpace: 'nowrap'}}>{END_PILL}</span>
			</div>
		</>
	);
};
