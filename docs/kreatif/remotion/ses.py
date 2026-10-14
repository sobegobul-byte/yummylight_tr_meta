"""5 video için müzik + efekt sesleri üretir (telifsiz, kodla sentezlenir).
Kullanım: python3 ses.py  ->  public/audio/v1..v5.wav
"""
import wave, pathlib
import numpy as np

SR = 44100
DUR = 9.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
t_all = np.arange(N) / SR


def note(freq, start, length, amp=0.2, attack=0.02, release=0.6, kind='sine', bright=0.0):
    """Tek nota: zarf + harmonikler."""
    out = np.zeros(N)
    a, b = int(start * SR), min(N, int((start + length + release) * SR))
    if a >= N:
        return out
    t = np.arange(b - a) / SR
    w = np.sin(2 * np.pi * freq * t)
    if kind == 'pluck':
        w = w + 0.5 * np.sin(4 * np.pi * freq * t) * np.exp(-t * 6) + 0.25 * np.sin(6 * np.pi * freq * t) * np.exp(-t * 9)
    elif kind == 'pad':
        w = w + 0.35 * np.sin(2 * np.pi * freq * 1.003 * t) + 0.2 * np.sin(4 * np.pi * freq * t)
    if bright:
        w = w + bright * np.sign(np.sin(2 * np.pi * freq * t)) * 0.15
    env = np.minimum(1, t / attack)
    rel_start = length
    env = env * np.where(t > rel_start, np.exp(-(t - rel_start) / max(release, 1e-3) * 3), 1)
    if kind == 'pluck':
        env = env * np.exp(-t * 2.2)
    out[a:b] = w * env * amp
    return out


def noise_burst(start, length, amp=0.3, lp=0.15, rise=True):
    """Whoosh: filtrelenmiş gürültü, yükselen/alçalan zarf."""
    out = np.zeros(N)
    a, b = int(start * SR), min(N, int((start + length) * SR))
    if a >= N:
        return out
    n = rng.standard_normal(b - a)
    # basit tek kutuplu alçak geçiren, kesim zamanla açılır
    y = np.zeros_like(n)
    k = np.linspace(lp * 0.3, lp, len(n)) if rise else np.linspace(lp, lp * 0.3, len(n))
    acc = 0.0
    for i in range(len(n)):
        acc += k[i] * (n[i] - acc)
        y[i] = acc
    t = np.linspace(0, 1, len(n))
    env = (t ** 1.5) * np.exp(-((t - 0.8) ** 2) * 6) if rise else np.exp(-t * 5)
    out[a:b] = y * env / (np.abs(y).max() + 1e-9) * amp
    return out


def click(start, amp=0.25, freq=2400, length=0.012):
    out = np.zeros(N)
    a = int(start * SR)
    m = int(length * SR)
    if a + m >= N:
        return out
    t = np.arange(m) / SR
    out[a:a + m] = (np.sin(2 * np.pi * freq * t) + 0.6 * rng.standard_normal(m)) * np.exp(-t * 400) * amp
    return out


def kick(start, amp=0.6):
    out = np.zeros(N)
    a = int(start * SR)
    m = int(0.35 * SR)
    if a >= N:
        return out
    m = min(m, N - a)
    t = np.arange(m) / SR
    f = 120 * np.exp(-t * 18) + 45
    ph = 2 * np.pi * np.cumsum(f) / SR
    out[a:a + m] = np.sin(ph) * np.exp(-t * 9) * amp
    return out


def shimmer(start, length, base=1760, amp=0.06):
    out = np.zeros(N)
    for i in range(10):
        st = start + rng.uniform(0, length)
        out += note(base * rng.choice([1, 1.25, 1.5, 2]), st, 0.05, amp=amp * rng.uniform(0.5, 1), attack=0.005, release=0.5, kind='sine')
    return out


def chords(prog, start=0.0, each=2.25, amp=0.07, kind='pad', attack=0.4):
    out = np.zeros(N)
    for i, ch in enumerate(prog):
        for fq in ch:
            out += note(fq, start + i * each, each, amp=amp, attack=attack, release=1.2, kind=kind)
    return out


