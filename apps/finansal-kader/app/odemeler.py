"""Duzenli ve tek seferlik odemeler (abonelik, fatura, kira, vergi, SGK...) ve nakit hesaplari.

Kural (pay-the-bills): panel hicbir seyi otomatik odemis saymaz; "Otomatik talimat" ile odenen kalemler
tarihi gecince "talimatla odendi" olarak gosterilir, digerleri kullanici "Odendi" diyene kadar acik kalir.
"""
from __future__ import annotations

import calendar
from datetime import date, timedelta

SIKLIK_AY = {"aylik": 1, "2aylik": 2, "3aylik": 3, "6aylik": 6, "yillik": 12}
SIKLIKLAR = ("aylik", "2aylik", "3aylik", "6aylik", "yillik", "haftalik", "tek")
KATEGORILER = ("Abonelik", "Fatura", "Kira", "Vergi", "SGK / Bağ-Kur", "Maaş", "Muhasebe", "Sigorta",
               "Aidat", "Eğitim", "Taksit", "Çek / Senet", "Diğer")
YOLLAR = ("Otomatik talimat", "Kredi kartı", "Havale / EFT", "Nakit", "Çek / Senet")

# Hazir liste: kullanici tutari ve gunu kendi girer; tarihler yaygin son gunlerdir, kurumdan teyit edilmeli.
SABLONLAR = [
    # isletme
    {"ad": "KDV beyannamesi ödemesi", "kategori": "Vergi", "sahip": "Şirket", "siklik": "aylik", "gun": 28},
    {"ad": "Muhtasar ve prim hizmet (stopaj)", "kategori": "Vergi", "sahip": "Şirket", "siklik": "aylik", "gun": 26},
    {"ad": "SGK primi (çalışanlar)", "kategori": "SGK / Bağ-Kur", "sahip": "Şirket", "siklik": "aylik", "gun": 31},
    {"ad": "Bağ-Kur primi", "kategori": "SGK / Bağ-Kur", "sahip": "Şahsi", "siklik": "aylik", "gun": 31},
    {"ad": "Geçici vergi", "kategori": "Vergi", "sahip": "Şirket", "siklik": "3aylik", "gun": 17, "ay": [2, 5, 8, 11]},
    {"ad": "Yıllık gelir vergisi (2 taksit)", "kategori": "Vergi", "sahip": "Şirket", "siklik": "6aylik", "gun": 31, "ay": [3, 7]},
    {"ad": "Muhasebeci ücreti", "kategori": "Muhasebe", "sahip": "Şirket", "siklik": "aylik", "gun": 1},
    {"ad": "Dükkan / atölye kirası", "kategori": "Kira", "sahip": "Şirket", "siklik": "aylik", "gun": 1},
    {"ad": "Çalışan maaşları", "kategori": "Maaş", "sahip": "Şirket", "siklik": "aylik", "gun": 1},
    {"ad": "İşyeri elektrik", "kategori": "Fatura", "sahip": "Şirket", "siklik": "aylik", "gun": 15, "degisken": True},
    {"ad": "İşyeri internet", "kategori": "Fatura", "sahip": "Şirket", "siklik": "aylik", "gun": 15},
    {"ad": "ikas e-ticaret paketi", "kategori": "Abonelik", "sahip": "Şirket", "siklik": "yillik", "gun": 1},
    {"ad": "Alan adı / hosting", "kategori": "Abonelik", "sahip": "Şirket", "siklik": "yillik", "gun": 1},
    {"ad": "Oracle / sunucu", "kategori": "Abonelik", "sahip": "Şirket", "siklik": "aylik", "gun": 1},
    {"ad": "Yapay zeka araçları (Claude, ChatGPT, Higgsfield...)", "kategori": "Abonelik", "sahip": "Şirket", "siklik": "aylik", "gun": 1},
    {"ad": "Tasarım araçları (Canva, Adobe...)", "kategori": "Abonelik", "sahip": "Şirket", "siklik": "aylik", "gun": 1},
    {"ad": "Kargo anlaşması / Navlungo bakiye", "kategori": "Diğer", "sahip": "Şirket", "siklik": "aylik", "gun": 1, "degisken": True},
    {"ad": "İşyeri sigortası", "kategori": "Sigorta", "sahip": "Şirket", "siklik": "yillik", "gun": 1},
    {"ad": "Araç kaskosu / trafik sigortası", "kategori": "Sigorta", "sahip": "Şahsi", "siklik": "yillik", "gun": 1},
    {"ad": "Motorlu taşıtlar vergisi (MTV)", "kategori": "Vergi", "sahip": "Şahsi", "siklik": "6aylik", "gun": 31, "ay": [1, 7]},
    {"ad": "Emlak vergisi", "kategori": "Vergi", "sahip": "Şahsi", "siklik": "6aylik", "gun": 30, "ay": [5, 11]},
    # kisisel
    {"ad": "Ev kirası", "kategori": "Kira", "sahip": "Şahsi", "siklik": "aylik", "gun": 1},
    {"ad": "Ev elektrik", "kategori": "Fatura", "sahip": "Şahsi", "siklik": "aylik", "gun": 15, "degisken": True},
    {"ad": "Ev doğalgaz", "kategori": "Fatura", "sahip": "Şahsi", "siklik": "aylik", "gun": 15, "degisken": True},
    {"ad": "Ev su", "kategori": "Fatura", "sahip": "Şahsi", "siklik": "aylik", "gun": 15, "degisken": True},
    {"ad": "Ev internet", "kategori": "Fatura", "sahip": "Şahsi", "siklik": "aylik", "gun": 15},
    {"ad": "Cep telefonu", "kategori": "Fatura", "sahip": "Şahsi", "siklik": "aylik", "gun": 15},
    {"ad": "Site aidatı", "kategori": "Aidat", "sahip": "Şahsi", "siklik": "aylik", "gun": 5},
    {"ad": "Dijital abonelikler (Netflix, Spotify, YouTube...)", "kategori": "Abonelik", "sahip": "Şahsi", "siklik": "aylik", "gun": 1},
    {"ad": "Sağlık sigortası", "kategori": "Sigorta", "sahip": "Şahsi", "siklik": "yillik", "gun": 1},
    {"ad": "DASK / konut sigortası", "kategori": "Sigorta", "sahip": "Şahsi", "siklik": "yillik", "gun": 1},
    {"ad": "Okul / kurs taksidi", "kategori": "Eğitim", "sahip": "Şahsi", "siklik": "aylik", "gun": 1},
]


