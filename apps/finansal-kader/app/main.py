"""Finansal Kader: kisisel/isletme finans paneli. Giris sadece Google Authenticator koduyla.

Calistirma:  uvicorn app.main:app --host 127.0.0.1 --port 8102
Veriler: veri/guvenlik.json (Authenticator anahtari), veri/finans.json (kartlar, ekstreler), veri/yedek/
"""
from __future__ import annotations

import calendar
import hashlib
import hmac
import io
import json
import re
import secrets
import shutil
import time
from datetime import date, datetime, timedelta
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, RedirectResponse, Response
from fastapi.staticfiles import StaticFiles

from . import faiz as fz
from . import islemler as isl
from . import odemeler as od
from . import totp

KOK = Path(__file__).resolve().parent.parent
VERI = KOK / "veri"
VERI.mkdir(exist_ok=True)
STATIK = Path(__file__).resolve().parent / "static"
SURUM = "0.6.2"

GUVENLIK = VERI / "guvenlik.json"
FINANS = VERI / "finans.json"
OTURUM_SURE = 12 * 3600          # 12 saat sonra yeniden kod istenir
CEREZ = "fk_oturum"

app = FastAPI(title="Finansal Kader", docs_url=None, redoc_url=None, openapi_url=None)
app.mount("/statik", StaticFiles(directory=STATIK), name="statik")


# --------------------------------------------------------------------------- dosya yardimcilari
def _oku(yol: Path, bos):
    if not yol.exists():
        return bos
    return json.loads(yol.read_text(encoding="utf-8"))


def _yaz(yol: Path, veri) -> None:
    gecici = yol.with_suffix(".tmp")
    gecici.write_text(json.dumps(veri, ensure_ascii=False, indent=2), encoding="utf-8")
    gecici.replace(yol)


def _yedekle() -> None:
    """Gunde bir kez finans.json yedegi (son 30 gun)."""
    if not FINANS.exists():
        return
    klasor = VERI / "yedek"
    klasor.mkdir(exist_ok=True)
    hedef = klasor / f"finans-{date.today().isoformat()}.json"
    if not hedef.exists():
        shutil.copy2(FINANS, hedef)
        for eski in sorted(klasor.glob("finans-*.json"))[:-30]:
            eski.unlink()


# --------------------------------------------------------------------------- guvenlik
def _guv() -> dict:
    g = _oku(GUVENLIK, {})
    if not g.get("oturum_anahtari"):
        g["oturum_anahtari"] = secrets.token_hex(32)
        _yaz(GUVENLIK, g)
    return g


def _imza(metin: str) -> str:
    return hmac.new(_guv()["oturum_anahtari"].encode(), metin.encode(), hashlib.sha256).hexdigest()


def _cerez_uret() -> str:
    bitis = str(int(time.time()) + OTURUM_SURE)
    return f"{bitis}.{_imza(bitis)}"


def _oturum_gecerli(req: Request) -> bool:
    c = req.cookies.get(CEREZ, "")
    if "." not in c:
        return False
    bitis, imza = c.split(".", 1)
    return bitis.isdigit() and int(bitis) > time.time() and hmac.compare_digest(_imza(bitis), imza)


def _kurulu() -> bool:
    return bool(_guv().get("totp_onayli"))


def _ip(req: Request) -> str:
    """Tunel arkasinda gercek ziyaretci IP'si Cloudflare basligindan gelir."""
    return req.headers.get("cf-connecting-ip") or (req.client.host if req.client else "")


def _yerel(req: Request) -> bool:
    return "cf-connecting-ip" not in req.headers and _ip(req) in ("127.0.0.1", "::1", "localhost")


KURULUM_ANAHTARI = VERI / "KURULUM-ANAHTARI.txt"


def _kurulum_izni(req: Request) -> bool:
    """Ilk kurulum: ya panelin calistigi bilgisayardan, ya da sunucuda yazilan tek seferlik anahtarla."""
    if _kurulu():
        return False
    if _yerel(req):
        return True
    if not KURULUM_ANAHTARI.exists():
        return False
    verilen = req.query_params.get("anahtar") or req.headers.get("x-kurulum-anahtari") or ""
    return bool(verilen) and hmac.compare_digest(verilen, KURULUM_ANAHTARI.read_text().strip())


@app.on_event("startup")
def _baslangic():
    if not _kurulu() and not KURULUM_ANAHTARI.exists():
        KURULUM_ANAHTARI.write_text(secrets.token_urlsafe(24))
        KURULUM_ANAHTARI.chmod(0o600)


# yanlis kod sinirlari: IP basina 15 dk'da 5, toplamda 1 saatte 10, 24 saatte 30 deneme
_hatali: list[tuple[float, str]] = []
_son_adim = {"adim": -1}           # ayni kod iki kez kullanilamaz
GIRIS_KAYIT = VERI / "giris-kayit.jsonl"


def _kilitli(ip: str) -> int:
    simdi = time.time()
    _hatali[:] = [h for h in _hatali if simdi - h[0] < 86400]
    bekle = 0
    for sure, sinir, liste in ((900, 5, [h for h in _hatali if h[1] == ip]), (3600, 10, _hatali), (86400, 30, _hatali)):
        son = [h[0] for h in liste if simdi - h[0] < sure]
        if len(son) >= sinir:
            bekle = max(bekle, int(sure - (simdi - son[-sinir])))
    return bekle