def hz(n):
    return 440 * 2 ** ((n - 69) / 12)


def chord(*notes):
    return [hz(n) for n in notes]


Cmaj7, Am7, Fmaj7, G6 = chord(48, 55, 59, 64), chord(45, 52, 55, 60), chord(41, 48, 52, 57), chord(43, 50, 55, 59)
Dm9 = chord(38, 50, 53, 57, 64)


def master(x, name):
    x = x - x.mean()
    # son 0,4 sn yumuşak bitiş
    fade = np.ones(N)
    fade[-int(0.4 * SR):] = np.linspace(1, 0, int(0.4 * SR))
    x = np.tanh(x * fade * 1.3) * 0.85
    pcm = (x * 32767).astype(np.int16)
    st = np.stack([pcm, pcm], axis=1)
    p = pathlib.Path('public/audio') / f'{name}.wav'
    p.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(p), 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(st.tobytes())
    print(p)


# V1 Işık süpürmesi: sıcak pad + her yazı süpürmesinde whoosh + parıltı
v1 = chords([Cmaj7, Am7, Fmaj7, G6])
for tt in [0.05, 0.32, 0.6, 4.55, 6.6]:
    v1 += noise_burst(max(0, tt - 0.25), 0.55, amp=0.22)
v1 += shimmer(0.4, 1.2) + shimmer(6.7, 1.5)
for tt in [2.0, 4.5, 6.5]:
    v1 += noise_burst(tt - 0.3, 0.4, amp=0.12, lp=0.08)
master(v1, 'v1')

# V2 Karanlık: derin drone, kelime girişlerinde yumuşak çan
v2 = note(hz(36), 0.2, 8.5, amp=0.12, attack=1.2, kind='pad') + note(hz(43), 0.2, 8.5, amp=0.06, attack=1.5, kind='pad')
for tt, n in [(0.02, 72), (0.35, 76), (2.1, 74), (2.35, 79), (4.1, 72), (4.35, 77), (6.55, 76), (6.85, 84)]:
    v2 += note(hz(n), tt, 0.1, amp=0.11, attack=0.005, release=1.4, kind='pluck')
master(v2, 'v2')