def _ay_gunu(yil: int, ay: int, gun: int) -> date:
    return date(yil, ay, min(gun, calendar.monthrange(yil, ay)[1]))


def _ay_kaydir(d: date, n: int, gun: int) -> date:
    m = d.year * 12 + d.month - 1 + n
    return _ay_gunu(m // 12, m % 12 + 1, gun)


def sablon_baslangic(s: dict, bugun: date) -> str:
    """Sablonun bugunden sonraki ilk tarihi (ay listesi varsa o aylardan biri)."""
    aylar = s.get("ay") or list(range(1, 13))
    for n in range(0, 25):
        d = _ay_kaydir(bugun.replace(day=1), n, s["gun"])
        if d.month in aylar and d >= bugun:
            return d.isoformat()
    return bugun.isoformat()


def tarihler(k: dict, bas: date, bit: date) -> list[date]:
    """Kalemin [bas, bit] arasindaki odeme tarihleri."""
    ilk = date.fromisoformat(k["tarih"])
    son = date.fromisoformat(k["bitis"]) if k.get("bitis") else None
    s = k.get("siklik", "aylik")
    sonuc: list[date] = []
    if s == "tek":
        aday = [ilk]
    elif s == "haftalik":
        n0 = max(0, (bas - ilk).days // 7)
        aday = [ilk + timedelta(weeks=n0 + i) for i in range(0, (bit - bas).days // 7 + 2)]
    else:
        adim = SIKLIK_AY[s]
        fark = (bas.year - ilk.year) * 12 + bas.month - ilk.month
        n0 = max(0, fark // adim - 1)
        aday = [_ay_kaydir(ilk, (n0 + i) * adim, ilk.day) for i in range(0, 400 // adim + 2)]
    for d in aday:
        if d > bit or (son and d > son):
            break
        if d >= bas and d >= ilk:
            sonuc.append(d)
    return sonuc


def aylik_esdeger(k: dict) -> float:
    s = k.get("siklik", "aylik")
    t = k.get("tutar") or 0
    if s == "tek":
        return 0.0
    if s == "haftalik":
        return t * 52 / 12
    return t / SIKLIK_AY[s]


def takvim(f: dict, bugun: date, ileri: int = 90, geri: int = 60) -> list[dict]:
    """Odeme kalemlerinin olaylari: gecmis 'geri' gundeki odenmemisler + onumuzdeki 'ileri' gun."""
    odenen = {(o["kalem_id"], o["donem"]): o for o in f.get("odeme_kayit", [])}
    olaylar = []
    for k in f.get("odemeler", []):
        if not k.get("aktif", True):
            continue
        for d in tarihler(k, bugun - timedelta(days=geri), bugun + timedelta(days=ileri)):
            kayit = odenen.get((k["id"], d.isoformat()))
            if kayit:
                durum = "odendi"
            elif d < bugun:
                durum = "talimat" if k.get("yol") == "Otomatik talimat" else "gecikti"
            else:
                durum = "bekliyor"
            if d < bugun and durum != "gecikti":
                continue                                   # gecmisin sadece acik kalanlari gosterilir
            olaylar.append({"kaynak": "odeme", "kalem_id": k["id"], "ad": k["ad"], "kategori": k.get("kategori"),
                            "sahip": k.get("sahip"), "tarih": d.isoformat(), "degisken": bool(k.get("degisken")),
                            "tutar": kayit["tutar"] if kayit else (k.get("tutar") or 0), "yol": k.get("yol"),
                            "kart_id": k.get("kart_id"), "durum": durum})
    return olaylar
