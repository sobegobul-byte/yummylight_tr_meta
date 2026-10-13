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