def _kayit(req: Request, basarili: bool) -> None:
    with GIRIS_KAYIT.open("a", encoding="utf-8") as f:
        f.write(json.dumps({"zaman": datetime.now().isoformat(timespec="seconds"), "ip": _ip(req), "basarili": basarili,
                            "tarayici": req.headers.get("user-agent", "")[:120]}, ensure_ascii=False) + "\n")


def _guvenlik_ozet() -> dict:
    if not GIRIS_KAYIT.exists():
        return {}
    satirlar = [json.loads(x) for x in GIRIS_KAYIT.read_text(encoding="utf-8").splitlines()[-500:] if x.strip()]
    sinir = (datetime.now() - timedelta(days=1)).isoformat()
    basarili = [x for x in satirlar if x["basarili"]]
    return {"onceki_giris": basarili[-2] if len(basarili) > 1 else None,
            "hatali_24s": sum(1 for x in satirlar if not x["basarili"] and x["zaman"] >= sinir)}


def _cerez_koy(req: Request, y: Response) -> Response:
    https = "cf-connecting-ip" in req.headers or req.url.scheme == "https"
    y.set_cookie(CEREZ, _cerez_uret(), max_age=OTURUM_SURE, httponly=True, samesite="strict", secure=https)
    return y


@app.middleware("http")
async def kapi(req: Request, sonraki):
    yol = req.url.path
    acik = yol in ("/giris", "/api/giris", "/kurulum", "/api/kurulum", "/kurulum/qr.svg", "/robots.txt") or yol.startswith("/statik/")
    if not acik and not _oturum_gecerli(req):
        if yol.startswith("/api/"):
            return JSONResponse({"hata": "Oturum yok"}, status_code=401)
        return RedirectResponse("/kurulum" if not _kurulu() and _yerel(req) else "/giris")
    yanit = await sonraki(req)
    yanit.headers["Cache-Control"] = "no-store"
    yanit.headers["X-Frame-Options"] = "DENY"
    yanit.headers["X-Content-Type-Options"] = "nosniff"
    yanit.headers["Referrer-Policy"] = "no-referrer"
    yanit.headers["X-Robots-Tag"] = "noindex, nofollow"
    if "cf-connecting-ip" in req.headers:
        yanit.headers["Strict-Transport-Security"] = "max-age=31536000"
    return yanit


@app.get("/robots.txt")
def robots():
    return Response("User-agent: *\nDisallow: /\n", media_type="text/plain")


@app.get("/kurulum")
def kurulum_sayfa(req: Request):
    if _kurulu():
        return RedirectResponse("/giris")
    if not _kurulum_izni(req):
        return HTMLResponse("Kurulum bağlantısı geçersiz.", status_code=403)
    return FileResponse(STATIK / "kurulum.html")


@app.get("/kurulum/qr.svg")
def kurulum_qr(req: Request):
    if not _kurulum_izni(req):
        raise HTTPException(403)
    g = _guv()
    if not g.get("totp_anahtar"):
        g["totp_anahtar"] = totp.yeni_anahtar()
        _yaz(GUVENLIK, g)
    import segno
    tampon = io.BytesIO()
    segno.make(totp.uri(g["totp_anahtar"]), error="m").save(tampon, kind="svg", scale=6, border=2)
    return Response(tampon.getvalue(), media_type="image/svg+xml")


@app.post("/api/kurulum")
async def kurulum_onay(req: Request):
    if not _kurulum_izni(req):
        raise HTTPException(403)
    g = _guv()
    kod = (await req.json()).get("kod", "")
    if not g.get("totp_anahtar") or totp.dogrula(g["totp_anahtar"], kod) is None:
        return JSONResponse({"hata": "Kod tutmadi. Telefondaki güncel kodu yazın."}, status_code=400)
    g["totp_onayli"] = True
    g["kurulum_tarihi"] = datetime.now().isoformat(timespec="seconds")
    _yaz(GUVENLIK, g)
    KURULUM_ANAHTARI.unlink(missing_ok=True)       # tek seferlik
    _kayit(req, True)
    return _cerez_koy(req, JSONResponse({"tamam": True}))


@app.get("/giris")
def giris_sayfa():
    return FileResponse(STATIK / "giris.html")


@app.post("/api/giris")
async def giris(req: Request):
    if not _kurulu():
        return JSONResponse({"hata": "Panel henüz kurulmadı."}, status_code=403)
    ip = _ip(req)
    bekle = _kilitli(ip)
    if bekle:
        return JSONResponse({"hata": f"Çok fazla yanlış deneme. {bekle // 60 + 1} dakika sonra tekrar deneyin."}, status_code=429)
    adim = totp.dogrula(_guv()["totp_anahtar"], (await req.json()).get("kod", ""))
    if adim is None or adim <= _son_adim["adim"]:
        _hatali.append((time.time(), ip))
        _kayit(req, False)
        return JSONResponse({"hata": "Kod yanlış ya da süresi geçmiş."}, status_code=401)
    _son_adim["adim"] = adim
    _kayit(req, True)
    return _cerez_koy(req, JSONResponse({"tamam": True}))


@app.post("/api/cikis")
def cikis():
    y = JSONResponse({"tamam": True})
    y.delete_cookie(CEREZ)
    return y


