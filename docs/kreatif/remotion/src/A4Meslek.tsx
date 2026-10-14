// ARABA_meslek_v1 · Stil: Teknik çizim / blueprint. Üst alanda ince ızgara, ölçü çizgileri çizilerek uzar, yazılar mono etiketlerle gelir.
// Hook: meslek gururu + kişi ("Direksiyonda geçen yıllar… başucunda ışığı olsun"). Hedef: şoför / operatör babalar ve kendileri.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {F} from './fonts';
import {C, Shots, Vignette, fadeIn, fadeOut, s} from './common';

const inter = F.inter;
const mono = F.mono;
const BP = '#9FD3FF';

// Üst alanda ızgara (yalnızca metin bölgesinde, lambayı kapatmaz)
const Grid: React.FC<{o: number}> = ({o}) => (
	<AbsoluteFill style={{opacity: o, height: 700, backgroundImage: `linear-gradient(rgba(159,211,255,0.16) 2px, transparent 2px), linear-gradient(90deg, rgba(159,211,255,0.16) 2px, transparent 2px)`, backgroundSize: '90px 90px', maskImage: 'linear-gradient(180deg, #000 0%, #000 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 60%, transparent 100%)'}} />
);

// Ölçü çizgisi: soldan sağa çizilir, ortada etiket
const Dim: React.FC<{at: number; top: number; label: string; out?: number}> = ({at, top, label, out = 9999}) => {
	const f = useCurrentFrame();
	const p = interpolate(f, [at, at + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const o = Math.min(fadeIn(f, at, 3), fadeOut(f, out, 6));
	return (
		<div style={{position: 'absolute', top, left: 80, right: 80, height: 40, opacity: o}}>
			<div style={{position: 'absolute', left: 0, top: 4, width: 3, height: 32, background: BP}} />
			<div style={{position: 'absolute', right: 0, top: 4, width: 3, height: 32, background: BP, opacity: p >= 1 ? 1 : 0}} />
			<div style={{position: 'absolute', left: 0, top: 19, height: 2, width: `${p * 100}%`, background: BP}} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center', opacity: fadeIn(f, at + 6, 5)}}>
				<span style={{fontFamily: mono, fontSize: 28, color: BP, background: 'rgba(8,20,38,0.9)', padding: '2px 16px', letterSpacing: 3}}>{label}</span>
			</div>
		</div>
	);
};

// Mono etiket + büyük yazı (çizim notu gibi)
const Note: React.FC<{at: number; out: number; top: number; tag?: string; size?: number; color?: string; children: React.ReactNode}> = ({at, out, top, tag, size = 92, color = C.cream, children}) => {
	const f = useCurrentFrame();
	const y = interpolate(f, [at, at + 8], [24, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	return (
		<div style={{position: 'absolute', top, left: 80, right: 60, opacity: Math.min(fadeIn(f, at, 6), fadeOut(f, out, 6)), transform: `translateY(${y}px)`}}>
			{tag && <div style={{fontFamily: mono, fontSize: 28, color: BP, letterSpacing: 4, marginBottom: 10}}>{tag}</div>}
			<div style={{fontFamily: inter, fontWeight: 800, fontSize: size, lineHeight: 1.05, letterSpacing: -1.5, color, textShadow: '0 4px 22px rgba(0,0,0,0.8)'}}>{children}</div>
		</div>
	);
};

// Köşe işaretleri (çizim kâğıdı çerçevesi)
const Corners: React.FC<{o: number}> = ({o}) => {
	const L = 56;
	const st = {position: 'absolute' as const, width: L, height: L, borderColor: BP, borderStyle: 'solid', opacity: o};
	return (
		<>
			<div style={{...st, top: 60, left: 50, borderWidth: '3px 0 0 3px'}} />
			<div style={{...st, top: 60, right: 50, borderWidth: '3px 3px 0 0'}} />
		</>
	);
};

export const A4Meslek: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Shots
				shots={[
					{id: '5690', start: 0.8, dur: 2.4, zoom: [1.12, 1.04], origin: '50% 20%'},
					{id: '5704', start: 0.3, dur: 1.4, zoom: [1.05, 1.12], origin: '50% 75%'},
					{id: '5698', start: 1.5, dur: 1.2, zoom: [1.1, 1.18], origin: '50% 70%', dim: 0.35},
					{id: '5567', start: 0.8, dur: 2.2, zoom: [1.08, 1.0], origin: '50% 75%'},
					{id: '5705', start: 0.6, dur: 1.8, zoom: [1.0, 1.06], origin: '50% 75%'},
				]}
			/>
			<Vignette a={0.5} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,16,32,0.85) 0%, rgba(6,16,32,0.4) 30%, rgba(0,0,0,0) 48%)'}} />
			<Grid o={0.9} />
			<Corners o={fadeIn(f, 0, 6)} />
			{/* Hook */}
			<Note at={2} out={s(2.3)} top={150} tag="PROJE: SENİN ARACIN" size={96}>
				Direksiyonda
				<br />
				geçen yıllar…
			</Note>
			<Dim at={14} out={s(2.3)} top={430} label="ÖLÇEK 1:1 · PLAKA DAHİL" />
			<Note at={s(2.4)} out={s(4.0)} top={150} tag="SONUÇ" size={96} color={C.amber}>
				başucunda
				<br />
				ışığı olsun.
			</Note>
			<Sequence from={s(4.1)} durationInFrames={s(2.6)}>
				<Mid />
			</Sequence>
			<Sequence from={s(6.7)}>
				<End />
			</Sequence>
			<Audio src={staticFile('audio/a4.wav')} />
		</AbsoluteFill>
	);
};