# V3 Avuç: sade akustik pluck arpej + klavye tık sesleri
v3 = np.zeros(N)
arp = [60, 64, 67, 72, 67, 64]
for i in range(int(9 / 0.3)):
    v3 += note(hz(arp[i % len(arp)] - (5 if (i // 8) % 2 else 0)), i * 0.3, 0.1, amp=0.09, attack=0.004, release=0.5, kind='pluck')
for blk, (st, nch, cps) in enumerate([(0.13, 24, 60), (2.63, 46, 34), (5.13, 54, 48), (7.13, 44, 40)]):
    for k in range(nch):
        v3 += click(st + k / cps, amp=0.05 + 0.02 * rng.random(), freq=1800 + 900 * rng.random())
master(v3, 'v3')

# V4 Kime: ritmik; her kesmede kick + clap, sonra açılan akor
v4 = np.zeros(N)
for i in range(5):
    v4 += kick(i * 0.7, amp=0.55)
    v4 += noise_burst(i * 0.7, 0.12, amp=0.18, lp=0.6, rise=False)
v4 += kick(3.75, amp=0.7) + noise_burst(3.45, 0.35, amp=0.25)
v4 += chords([Fmaj7, G6, Cmaj7], start=3.75, each=1.8, amp=0.08, attack=0.05)
for i in range(8):
    v4 += kick(6.3 + i * 0.35, amp=0.3)
v4 += noise_burst(6.0, 0.35, amp=0.22)
master(v4, 'v4')

# V5 Fiş: yazar kasa tıkırtısı, her satırda bip, sonunda "ding"
v5 = chords([Am7, Fmaj7, Cmaj7, G6], amp=0.05, kind='pad')
v5 += noise_burst(0.0, 0.25, amp=0.2, lp=0.4, rise=False)
for r in range(10):
    tt = 0.8 + (6 + r * 6) / 30
    for k in range(5):
        v5 += click(tt + k * 0.018, amp=0.08, freq=3200)
for tt in [0.85, 6.5]:
    v5 += noise_burst(tt - 0.15, 0.3, amp=0.18, lp=0.3)
v5 += note(hz(88), 2.9, 0.05, amp=0.08, attack=0.003, release=1.2, kind='pluck') + note(hz(93), 6.75, 0.05, amp=0.12, attack=0.003, release=1.6, kind='pluck')
master(v5, 'v5')


# ---- İkinci seri (gece lambası, önizleme) ----
def musicbox(seq, start, step, amp=0.08, oct=0):
    out = np.zeros(N)
    for i, n in enumerate(seq):
        if n:
            out += note(hz(n + oct), start + i * step, 0.05, amp=amp, attack=0.003, release=1.4, kind='pluck')
    return out

lull = [76, 79, 84, 79, 76, 72, 74, 76, 79, 76, 72, 67]

# V6 Işığı kapat: düğme "klik", karanlık sessizlik, sonra müzik kutusu + sıcak pad
v6 = click(0.05, amp=0.5, freq=900, length=0.03) + click(0.09, amp=0.3, freq=600, length=0.02)
v6 += note(hz(36), 0.9, 7.5, amp=0.08, attack=1.0, kind='pad')
v6 += musicbox(lull, 1.0, 0.33)
v6 += chords([Fmaj7, Cmaj7, G6], start=2.7, each=2.2, amp=0.05, attack=0.6)
v6 += noise_burst(6.3, 0.4, amp=0.15) + shimmer(6.6, 1.2)
master(v6, 'v6')

# V7 Gece saati: sessiz gece pad, kilit ekranı tıkı, bildirim "ding"
v7 = chords([Am7, Fmaj7, Cmaj7, G6], amp=0.06, kind='pad', attack=0.8)
v7 += musicbox([72, 0, 76, 0, 79, 0, 76, 0, 74, 0, 72, 0, 71, 0, 72], 0.2, 0.3, amp=0.05)
v7 += click(0.05, amp=0.25, freq=3000)
v7 += note(hz(88), 4.72, 0.05, amp=0.12, attack=0.002, release=0.9, kind='pluck') + note(hz(95), 4.82, 0.05, amp=0.1, attack=0.002, release=1.2, kind='pluck')
v7 += noise_burst(6.5, 0.35, amp=0.14)
master(v7, 'v7')

# V8 Özlem: piyano-vari pad, her balonda "pop", yazıyor sesi
v8 = chords([Cmaj7, Am7, Dm9, G6], amp=0.055, kind='pad', attack=0.7)
for tt in [0.1, 0.75, 1.7, 3.0, 6.67]:
    v8 += note(hz(84), tt, 0.03, amp=0.12, attack=0.002, release=0.25, kind='sine') + note(hz(91), tt + 0.03, 0.03, amp=0.08, attack=0.002, release=0.2)
v8 += musicbox([67, 72, 76, 74, 72, 67, 69, 72], 3.3, 0.45, amp=0.06)
master(v8, 'v8')

# V9 Önizle: film projektörü tıkırtısı + yavaş piyano, ışık yanınca açılan akor
v9 = np.zeros(N)
for i in range(int(9 / 0.042)):
    v9 += click(i * 0.042, amp=0.012, freq=1200, length=0.006)
v9 += musicbox([64, 0, 67, 0, 72, 0, 71, 0, 67, 0, 64], 0.0, 0.36, amp=0.07)
v9 += chords([Fmaj7, Cmaj7, G6], start=3.8, each=1.8, amp=0.07, attack=0.15) + shimmer(3.8, 1.0)
v9 += noise_burst(6.3, 0.35, amp=0.15)
master(v9, 'v9')

# V10 Galeri: yumuşak lo-fi vuruş, her kelimede hafif tık
v10 = chords([Am7, Fmaj7, Cmaj7, G6], amp=0.05, kind='pad', attack=0.4)
for i in range(int(9 / 0.6)):
    v10 += kick(i * 0.6, amp=0.28)
w = [2 + i * 7 for i in range(4)] + [72 + i * 7 for i in range(4)] + [132 + i * 5 for i in range(4)] + [196 + i * 4 for i in range(5)]
for fr_ in w:
    v10 += click(fr_ / 30, amp=0.05, freq=2600)
v10 += musicbox(lull[:8], 4.4, 0.25, amp=0.06)
master(v10, 'v10')


# ---- Üçüncü seri (araba lambaları) ----
Em7, Cmaj9, D6 = chord(40, 52, 55, 59, 62), chord(36, 48, 52, 55, 62), chord(38, 50, 54, 57, 59)

# A1 Önce/Sonra: tik-tak gerilim, perde açılırken whoosh + vuruş, sonra enerjik ritim
a1 = np.zeros(N)
for i in range(6):
    a1 += click(0.1 + i * 0.4, amp=0.12, freq=1800)
a1 += noise_burst(0.45, 0.35, amp=0.18) + noise_burst(2.3, 0.5, amp=0.32)
a1 += kick(2.8, amp=0.7) + shimmer(2.8, 1.0)
for i in range(int((9 - 2.8) / 0.4)):
    a1 += kick(2.8 + i * 0.4, amp=0.35)
a1 += chords([Am7, Fmaj7, Cmaj7, G6], start=2.8, each=1.55, amp=0.06, attack=0.1)
a1 += noise_burst(6.4, 0.3, amp=0.18)
master(a1, 'a1')

# A2 Motor: düşük motor homurtusu (yükselen), hızlı vuruşlar, whoosh'lar
a2 = np.zeros(N)
rpm = np.interp(t_all, [0, 2.2, 2.4, 9], [45, 110, 70, 70])
ph = 2 * np.pi * np.cumsum(rpm) / SR
env = np.interp(t_all, [0, 0.1, 2.3, 2.6, 9], [0, 0.22, 0.3, 0.08, 0.06])
a2 += env * np.tanh(3 * np.sin(ph)) * (0.7 + 0.3 * np.sin(ph * 0.5))
for tt in [0.1, 0.3, 2.35, 6.25]:
    a2 += noise_burst(tt, 0.3, amp=0.22)
for i in range(int((9 - 2.4) / 0.3)):
    a2 += kick(2.4 + i * 0.3, amp=0.4 if i % 2 == 0 else 0.22)
a2 += chords([Em7, Cmaj9, D6, Em7], start=2.4, each=1.65, amp=0.05, attack=0.08)
master(a2, 'a2')

# A3 Baba: nostaljik müzik kutusu + sıcak pad, plaka "damga" darbeleri
a3 = chords([Fmaj7, Cmaj7, Am7, G6], amp=0.06, kind='pad', attack=0.7)
a3 += musicbox([72, 76, 79, 77, 76, 72, 74, 76, 72, 69, 67, 72, 76, 74, 72], 0.0, 0.5, amp=0.06)
for tt in [0.27, 6.87]:
    a3 += kick(tt, amp=0.75) + click(tt, amp=0.3, freq=700, length=0.03)
a3 += shimmer(2.75, 1.0) + noise_burst(6.4, 0.35, amp=0.14)
master(a3, 'a3')

# A4 Meslek: mekanik tıkırtı (çizim / ölçü), lazer vızıltısı, sağlam vuruş
a4 = np.zeros(N)
for i in range(int(9 / 0.25)):
    a4 += click(i * 0.25, amp=0.06 if i % 4 else 0.12, freq=2200)
for i in range(int(9 / 0.5)):
    a4 += kick(i * 0.5, amp=0.38)
laser = (t_all > 4.0) & (t_all < 5.3)
a4 += laser * 0.05 * np.sin(2 * np.pi * 880 * t_all) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t_all))
a4 += chords([Am7, Fmaj7, Dm9, G6], start=0.0, each=2.25, amp=0.05, attack=0.2)
for tt in [0.45, 2.35, 6.65]:
    a4 += noise_burst(tt, 0.3, amp=0.18)
master(a4, 'a4')


# ---- Dördüncü seri (yıldız haritası + şarkı kodu) ----
# Y1 Gökyüzü: yıldız belirdikçe tek tek "ting", geniş sıcak pad
y1 = chords([Fmaj7, Cmaj7, Am7, G6], amp=0.06, kind='pad', attack=0.6)
for i, n in enumerate([84, 88, 91, 86, 93, 89, 96, 91, 88]):
    y1 += note(hz(n), i * 0.067, 0.04, amp=0.07, attack=0.002, release=1.2, kind='pluck')
y1 += shimmer(0.1, 2.6, amp=0.05) + noise_burst(2.85, 0.3, amp=0.12) + shimmer(6.6, 1.5)
y1 += musicbox([72, 76, 79, 76, 74, 72, 71, 72], 3.0, 0.42, amp=0.05)
master(y1, 'y1')

# Y2 Şarkı: kayıt "tık", sonra ritimli pop: vuruş + bas + akor
y2 = click(0.05, amp=0.2, freq=1500) + click(1.45, amp=0.35, freq=900, length=0.02)
y2 += note(hz(48), 0.0, 1.4, amp=0.05, attack=0.3, kind='pad')
for i in range(int((9 - 1.5) / 0.46)):
    tt = 1.5 + i * 0.46
    y2 += kick(tt, amp=0.42 if i % 2 == 0 else 0.25)
y2 += chords([Cmaj7, Am7, Fmaj7, G6], start=1.5, each=1.84, amp=0.07, attack=0.05)
y2 += musicbox([76, 79, 81, 79, 76, 74, 76, 72], 1.5, 0.23, amp=0.05) + noise_burst(6.45, 0.3, amp=0.14)
master(y2, 'y2')

# Y3 Tarih: sayaç tıkırtısı, daktilo, gece pad
y3 = chords([Am7, Fmaj7, Cmaj7, G6], amp=0.055, kind='pad', attack=0.5)
for i in range(32):
    y3 += click(0.9 + i * 0.03, amp=0.08, freq=3000, length=0.006)
y3 += kick(1.75, amp=0.5)
for i in range(23):
    y3 += click(3.0 + i / 36, amp=0.09, freq=1900, length=0.01)
y3 += noise_burst(6.45, 0.3, amp=0.14)
master(y3, 'y3')

# Y4 Anket: hafif lo-fi, dokunuş "pop", seçimde parıltı
y4 = chords([Fmaj7, G6, Am7, Cmaj7], amp=0.06, kind='pad', attack=0.3)
for i in range(int(9 / 0.5)):
    y4 += kick(i * 0.5, amp=0.25)
for tt in [1.3, 7.2]:
    y4 += note(hz(84), tt, 0.03, amp=0.14, attack=0.002, release=0.25) + shimmer(tt, 0.8, amp=0.05)
y4 += musicbox([72, 74, 76, 79, 76, 74], 3.2, 0.5, amp=0.05)
master(y4, 'y4')

# Y5 Not: daktilo tuşları, satır sonu zili, piyano-vari müzik kutusu
y5 = chords([Cmaj7, Am7, Dm9, G6], amp=0.05, kind='pad', attack=0.8)
rng2 = np.random.default_rng(3)
for i in range(40):
    y5 += click(1.6 + i * 0.035 + rng2.uniform(0, 0.01), amp=0.1, freq=1400 + rng2.uniform(0, 600), length=0.01)
for i in range(28):
    y5 += click(6.8 + i * 0.035, amp=0.1, freq=1600, length=0.01)
y5 += note(hz(96), 3.0, 0.02, amp=0.08, attack=0.001, release=0.6, kind='pluck')
y5 += musicbox(lull, 3.1, 0.3, amp=0.055)
master(y5, 'y5')