# --------------------------------------------------------------------------- veri
def _finans() -> dict:
    f = _oku(FINANS, {})
    f.setdefault("kartlar", [])
    f.setdefault("ekstreler", [])
    f.setdefault("krediler", [])
    f.setdefault("odemeler", [])
    f.setdefault("odeme_kayit", [])
    f.setdefault("hesaplar", [])
    return f


def _kaydet(f: dict) -> None:
    _yedekle()
    _yaz(FINANS, f)


def _sayi(v, varsayilan=0.0) -> float:
    if v in (None, ""):
        return varsayilan
    if isinstance(v, (int, float)):
        return float(v)
    s = str(v).strip().replace("₺", "").replace("TL", "").replace(" ", "")
    if "," in s:                       # 12.500,50 -> 12500.50
        s = s.replace(".", "").replace(",", ".")
    elif re.fullmatch(r"-?\d{1,3}(\.\d{3})+", s):   # 62.300 / -18.500 -> binlik nokta
        s = s.replace(".", "")
    try:
        return float(s)
    except ValueError:
        return varsayilan


def _gun(v) -> int | None:
    try:
        g = int(v)
    except (TypeError, ValueError):
        return None
    return g if 1 <= g <= 31 else None


KART_ALANLARI = ("banka", "kart_adi", "tur", "sahip", "son4", "not", "renk")


def _kart_temizle(k: dict, eski: dict | None) -> dict:
    yeni = dict(eski or {})
    for a in KART_ALANLARI:
        if a in k:
            yeni[a] = str(k[a] or "").strip()
    yeni["son4"] = "".join(c for c in yeni.get("son4", "") if c.isdigit())[-4:]
    for a in ("akdi_faiz", "gecikme_faiz"):
        if a in k:
            yeni[a] = round(_sayi(k[a]), 4) if k[a] not in (None, "") else None
    for a in ("limit", "guncel_borc"):
        if a in k:
            yeni[a] = round(_sayi(k[a]), 2)
    for a in ("kesim_gunu", "son_odeme_gunu"):
        if a in k:
            yeni[a] = _gun(k[a])
    if "aktif" in k:
        yeni["aktif"] = bool(k["aktif"])
    yeni.setdefault("aktif", True)
    if not yeni.get("banka"):
        raise HTTPException(400, "Banka seçilmeli")
    return yeni


def _ay_gunu(yil: int, ay: int, gun: int) -> date:
    return date(yil, ay, min(gun, calendar.monthrange(yil, ay)[1]))


def _ay_ekle(d: date, n: int) -> tuple[int, int]:
    m = d.year * 12 + d.month - 1 + n
    return m // 12, m % 12 + 1


def _takvim(k: dict, bugun: date) -> dict:
    """Kartin siradaki hesap kesim ve son odeme tarihleri."""
    kg = k.get("kesim_gunu")
    if not kg:
        return {}
    kesimler = [_ay_gunu(*_ay_ekle(bugun, n), kg) for n in (-2, -1, 0, 1)]
    sonraki_kesim = next(d for d in kesimler if d >= bugun)
    og = k.get("son_odeme_gunu")

    def odeme(kesim: date) -> date:
        if not og:
            return kesim + timedelta(days=10)          # bankalarin cogunda kesimden ~10 gun sonra
        y, a = (kesim.year, kesim.month) if og > kesim.day else _ay_ekle(kesim, 1)
        return _ay_gunu(y, a, og)

    # bugunden sonra gelen ilk son odeme (son kesime ait olabilir)
    sonraki_odeme = min(o for o in (odeme(d) for d in kesimler) if o >= bugun)
    return {"sonraki_kesim": sonraki_kesim.isoformat(), "sonraki_odeme": sonraki_odeme.isoformat(),
            "kesime_gun": (sonraki_kesim - bugun).days, "odemeye_gun": (sonraki_odeme - bugun).days}


def _ekstre_durum(e: dict, bugun: date) -> str:
    toplam, odenen = _sayi(e.get("toplam")), _sayi(e.get("odenen"))
    if toplam <= 0 or odenen >= toplam:
        return "odendi"
    if e.get("son_odeme_tarihi") and e["son_odeme_tarihi"] < bugun.isoformat():
        return "asgari_odendi" if odenen >= _sayi(e.get("asgari")) > 0 else "gecikti"
    return "kismi" if odenen > 0 else "bekliyor"


# --------------------------------------------------------------------------- krediler
KREDI_ALANLARI = ("banka", "tur", "sahip", "ad", "not")