const Mid: React.FC = () => {
	const f = useCurrentFrame();
	const rows = ['Tır · Kamyon · İş makinesi', 'Firma adın, plakan, ismin'];
	return (
		<div style={{opacity: fadeOut(f, s(2.4), 6)}}>
			<Note at={0} out={9999} top={150} tag="ÜRETİM" size={74}>
				Fotoğrafından birebir
				<br />
				çizilir, lazerle kesilir.
			</Note>
			{rows.map((r, i) => (
				<div key={r} style={{position: 'absolute', top: 380 + i * 62, left: 80, fontFamily: mono, fontSize: 36, color: C.cream, opacity: fadeIn(f, 10 + i * 6, 5), textShadow: '0 2px 12px rgba(0,0,0,0.9)'}}>
					<span style={{color: BP}}>{String(i + 1).padStart(2, '0')} ─ </span>
					{r}
				</div>
			))}
			<div style={{position: 'absolute', top: 530, left: 80, fontFamily: inter, fontWeight: 600, fontSize: 44, color: C.cream, opacity: fadeIn(f, 26, 8), textShadow: '0 3px 16px rgba(0,0,0,0.85)', whiteSpace: 'nowrap'}}>
				Hızlı kargo · Peşin fiyatına 3 taksit
			</div>
		</div>
	);
};

const End: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,16,32,0.85) 0%, rgba(0,0,0,0) 55%)', opacity: fadeIn(f, 0, 8)}} />
			<Note at={2} out={9999} top={150} tag="SIRADAKİ PROJE" size={100}>
				Aracının fotoğrafını
				<br />
				<span style={{color: C.amber}}>yükle ↓</span>
			</Note>
			<Dim at={12} top={440} label="ŞOFÖR BABANA HEDİYE" />
			<div style={{position: 'absolute', top: 510, left: 80, opacity: fadeIn(f, 20, 8), fontFamily: mono, fontWeight: 700, fontSize: 38, color: BP, border: `3px solid ${BP}`, background: 'rgba(8,20,38,0.85)', padding: '12px 24px', whiteSpace: 'nowrap'}}>
				ÜCRETSİZ KARGO · KAPIDA ÖDEME
			</div>
		</>
	);
};
