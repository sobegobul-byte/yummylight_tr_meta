"""4 yıldız haritası videosu için 10 sn lofi müzik (telifsiz, kodla sentezlenir).
Kullanım: python3 lofi.py  ->  public/audio/lofi1..lofi4.wav
"""
import wave, pathlib
import numpy as np

SR = 44100
DUR = 10.0
N = int(SR * DUR)


def lowpass(x, a):
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a * (x[i] - acc)
        y[i] = acc
    return y


def rhodes(freq, start, length, amp):
    """Yumuşak elektrik piyano: hafif tremolo, yavaş sönüm."""
    out = np.zeros(N)
    a, b = int(start * SR), min(N, int((start + length + 0.8) * SR))
    if a >= N:
        return out
    t = np.arange(b - a) / SR
    w = np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(4 * np.pi * freq * t) * np.exp(-t * 3)
    w += 0.08 * np.sin(2 * np.pi * freq * 3.01 * t) * np.exp(-t * 6)
    env = np.minimum(1, t / 0.015) * np.exp(-t * 0.9)
    env *= np.where(t > length, np.exp(-(t - length) * 5), 1)
    trem = 1 + 0.12 * np.sin(2 * np.pi * 4.2 * t)
    out[a:b] = w * env * trem * amp
    return out


def kick(start, amp=0.55):
    out = np.zeros(N)
    a = int(start * SR)
    L = min(N - a, int(0.35 * SR))
    if L <= 0:
        return out
    t = np.arange(L) / SR
    f = 55 + 70 * np.exp(-t * 30)
    out[a:a + L] = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * amp
    return out


def snare(start, rng, amp=0.16):
    out = np.zeros(N)
    a = int(start * SR)
    L = min(N - a, int(0.25 * SR))
    if L <= 0:
        return out
    t = np.arange(L) / SR
    n = lowpass(rng.standard_normal(L), 0.35)
    out[a:a + L] = n * np.exp(-t * 18) * amp
    return out


def hat(start, rng, amp=0.035):
    out = np.zeros(N)
    a = int(start * SR)
    L = min(N - a, int(0.06 * SR))
    if L <= 0:
        return out
    t = np.arange(L) / SR
    n = rng.standard_normal(L)
    n = n - lowpass(n, 0.3)
    out[a:a + L] = n * np.exp(-t * 60) * amp
    return out


def crackle(rng):
    """Plak cızırtısı + hafif uğultu."""
    hiss = lowpass(rng.standard_normal(N), 0.08) * 0.012
    pops = np.zeros(N)
    idx = rng.integers(0, N - 200, 90)
    for i in idx:
        L = 120
        pops[i:i + L] += rng.uniform(0.02, 0.07) * np.exp(-np.arange(L) / 15) * rng.choice([-1, 1])
    return hiss + pops


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


# Her parça: (bpm, akorlar [MIDI notaları], bas notaları, tohum)
TRACKS = {
    'lofi1': (72, [[57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65], [52, 55, 59, 62]], [45, 41, 43, 40], 11),  # Am9 Fmaj7 G7 Em7
    'lofi2': (70, [[62, 65, 69, 72], [55, 59, 62, 65], [60, 64, 67, 71], [57, 60, 64, 67]], [50, 43, 48, 45], 23),  # Dm9 G7 Cmaj7 Am7
    'lofi3': (75, [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [55, 59, 62, 65]], [41, 40, 38, 43], 37),  # Fmaj7 Em7 Dm7 G7
    'lofi4': (68, [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65]], [48, 45, 41, 43], 51),  # Cmaj7 Am7 Fmaj7 G7
}


def build(bpm, chords, bass, seed):
    rng = np.random.default_rng(seed)
    beat = 60 / bpm
    bar = beat * 4
    mix = np.zeros(N)
    t0 = 0.0
    k = 0
    while t0 < DUR:
        ch = chords[k % len(chords)]
        for j, m in enumerate(ch):
            # hafif "strum" ve swing
            mix += rhodes(hz(m), t0 + j * 0.018, bar * 0.92, 0.06)
        mix += rhodes(hz(bass[k % len(bass)]), t0, bar * 0.9, 0.11)
        for b in range(4):
            bt = t0 + b * beat
            if b in (0, 2):
                mix += kick(bt)
            if b in (1, 3):
                mix += snare(bt + 0.02, rng)
            mix += hat(bt, rng)
            mix += hat(bt + beat * 0.62, rng, 0.022)  # swing
        t0 += bar
        k += 1
    mix = lowpass(mix, 0.22) * 1.1 + crackle(rng)
    # giriş/çıkış
    t = np.arange(N) / SR
    mix *= np.minimum(1, t / 0.4) * np.minimum(1, (DUR - t) / 0.8)
    mix /= np.max(np.abs(mix)) + 1e-9
    return mix * 0.7


def save(path, x):
    y = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(y.tobytes())


if __name__ == '__main__':
    out = pathlib.Path(__file__).parent / 'public' / 'audio'
    out.mkdir(parents=True, exist_ok=True)
    for name, (bpm, chords, bass, seed) in TRACKS.items():
        save(out / f'{name}.wav', build(bpm, chords, bass, seed))
        print(name)


def click():
    """Lamba düğmesi 'tık' sesi (D hook'u için)."""
    rng = np.random.default_rng(3)
    x = np.zeros(int(SR * 0.3))
    L = int(0.012 * SR)
    t = np.arange(L) / SR
    x[:L] = (rng.standard_normal(L) * 0.6 + np.sin(2 * np.pi * 2400 * t)) * np.exp(-t * 500)
    x[int(0.05 * SR):int(0.05 * SR) + L] += 0.5 * x[:L]
    return x / np.max(np.abs(x)) * 0.8


if __name__ == '__main__':
    save(pathlib.Path(__file__).parent / 'public' / 'audio' / 'tik.wav', click())
    print('tik')