def _kredi_temizle(g: dict, eski: dict | None) -> dict:
    k = dict(eski or {})
    for a in KREDI_ALANLARI:
        if a in g:
            k[a] = str(g[a] or "").strip()
    for a in ("tutar", "taksit"):
        if a in g:
            k[a] = round(_sayi(g[a]), 2)
    if "gecikme_faiz" in g:
        k["gecikme_faiz"] = round(_sayi(g["gecikme_faiz"]), 4) if g["gecikme_faiz"] not in (None, "") else None
    if "faiz" in g:
        k["faiz"] = round(_sayi(g["faiz"]), 4)              # aylik %
    if "vade" in g:
        k["vade"] = int(_sayi(g["vade"]))
    if "odenen_taksit" in g:                                # bos = tarihe gore hesapla
        k["odenen_taksit"] = None if g["odenen_taksit"] in (None, "") else int(_sayi(g["odenen_taksit"]))
    if "ilk_taksit" in g:
        try:
            k["ilk_taksit"] = date.fromisoformat(g["ilk_taksit"]).isoformat()
        except (TypeError, ValueError):
            raise HTTPException(400, "İlk taksit tarihi girilmeli")
    if "kapali" in g:
        k["kapali"] = bool(g["kapali"])
    if not k.get("banka"):
        raise HTTPException(400, "Banka seçilmeli")
    if not k.get("vade") or k["vade"] < 1:
        raise HTTPException(400, "Vade (ay) girilmeli")
    if not k.get("taksit") and not (k.get("tutar") and k.get("faiz") is not None):
        raise HTTPException(400, "Aylık taksit ya da tutar + faiz girilmeli")
    return k


def _kredi_hesap(k: dict, bugun: date) -> dict:
    n, P, r = k["vade"], k.get("tutar") or 0, (k.get("faiz") or 0) / 100
    taksit = k.get("taksit") or (P * r / (1 - (1 + r) ** -n) if r else P / n)
    ilk = date.fromisoformat(k["ilk_taksit"])

    def tarih(i: int) -> date:
        return _ay_gunu(*_ay_ekle(ilk, i), ilk.day)

    if k.get("odenen_taksit") is not None:
        odenen = max(0, min(n, k["odenen_taksit"]))
    else:
        odenen = sum(1 for i in range(n) if tarih(i) < bugun)
    kalan = 0 if k.get("kapali") else n - odenen
    if r and P:
        anapara = P * (1 + r) ** odenen - taksit * ((1 + r) ** odenen - 1) / r
    else:
        anapara = P - taksit * odenen if P else taksit * kalan
    return {"taksit": round(taksit, 2), "odenen": odenen, "kalan_taksit": kalan,
            "kalan_odeme": round(taksit * kalan, 2), "kalan_anapara": round(max(anapara, 0) if kalan else 0, 2),
            "sonraki": tarih(odenen).isoformat() if kalan else None, "bitis": tarih(n - 1).isoformat(),
            "toplam_odeme": round(taksit * n, 2), "toplam_faiz": round(taksit * n - P, 2) if P else None}


@app.post("/api/kredi")
async def kredi_kaydet(req: Request):
    g = await req.json()
    f = _finans()
    eski = next((k for k in f["krediler"] if k["id"] == g.get("id")), None) if g.get("id") else None
    k = _kredi_temizle(g, eski)
    if eski:
        f["krediler"][f["krediler"].index(eski)] = k
    else:
        k["id"] = "c" + secrets.token_hex(4)
        f["krediler"].append(k)
    _kaydet(f)
    return {"tamam": True, "id": k["id"]}


@app.delete("/api/kredi/{cid}")
def kredi_sil(cid: str):
    f = _finans()
    f["krediler"] = [k for k in f["krediler"] if k["id"] != cid]
    _kaydet(f)
    return {"tamam": True}


# --------------------------------------------------------------------------- odemeler ve nakit
def _odeme_temizle(g: dict, eski: dict | None) -> dict:
    k = dict(eski or {})
    for a in ("ad", "kategori", "sahip", "yol", "kart_id", "not"):
        if a in g:
            k[a] = str(g[a] or "").strip()
    if "siklik" in g:
        k["siklik"] = g["siklik"] if g["siklik"] in od.SIKLIKLAR else "aylik"
    if "tutar" in g:
        k["tutar"] = round(_sayi(g["tutar"]), 2)
    for a in ("degisken", "aktif"):
        if a in g:
            k[a] = bool(g[a])
    k.setdefault("aktif", True)
    for a in ("tarih", "bitis"):
        if a in g:
            try:
                k[a] = date.fromisoformat(g[a]).isoformat() if g[a] else None
            except (TypeError, ValueError):
                raise HTTPException(400, "Tarih hatalı")
    if not k.get("ad"):
        raise HTTPException(400, "Ödemenin adı girilmeli")
    if not k.get("tarih"):
        raise HTTPException(400, "İlk ödeme tarihi girilmeli")
    if k.get("yol") != "Kredi kartı":
        k["kart_id"] = ""
    return k


@app.post("/api/odeme")
async def odeme_kaydet(req: Request):
    g = await req.json()
    f = _finans()
    eski = next((k for k in f["odemeler"] if k["id"] == g.get("id")), None) if g.get("id") else None
    k = _odeme_temizle(g, eski)
    if eski:
        f["odemeler"][f["odemeler"].index(eski)] = k
    else:
        k["id"] = "o" + secrets.token_hex(4)
        f["odemeler"].append(k)
    _kaydet(f)
    return {"tamam": True, "id": k["id"]}


@app.delete("/api/odeme/{oid}")
def odeme_sil(oid: str):
    f = _finans()
    f["odemeler"] = [k for k in f["odemeler"] if k["id"] != oid]
    f["odeme_kayit"] = [o for o in f["odeme_kayit"] if o["kalem_id"] != oid]
    _kaydet(f)
    return {"tamam": True}


