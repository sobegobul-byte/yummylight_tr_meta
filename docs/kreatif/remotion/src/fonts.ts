// Fontlar public/fonts altında yerel; render sırasında internet gerekmez.
import {continueRender, delayRender, staticFile} from 'remotion';
import list from './fonts.json';

const handle = delayRender('fonts', {timeoutInMilliseconds: 120000});
Promise.all(
	(list as [string, string, string, string, string][]).map(([fam, style, weight, file, range]) => {
		const ff = new FontFace(fam, `url(${staticFile('fonts/' + file)}) format('woff2')`, {style, weight, unicodeRange: range});
		document.fonts.add(ff);
		return ff.load();
	}),
)
	.catch((e) => console.error('font', e))
	.finally(() => continueRender(handle));

export const F = {
	serif: 'Playfair Display',
	black: 'Archivo Black',
	bodoni: 'Bodoni Moda',
	inter: 'Inter',
	syne: 'Syne',
	mono: 'IBM Plex Mono',
	caveat: 'Caveat',
	fraunces: 'Fraunces',
	lora: 'Lora',
};
