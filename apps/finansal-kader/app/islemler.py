"""Ekstre islemleri: tur/kategori tahmini, taksit takibi, ozet."""
from __future__ import annotations

import re

TURLER = {
    "harcama": "Harcama", "taksit": "Taksit", "odeme": "Ödeme", "iade": "İade",
    "faiz": "Faiz", "vergi": "Vergi (KKDF/BSMV)", "ucret": "Ücret / komisyon", "nakit": "Nakit avans",
}

# (anahtar kelimeler, kategori) - ilk eslesen kazanir; aciklama BUYUK harfe cevrilip aranir
KURALLAR = [
    (("KKDF", "BSMV"), "Faiz vergisi"),
    (("FAIZ", "FAİZ"), "Kart faizi"),
    (("YILLIK UCRET", "KART AIDATI", "KART ÜCRETİ", "UCRETI", "ÜCRETİ", "KOMISYON", "KOMİSYON"), "Banka ücreti"),
    (("SIGORTA", "SİGORTA", "ANADOLU HAYAT", "ALLIANZ", "AXA", "MAPFRE", "AKSIGORTA", "HDI"), "Sigorta"),
    (("VERGI", "VERGİ", "GIB", "GİB", "MAL MUDURLUGU", "BELEDIYE", "BELEDİYE", "MTV"), "Vergi / harç"),
    (("SGK", "BAGKUR", "BAĞKUR"), "SGK / Bağ-Kur"),
    (("FACEBK", "FACEBOOK", "META ", "META*", "GOOGLE ADS", "GOOGLE *ADS", "TIKTOK ADS"), "Reklam"),
    (("IKAS", "İKAS", "SHOPIFY", "ETSY", "WIX", "HOSTING", "GODADDY", "CLOUDFLARE", "ORACLE"), "E-ticaret altyapı"),
    (("CLAUDE", "ANTHROPIC", "OPENAI", "CHATGPT", "HIGGSFIELD", "ADOBE", "CANVA", "CAPCUT", "MIDJOURNEY"), "Yazılım / yapay zeka"),
    (("NETFLIX", "SPOTIFY", "YOUTUBE", "APPLE.COM", "ICLOUD", "DISNEY", "AMAZON PRIME", "EXXEN", "BLUTV", "GAIN"), "Abonelik"),
    (("TURKCELL", "VODAFONE", "TURK TELEKOM", "TÜRK TELEKOM", "SUPERONLINE", "TTNET"), "Telefon / internet"),
    (("ENERJISA", "CK ENERJI", "IGDAS", "İGDAŞ", "ISKI", "İSKİ", "ELEKTRIK", "ELEKTRİK", "DOGALGAZ", "DOĞALGAZ"), "Fatura"),
    (("ARAS KARGO", "YURTICI", "YURTİÇİ", "MNG", "PTT", "SURAT", "SÜRAT", "HEPSIJET", "KOLAY GELSIN"), "Kargo"),
    (("MIGROS", "A101", "BIM", "BİM", "SOK MARKET", "ŞOK", "CARREFOUR", "MACRO", "FILE MARKET"), "Market"),
    (("SHELL", "OPET", "PETROL", "TOTAL", "AYTEMIZ", "BP ", "PO ", "LUKOIL"), "Akaryakıt"),
    (("YEMEKSEPETI", "YEMEKSEPETİ", "GETIR", "GETİR", "TRENDYOL YEMEK", "RESTORAN", "CAFE", "KAFE", "BURGER", "PIDE", "KEBAP"), "Yemek"),
    (("TRENDYOL", "HEPSIBURADA", "AMAZON", "N11", "CICEKSEPETI", "ÇİÇEKSEPETİ", "TEMU", "ALIEXPRESS"), "Online alışveriş"),
    (("ECZANE", "HASTANE", "KLINIK", "KLİNİK", "DIS ", "DİŞ "), "Sağlık"),
    (("PAYTR", "IYZICO", "İYZİCO", "PARAM", "PAPARA", "SIPAY"), "Online ödeme (aracı firma)"),
]


def _buyuk(s: str) -> str:
    return (s or "").replace("i", "İ").replace("ı", "I").upper()


def tur_tahmin(aciklama: str, tutar: float, taksit: str = "") -> str:
    a = _buyuk(aciklama)
    if "KKDF" in a or "BSMV" in a:
        return "vergi"
    if "FAIZ" in a or "FAİZ" in a:
        return "faiz"
    if "IADE" in a or "İADE" in a:
        return "iade"
    if tutar < 0:
        return "odeme"
    if "NAKIT AVANS" in a or "NAKİT AVANS" in a:
        return "nakit"
    if re.search(r"UCRET|ÜCRET|AIDAT|KOMISYON|KOMİSYON", a):
        return "ucret"
    if taksit_bilgi(aciklama, {"taksit": taksit}) or re.search(r"\d+\.\s*TAK\b|TAKS[Iİ]T", a):
        return "taksit"
    return "harcama"