@app.post("/api/odeme/odendi")
async def odeme_odendi(req: Request):
    """Bir donemi odendi isaretler (ya da geri alir). Panel kendiliginden hicbir seyi odenmis saymaz."""
    g = await req.json()
    f = _finans()
    kalem = next((k for k in f["odemeler"] if k["id"] == g.get("kalem_id")), None)
    if not kalem or not g.get("donem"):
        raise HTTPException(400, "Kalem bulunamadı")
    f["odeme_kayit"] = [o for o in f["odeme_kayit"] if not (o["kalem_id"] == kalem["id"] and o["donem"] == g["donem"])]
    if not g.get("geri_al"):
        f["odeme_kayit"].append({"kalem_id": kalem["id"], "donem": g["donem"],
                                 "tutar": round(_sayi(g.get("tutar"), kalem.get("tutar") or 0), 2),
                                 "odeme_tarihi": date.today().isoformat()})
    _kaydet(f)
    return {"tamam": True}


@app.post("/api/odeme/sablon")
async def odeme_sablon(req: Request):
    """Hazir listeden secilenleri tutarsiz ekler; kullanici sonra tutari girer."""
    secilen = (await req.json()).get("adlar") or []
    f = _finans()
    var = {k["ad"] for k in f["odemeler"]}
    bugun = date.today()
    eklenen = 0
    for s in od.SABLONLAR:
        if s["ad"] in secilen and s["ad"] not in var:
            f["odemeler"].append({"id": "o" + secrets.token_hex(4), "ad": s["ad"], "kategori": s["kategori"],
                                  "sahip": s["sahip"], "siklik": s["siklik"], "tutar": 0.0,
                                  "degisken": bool(s.get("degisken")), "tarih": od.sablon_baslangic(s, bugun),
                                  "bitis": None, "yol": "Havale / EFT", "kart_id": "", "aktif": True,
                                  "not": "Hazır listeden eklendi: tutarı ve tarihi kontrol edin."})
            eklenen += 1
    _kaydet(f)
    return {"tamam": True, "eklenen": eklenen}


@app.get("/api/odeme/sablonlar")
def odeme_sablonlar():
    var = {k["ad"] for k in _finans()["odemeler"]}
    return {"sablonlar": [dict(s, var=s["ad"] in var) for s in od.SABLONLAR],
            "kategoriler": od.KATEGORILER, "yollar": od.YOLLAR}


@app.post("/api/hesap")
async def hesap_kaydet(req: Request):
    g = await req.json()
    f = _finans()
    eski = next((h for h in f["hesaplar"] if h["id"] == g.get("id")), None) if g.get("id") else None
    h = dict(eski or {})
    for a in ("ad", "banka", "tur", "sahip", "not"):
        if a in g:
            h[a] = str(g[a] or "").strip()
    if "kmh_limit" in g:
        h["kmh_limit"] = round(_sayi(g["kmh_limit"]), 2)
    if "faiz" in g:
        h["faiz"] = round(_sayi(g["faiz"]), 4) if g["faiz"] not in (None, "") else None
    if "bakiye" in g:
        if eski is None or _sayi(g["bakiye"]) != eski.get("bakiye"):
            h["guncelleme"] = date.today().isoformat()
        h["bakiye"] = round(_sayi(g["bakiye"]), 2)
    if not h.get("ad") and not h.get("banka"):
        raise HTTPException(400, "Hesap adı ya da banka girilmeli")
    if eski:
        f["hesaplar"][f["hesaplar"].index(eski)] = h
    else:
        h["id"] = "h" + secrets.token_hex(4)
        h.setdefault("guncelleme", date.today().isoformat())
        f["hesaplar"].append(h)
    _kaydet(f)
    return {"tamam": True, "id": h["id"]}


@app.delete("/api/hesap/{hid}")
def hesap_sil(hid: str):
    f = _finans()
    f["hesaplar"] = [h for h in f["hesaplar"] if h["id"] != hid]
    _kaydet(f)
    return {"tamam": True}


def _kredi_olaylari(k: dict, bugun: date, bit: date) -> list[dict]:
    h = k["hesap"]
    if not h["kalan_taksit"]:
        return []
    ilk = date.fromisoformat(k["ilk_taksit"])
    sonuc = []
    for i in range(h["odenen"], k["vade"]):
        d = _ay_gunu(*_ay_ekle(ilk, i), ilk.day)
        if d > bit:
            break
        sonuc.append({"kaynak": "kredi", "kredi_id": k["id"], "tarih": d.isoformat(), "tutar": h["taksit"],
                      "taksit_no": i + 1, "durum": "taksit"})
    return sonuc


def _kredi_tarih(k: dict, i: int) -> date:
    ilk = date.fromisoformat(k["ilk_taksit"])
    return _ay_gunu(*_ay_ekle(ilk, i), ilk.day)


@app.post("/api/ayarlar")
async def ayarlar_kaydet(req: Request):
    g = await req.json()
    f = _finans()
    a = f.setdefault("ayarlar", {})
    for k in fz.VARSAYILAN_AYAR:
        if k in g and g[k] not in (None, ""):
            a[k] = round(_sayi(g[k]), 4)
    _kaydet(f)
    return {"tamam": True}


@app.get("/")
def ana():
    return FileResponse(STATIK / "index.html")


