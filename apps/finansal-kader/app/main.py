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

from . import totp

KOK = Path(__file__).resolve().parent.parent
VERI = KOK / "veri"
VERI.mkdir(exist_ok=True)
STATIK = Path(__file__).resolve().parent / "static"
SURUM = "0.2"

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
    elif re.fullmatch(r"\d{1,3}(\.\d{3})+", s):   # 62.300 -> 62300 (binlik nokta)
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


@app.get("/")
def ana():
    return FileResponse(STATIK / "index.html")


@app.get("/api/durum")
def durum():
    """Panelin tek cagrida ihtiyac duydugu her sey: kartlar (+takvim), ekstreler, ozet."""
    f = _finans()
    bugun = date.today()
    kartlar = [dict(k, takvim=_takvim(k, bugun)) for k in f["kartlar"]]
    ekstreler = sorted((dict(e, durum=_ekstre_durum(e, bugun)) for e in f["ekstreler"]),
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
    yaklasan.sort(key=lambda y: y["tarih"] or "9999")
    otuz = (bugun + timedelta(days=30)).isoformat()
    return {
        "surum": SURUM, "bugun": bugun.isoformat(), "guvenlik": _guvenlik_ozet(), "kartlar": kartlar, "ekstreler": ekstreler, "yaklasan": yaklasan,
        "ozet": {"kart_sayisi": len(aktif), "banka_sayisi": len({k["banka"] for k in aktif}),
                 "toplam_limit": round(limit, 2), "toplam_borc": round(borc, 2),
                 "kullanilabilir": round(limit - borc, 2), "doluluk": round(borc / limit * 100, 1) if limit else 0,
                 "otuz_gun_odeme": round(sum(y["tutar"] for y in yaklasan if (y["tarih"] or "") <= otuz), 2)},
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


@app.get("/api/yedek")
def yedek_indir():
    return Response(json.dumps(_finans(), ensure_ascii=False, indent=2), media_type="application/json",
                    headers={"Content-Disposition": f'attachment; filename="finansal-kader-{date.today()}.json"'})