def kategori_tahmin(aciklama: str) -> str:
    a = _buyuk(aciklama)
    for anahtarlar, kat in KURALLAR:
        if any(_buyuk(k) in a for k in anahtarlar):
            return kat
    return ""


def taksit_bilgi(aciklama: str, i: dict) -> tuple[int, int] | None:
    """'7/9' ya da aciklamadaki '... 7/9 taksit' bilgisinden (kacinci, toplam)."""
    s = i.get("taksit") or aciklama or ""
    m = re.search(r"(\d{1,2})\s*/\s*(\d{1,2})", s)
    if not m:
        return None
    n, t = int(m.group(1)), int(m.group(2))
    return (n, t) if 1 <= n <= t <= 36 else None


def temizle(g: dict, eski: dict | None, sayi) -> dict:
    i = dict(eski or {})
    for a in ("tarih", "aciklama", "not", "kart_son4", "taksit", "bilgi"):
        if a in g:
            i[a] = str(g[a] or "").strip()
    if "tutar" in g:
        i["tutar"] = round(sayi(g["tutar"]), 2)
    i.setdefault("tutar", 0.0)
    # tur: odeme/iade negatif tutarla girilmisse de dogru anlasilsin
    if g.get("tur") in TURLER:
        i["tur"] = g["tur"]
    elif not i.get("tur"):
        i["tur"] = tur_tahmin(i.get("aciklama", ""), i["tutar"], i.get("taksit", ""))
    if i["tur"] in ("odeme", "iade"):
        i["tutar"] = -abs(i["tutar"])
    else:
        i["tutar"] = abs(i["tutar"])
    if "kategori" in g:
        i["kategori"] = str(g["kategori"] or "").strip()
    i["tahmin"] = kategori_tahmin(i.get("aciklama", ""))
    if i["tur"] in ("faiz",):
        i["tahmin"] = "Kart faizi"
    elif i["tur"] == "vergi":
        i["tahmin"] = "Faiz vergisi"
    return i


def ozet(e: dict) -> dict:
    """Bir ekstrenin islemlerinden ozet: harcama, faiz+vergi, odeme, iade, taksit yuku."""
    t = {"harcama": 0.0, "faiz_vergi": 0.0, "odeme": 0.0, "iade": 0.0, "kategoriler": {}, "taksitler": []}
    islemler = e.get("islemler") or []
    iadeler = [i for i in islemler if i.get("tur") == "iade"]
    for i in islemler:
        tur, tutar = i.get("tur"), i.get("tutar") or 0
        if tur in ("faiz", "vergi", "ucret"):
            t["faiz_vergi"] += tutar
        elif tur == "odeme":
            t["odeme"] += -tutar
        elif tur == "iade":
            t["iade"] += -tutar
        else:
            t["harcama"] += tutar
            kat = i.get("kategori") or i.get("tahmin") or "Belirsiz"
            t["kategoriler"][kat] = round(t["kategoriler"].get(kat, 0) + tutar, 2)
        if tur == "taksit":
            tb = taksit_bilgi(i.get("aciklama", ""), i)
            if not tb:
                continue
            n, top = tb
            # ayni tutar ve ayni taksit numarasi iade edildiyse plan iptal sayilir
            iptal = any(abs(abs(r.get("tutar") or 0) - tutar) < 0.01 and taksit_bilgi(r.get("aciklama", ""), r) == tb
                        for r in iadeler)
            kalan = 0 if iptal else top - n
            t["taksitler"].append({"islem_id": i.get("id"), "aciklama": i.get("aciklama"), "kategori": i.get("kategori") or i.get("tahmin"),
                                   "taksit": tutar, "kacinci": n, "toplam": top, "kalan_taksit": kalan,
                                   "kalan_tutar": round(kalan * tutar, 2), "iptal": iptal})
    for a in ("harcama", "faiz_vergi", "odeme", "iade"):
        t[a] = round(t[a], 2)
    t["taksit_kalan"] = round(sum(x["kalan_tutar"] for x in t["taksitler"]), 2)
    t["taksit_aylik"] = round(sum(x["taksit"] for x in t["taksitler"] if x["kalan_taksit"]), 2)
    t["adet"] = len(islemler)
    return t