@app.get("/api/durum")
def durum():
    """Panelin tek cagrida ihtiyac duydugu her sey: kartlar (+takvim), ekstreler, ozet."""
    f = _finans()
    bugun = date.today()
    kartlar = [dict(k, takvim=_takvim(k, bugun)) for k in f["kartlar"]]
    ekstreler = sorted((dict(e, durum=_ekstre_durum(e, bugun), ozet=isl.ozet(e)) for e in f["ekstreler"]),
                       key=lambda e: e.get("son_odeme_tarihi") or "", reverse=True)
    aktif = [k for k in kartlar if k.get("aktif", True)]
    limit = sum(k.get("limit") or 0 for k in aktif)
    borc = sum(k.get("guncel_borc") or 0 for k in aktif)

    # yaklasan odemeler: odenmemis ekstreler + ekstresi girilmemis kartlarin siradaki son odemesi
    yaklasan, ekstreli = [], set()
    for e in ekstreler:
        if e["durum"] in ("bekliyor", "kismi", "gecikti"):
            ekstreli.add(e["kart_id"])
            yaklasan.append({"kart_id": e["kart_id"], "tarih": e.get("son_odeme_tarihi"), "kaynak": "ekstre",
                             "tutar": round(_sayi(e.get("toplam")) - _sayi(e.get("odenen")), 2),
                             "asgari": _sayi(e.get("asgari")), "durum": e["durum"]})
    for k in aktif:
        if k["id"] not in ekstreli and k["takvim"]:
            yaklasan.append({"kart_id": k["id"], "tarih": k["takvim"]["sonraki_odeme"], "kaynak": "tahmin",
                             "tutar": k.get("guncel_borc") or 0, "asgari": None, "durum": "tahmini"})
    krediler = [dict(k, hesap=_kredi_hesap(k, bugun)) for k in f["krediler"]]
    acik = [k for k in krediler if k["hesap"]["kalan_taksit"]]
    for k in acik:
        yaklasan.append({"kredi_id": k["id"], "tarih": k["hesap"]["sonraki"], "kaynak": "kredi",
                         "tutar": k["hesap"]["taksit"], "asgari": None, "durum": "taksit"})
    otuz = (bugun + timedelta(days=30)).isoformat()
    odeme_olay = od.takvim(f, bugun)
    yaklasan += [dict(o, karttan=o["yol"] == "Kredi kartı") for o in odeme_olay
                 if o["durum"] in ("bekliyor", "gecikti") and o["tarih"] <= otuz]
    yaklasan.sort(key=lambda y: y["tarih"] or "9999")

    # nakit: bilinen cikislar (kartla odenen kalemler kart ekstresinde sayildigi icin haric)
    kart_olay = [y for y in yaklasan if y.get("kart_id") and y["kaynak"] in ("ekstre", "tahmin")]
    nakit_toplam = sum(h.get("bakiye") or 0 for h in f["hesaplar"])
    pencere = {}
    for n in (30, 60, 90):
        sinir = (bugun + timedelta(days=n)).isoformat()
        kalemler = ([o for o in odeme_olay if o["durum"] in ("bekliyor", "gecikti") and o["yol"] != "Kredi kartı"]
                    + kart_olay + [e for k in acik for e in _kredi_olaylari(k, bugun, bugun + timedelta(days=n))])
        cikis = sum(x["tutar"] for x in kalemler if x["tarih"] <= sinir)
        pencere[str(n)] = {"cikis": round(cikis, 2), "kalan": round(nakit_toplam - cikis, 2)}
    odeme_kalemleri = []
    for k in f["odemeler"]:
        sonraki = next((o for o in odeme_olay if o["kalem_id"] == k["id"] and o["tarih"] >= bugun.isoformat()
                        and o["durum"] != "odendi"), None)
        odeme_kalemleri.append(dict(k, aylik=round(od.aylik_esdeger(k), 2), sonraki=sonraki["tarih"] if sonraki else None))
    aktif_odeme = [k for k in odeme_kalemleri if k.get("aktif", True)]
    # her kartin en son ekstresi: gerceklesen faiz+vergi ve kalan taksit yuku
    son_ekstre = {}
    for e in ekstreler:
        if e["kart_id"] not in son_ekstre or e["kesim_tarihi"] > son_ekstre[e["kart_id"]]["kesim_tarihi"]:
            son_ekstre[e["kart_id"]] = e
    return {
        "surum": SURUM, "bugun": bugun.isoformat(), "guvenlik": _guvenlik_ozet(), "kartlar": kartlar, "ekstreler": ekstreler, "krediler": krediler, "yaklasan": yaklasan,
        "odemeler": odeme_kalemleri, "odeme_takvim": odeme_olay, "hesaplar": f["hesaplar"],
        "faiz": fz.hesapla(f, kartlar, ekstreler, krediler, odeme_olay, bugun, _kredi_tarih),
        "nakit": {"toplam": round(nakit_toplam, 2), "pencere": pencere, "hesap_sayisi": len(f["hesaplar"])},
        "ozet": {"kart_sayisi": len(aktif), "banka_sayisi": len({k["banka"] for k in aktif}),
                 "toplam_limit": round(limit, 2), "toplam_borc": round(borc, 2),
                 "kullanilabilir": round(limit - borc, 2), "doluluk": round(borc / limit * 100, 1) if limit else 0,
                 "otuz_gun_odeme": round(sum(y["tutar"] for y in yaklasan if (y["tarih"] or "") <= otuz and not y.get("karttan")), 2),
                 "sabit_aylik": round(sum(k["aylik"] for k in aktif_odeme), 2),
                 "sabit_aylik_sirket": round(sum(k["aylik"] for k in aktif_odeme if k.get("sahip") == "Şirket"), 2),
                 "abonelik_aylik": round(sum(k["aylik"] for k in aktif_odeme if k.get("kategori") == "Abonelik"), 2),
                 "geciken": sum(1 for o in odeme_olay if o["durum"] == "gecikti"),
                 "tutarsiz": sum(1 for k in aktif_odeme if not k.get("tutar")),
                 "kredi_sayisi": len(acik), "kredi_kalan": round(sum(k["hesap"]["kalan_odeme"] for k in acik), 2),
                 "kredi_anapara": round(sum(k["hesap"]["kalan_anapara"] for k in acik), 2),
                 "kredi_aylik": round(sum(k["hesap"]["taksit"] for k in acik), 2),
                 "ekstre_faiz": round(sum(e["ozet"]["faiz_vergi"] for e in son_ekstre.values()), 2),
                 "taksit_kalan": round(sum(e["ozet"]["taksit_kalan"] for e in son_ekstre.values()), 2),
                 "taksit_aylik": round(sum(e["ozet"]["taksit_aylik"] for e in son_ekstre.values()), 2)},
    }


