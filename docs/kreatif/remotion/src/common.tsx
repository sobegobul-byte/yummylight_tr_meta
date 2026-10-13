import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';

export const FPS = 30;
export const C = {amber: '#FFB54A', cream: '#FFF4E3', night: '#0E0B16'};
export const s = (sec: number) => Math.round(sec * FPS);

// Tek klip: kaynaktan `start` saniyeden başlar, hafif yaklaşma yapar
export const Clip: React.FC<{id: string; start: number; zoom?: [number, number]; dim?: number; origin?: string}> = ({id, start, zoom = [1, 1.06], dim = 0, origin = '50% 55%'}) => {
	const f = useCurrentFrame();
	const sc = interpolate(f, [0, 90], zoom, {extrapolateRight: 'extend'});
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
			<OffthreadVideo muted src={staticFile(`clips/IMG_${id}.mp4`)} startFrom={s(start)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${sc})`, transformOrigin: origin}} />
			{dim > 0 && <AbsoluteFill style={{background: `rgba(0,0,0,${dim})`}} />}
		</AbsoluteFill>
	);
};

export type Shot = {id: string; start: number; dur: number; zoom?: [number, number]; dim?: number; origin?: string};
// Klipleri arka arkaya dizer; sonuncu kare donmasın diye son klip dur kadar oynar
export const Shots: React.FC<{shots: Shot[]}> = ({shots}) => {
	let t = 0;
	return (
		<>
			{shots.map((sh, i) => {
				const from = s(t);
				t += sh.dur;
				return (
					<Sequence key={i} from={from} durationInFrames={s(sh.dur)}>
						<Clip id={sh.id} start={sh.start} zoom={sh.zoom} dim={sh.dim} origin={sh.origin} />
					</Sequence>
				);
			})}
		</>
	);
};

// Üstte okunabilirlik için koyu degrade
export const TopShade: React.FC<{h?: number; a?: number}> = ({h = 55, a = 0.55}) => (
	<AbsoluteFill style={{background: `linear-gradient(180deg, rgba(8,6,14,${a}) 0%, rgba(8,6,14,0) ${h}%)`}} />
);

export const fadeIn = (f: number, at: number, len = 8) => interpolate(f, [at, at + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
export const fadeOut = (f: number, at: number, len = 8) => interpolate(f, [at, at + len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