@app.post("/api/kart")
async def kart_kaydet(req: Request):
    girdi = await req.json()
    f = _finans()
    kid = girdi.get("id")
    eski = next((k for k in f["kartlar"] if k["id"] == kid), None) if kid else None
    k = _kart_temizle(girdi, eski)
    if eski:
        f["kartlar"][f["kartlar"].index(eski)] = k
    else:
        k["id"] = "k" + secrets.token_hex(4)
        k["eklenme"] = date.today().isoformat()
        f["kartlar"].append(k)
    _kaydet(f)
    return {"tamam": True, "id": k["id"]}


@app.delete("/api/kart/{kid}")
def kart_sil(kid: str):
    f = _finans()
    f["kartlar"] = [k for k in f["kartlar"] if k["id"] != kid]
    f["ekstreler"] = [e for e in f["ekstreler"] if e["kart_id"] != kid]
    _kaydet(f)
    return {"tamam": True}


@app.post("/api/ekstre")
async def ekstre_kaydet(req: Request):
    g = await req.json()
    f = _finans()
    if not any(k["id"] == g.get("kart_id") for k in f["kartlar"]):
        raise HTTPException(400, "Kart seçilmeli")
    for a in ("kesim_tarihi", "son_odeme_tarihi"):
        try:
            date.fromisoformat(g.get(a) or "")
        except ValueError:
            raise HTTPException(400, "Tarihler eksik")
    e = {"kart_id": g["kart_id"], "kesim_tarihi": g["kesim_tarihi"], "son_odeme_tarihi": g["son_odeme_tarihi"],
         "toplam": round(_sayi(g.get("toplam")), 2), "asgari": round(_sayi(g.get("asgari")), 2),
         "odenen": round(_sayi(g.get("odenen")), 2), "not": str(g.get("not") or "").strip()}
    eski = next((x for x in f["ekstreler"] if x["id"] == g.get("id")), None) if g.get("id") else None
    if eski:
        e["id"] = eski["id"]
        e["islemler"] = eski.get("islemler", [])
        f["ekstreler"][f["ekstreler"].index(eski)] = e
    else:
        e["id"] = "e" + secrets.token_hex(4)
        f["ekstreler"].append(e)
    # en yeni ekstrenin kalan borcu kartin guncel borcu olarak da yazilsin
    kart = next(k for k in f["kartlar"] if k["id"] == e["kart_id"])
    son = max((x for x in f["ekstreler"] if x["kart_id"] == kart["id"]), key=lambda x: x["kesim_tarihi"])
    if son is e and g.get("borcu_guncelle", True):
        kart["guncel_borc"] = round(e["toplam"] - e["odenen"], 2)
    _kaydet(f)
    return {"tamam": True, "id": e["id"]}


@app.delete("/api/ekstre/{eid}")
def ekstre_sil(eid: str):
    f = _finans()
    f["ekstreler"] = [e for e in f["ekstreler"] if e["id"] != eid]
    _kaydet(f)
    return {"tamam": True}


def _ekstre_bul(f: dict, eid: str) -> dict:
    e = next((x for x in f["ekstreler"] if x["id"] == eid), None)
    if not e:
        raise HTTPException(404, "Ekstre bulunamadı")
    return e


@app.post("/api/islem")
async def islem_kaydet(req: Request):
    """Ekstreye islem ekle ya da var olanin notunu/kategorisini/turunu duzelt."""
    g = await req.json()
    f = _finans()
    e = _ekstre_bul(f, g.get("ekstre_id"))
    liste = e.setdefault("islemler", [])
    eski = next((i for i in liste if i["id"] == g.get("id")), None) if g.get("id") else None
    if not eski and not str(g.get("aciklama") or "").strip():
        raise HTTPException(400, "Açıklama gerekli")
    i = isl.temizle(g, eski, _sayi)
    if eski:
        liste[liste.index(eski)] = i
    else:
        i["id"] = "i" + secrets.token_hex(4)
        liste.append(i)
    liste.sort(key=lambda x: x.get("tarih") or "")
    _kaydet(f)
    return {"tamam": True, "id": i["id"]}


@app.delete("/api/islem/{eid}/{iid}")
def islem_sil(eid: str, iid: str):
    f = _finans()
    e = _ekstre_bul(f, eid)
    e["islemler"] = [i for i in e.get("islemler", []) if i["id"] != iid]
    _kaydet(f)
    return {"tamam": True}


@app.post("/api/ice-aktar")
async def ice_aktar(req: Request):
    """Hazirlanmis dosyadan kart + ekstre + islem yukler.
    Kart banka + son 4 haneye gore eslesir (yoksa eklenir), ekstre kart + kesim tarihine gore eslesir.
    Islemlere yazilmis 'Ne için' notlari ve elle secilen kategoriler korunur."""
    g = await req.json()
    if not isinstance(g, dict) or not isinstance(g.get("kartlar", []), list):
        raise HTTPException(400, "Dosya biçimi tanınmadı")
    f = _finans()
    sonuc = {"kart_yeni": 0, "kart_guncel": 0, "ekstre_yeni": 0, "ekstre_guncel": 0, "islem": 0}
    for gk in g.get("kartlar", []):
        son4 = "".join(c for c in str(gk.get("son4") or "") if c.isdigit())[-4:]
        kart = next((k for k in f["kartlar"] if k["banka"] == gk.get("banka") and k.get("son4") == son4), None)
        ekstreler = gk.pop("ekstreler", []) or []
        temiz = _kart_temizle(gk, kart)
        if kart:
            f["kartlar"][f["kartlar"].index(kart)] = temiz
            sonuc["kart_guncel"] += 1
        else:
            temiz["id"] = "k" + secrets.token_hex(4)
            temiz["eklenme"] = date.today().isoformat()
            f["kartlar"].append(temiz)
            sonuc["kart_yeni"] += 1
        kart = temiz
        for ge in ekstreler:
            try:
                date.fromisoformat(ge.get("kesim_tarihi") or "")
                date.fromisoformat(ge.get("son_odeme_tarihi") or "")
            except ValueError:
                raise HTTPException(400, "Ekstre tarihleri eksik")
            eski = next((x for x in f["ekstreler"] if x["kart_id"] == kart["id"] and x["kesim_tarihi"] == ge["kesim_tarihi"]), None)
            e = dict(eski or {"id": "e" + secrets.token_hex(4)})
            e.update({"kart_id": kart["id"], "kesim_tarihi": ge["kesim_tarihi"], "son_odeme_tarihi": ge["son_odeme_tarihi"],
                      "toplam": round(_sayi(ge.get("toplam")), 2), "asgari": round(_sayi(ge.get("asgari")), 2),
                      "not": str(ge.get("not") or e.get("not") or "").strip()})
            if "odenen" in ge or not eski:
                e["odenen"] = round(_sayi(ge.get("odenen")), 2)
            for a in ("devreden", "donem_harcama", "donem_faiz", "donem_odeme", "kullanilabilir", "nakit_limit"):
                if a in ge:
                    e[a] = round(_sayi(ge[a]), 2)
            eski_isl = {(i.get("tarih"), i.get("aciklama"), i.get("tutar")): i for i in (eski or {}).get("islemler", [])}
            yeni = []
            for gi in ge.get("islemler", []):
                i = isl.temizle(gi, None, _sayi)
                o = eski_isl.get((i.get("tarih"), i.get("aciklama"), i.get("tutar")))
                i["id"] = o["id"] if o else "i" + secrets.token_hex(4)
                if o and o.get("not"):          # panelde yazilan not dosyadakinden onceliklidir
                    i["not"] = o["not"]
                if o and o.get("kategori") and not gi.get("kategori"):
                    i["kategori"] = o["kategori"]
                yeni.append(i)
            e["islemler"] = sorted(yeni, key=lambda x: x.get("tarih") or "")
            sonuc["islem"] += len(yeni)
            if eski:
                f["ekstreler"][f["ekstreler"].index(eski)] = e
                sonuc["ekstre_guncel"] += 1
            else:
                f["ekstreler"].append(e)
                sonuc["ekstre_yeni"] += 1
    for gh in g.get("hesaplar", []) or []:
        eski = next((h for h in f["hesaplar"] if h.get("banka") == gh.get("banka") and h.get("ad") == gh.get("ad")), None)
        h = dict(eski or {"id": "h" + secrets.token_hex(4)})
        for a in ("ad", "banka", "tur", "sahip", "not"):
            if a in gh:
                h[a] = str(gh[a] or "").strip()
        for a in ("bakiye", "kmh_limit", "faiz"):
            if a in gh:
                h[a] = round(_sayi(gh[a]), 2)
        h["guncelleme"] = gh.get("guncelleme") or date.today().isoformat()
        if eski:
            f["hesaplar"][f["hesaplar"].index(eski)] = h
        else:
            f["hesaplar"].append(h)
        sonuc["hesap"] = sonuc.get("hesap", 0) + 1
    _kaydet(f)
    return {"tamam": True, **sonuc}


@app.get("/api/yedek")
def yedek_indir():
    return Response(json.dumps(_finans(), ensure_ascii=False, indent=2), media_type="application/json",
                    headers={"Content-Disposition": f'attachment; filename="finansal-kader-{date.today()}.json"'})
