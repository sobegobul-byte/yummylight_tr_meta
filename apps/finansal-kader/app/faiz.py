"""Faiz ve gecikme maliyetleri (yaklasik). Oranlar kullanicinin girdigi aylik yuzdelerdir.

Kart: ekstre tam odenmezse kalan kisma akdi faiz, asgarinin odenmeyen kismina gecikme faizi; ustune KKDF+BSMV
(ayarlar.kart_vergi, varsayilan %30). Kredi: kalan anaparanin bu ayki faiz payi + geciken taksitlere gecikme faizi.
Vergi/SGK: gecikme zammi (ayarlar.vergi_gecikme, aylik %). Bankalar gun bazli ve donem basindan hesaplar;
buradaki rakamlar karar vermek icin yaklasik degerlerdir.
"""
from __future__ import annotations

from datetime import date

VARSAYILAN_AYAR = {"kart_vergi": 30.0, "vergi_gecikme": 4.5}


def _ayar(f: dict) -> dict:
    return {**VARSAYILAN_AYAR, **(f.get("ayarlar") or {})}


def hesapla(f: dict, kartlar: list, ekstreler: list, krediler: list, odeme_olay: list, bugun: date,
            kredi_tarih) -> dict:
    a = _ayar(f)
    kv = 1 + a["kart_vergi"] / 100
    kalemler = []

    # --- kartlar
    son_ekstre = {}
    for e in ekstreler:
        if e["kart_id"] not in son_ekstre or e["kesim_tarihi"] > son_ekstre[e["kart_id"]]["kesim_tarihi"]:
            son_ekstre[e["kart_id"]] = e
    for k in kartlar:
        if k.get("aktif") is False:
            continue
        akdi, gec = (k.get("akdi_faiz") or 0) / 100, (k.get("gecikme_faiz") or 0) / 100
        ad = k["banka"] + (" · " + k["kart_adi"] if k.get("kart_adi") else "")
        e = son_ekstre.get(k["id"])
        if e and e["durum"] in ("gecikti", "asgari_odendi"):
            kalan = max(e["toplam"] - e["odenen"], 0)
            eksik_asgari = max(e["asgari"] - e["odenen"], 0) if e["durum"] == "gecikti" else 0
            aylik = ((kalan - eksik_asgari) * akdi + eksik_asgari * (gec or akdi)) * kv
            gun = (bugun - date.fromisoformat(e["son_odeme_tarihi"])).days
            kalemler.append({"kaynak": "kart", "ad": ad, "borc": kalan, "oran": k.get("akdi_faiz"),
                             "oran2": k.get("gecikme_faiz") if eksik_asgari else None, "aylik": aylik,
                             "birikmis": aylik * gun / 30, "gun": gun, "durum": e["durum"], "eksik_oran": not akdi})
        elif k.get("guncel_borc"):
            kalemler.append({"kaynak": "kart", "ad": ad, "borc": k["guncel_borc"], "oran": k.get("akdi_faiz"),
                             "aylik": k["guncel_borc"] * akdi * kv, "birikmis": 0, "gun": 0, "durum": "risk",
                             "eksik_oran": not akdi})

    # --- krediler
    for c in krediler:
        h = c["hesap"]
        if not h["kalan_taksit"]:
            continue
        ad = c["banka"] + " · " + (c.get("ad") or c.get("tur") or "Kredi")
        r = (c.get("faiz") or 0) / 100
        kalemler.append({"kaynak": "kredi", "ad": ad, "borc": h["kalan_anapara"], "oran": c.get("faiz"),
                         "aylik": h["kalan_anapara"] * r, "kalan_faiz": max(h["kalan_odeme"] - h["kalan_anapara"], 0),
                         "birikmis": 0, "gun": 0, "durum": "normal", "eksik_oran": not r})
        vadesi_gecen = [kredi_tarih(c, i) for i in range(h["odenen"], c["vade"]) if kredi_tarih(c, i) < bugun]
        if vadesi_gecen:
            g = (c.get("gecikme_faiz") or (c.get("faiz") or 0) * 1.3) / 100
            birikmis = sum(h["taksit"] * g * (bugun - d).days / 30 for d in vadesi_gecen)
            kalemler.append({"kaynak": "kredi_gecikme", "ad": ad + f" ({len(vadesi_gecen)} geciken taksit)",
                             "borc": h["taksit"] * len(vadesi_gecen), "oran": round(g * 100, 2),
                             "aylik": h["taksit"] * len(vadesi_gecen) * g, "birikmis": birikmis,
                             "gun": (bugun - vadesi_gecen[0]).days, "durum": "gecikti", "eksik_oran": not g})

    # --- eksi hesap (KMH): negatif bakiyeye aylik faiz + KKDF/BSMV
    for h in f.get("hesaplar", []):
        if (h.get("bakiye") or 0) >= 0:
            continue
        r = (h.get("faiz") or 0) / 100
        borc = -h["bakiye"]
        kalemler.append({"kaynak": "kmh", "ad": (h.get("banka") or "") + " · " + (h.get("ad") or "Eksi hesap"), "borc": borc,
                         "oran": h.get("faiz"), "aylik": borc * r * kv, "birikmis": 0, "gun": 0, "durum": "normal",
                         "eksik_oran": not r})

    # --- geciken vergi / SGK
    vg = a["vergi_gecikme"] / 100
    for o in odeme_olay:
        if o["durum"] != "gecikti" or not o["tutar"]:
            continue
        gun = (bugun - date.fromisoformat(o["tarih"])).days
        hesaplanir = o.get("kategori") in ("Vergi", "SGK / Bağ-Kur")
        kalemler.append({"kaynak": "odeme", "ad": o["ad"], "borc": o["tutar"], "oran": a["vergi_gecikme"] if hesaplanir else None,
                         "aylik": o["tutar"] * vg if hesaplanir else 0, "birikmis": o["tutar"] * vg * gun / 30 if hesaplanir else 0,
                         "gun": gun, "durum": "gecikti", "eksik_oran": False, "hesaplanmadi": not hesaplanir})

    for x in kalemler:
        for alan in ("borc", "aylik", "birikmis", "kalan_faiz"):
            if alan in x:
                x[alan] = round(x[alan], 2)
    gercek = [x for x in kalemler if x["durum"] != "risk"]
    return {
        "kalemler": kalemler, "ayarlar": a,
        "aylik_yuk": round(sum(x["aylik"] for x in gercek), 2),                 # su an islemekte olan aylik faiz
        "gecikme_birikmis": round(sum(x["birikmis"] for x in kalemler), 2),   # gecikmelerden birikmis tahmini
        "kart_risk": round(sum(x["aylik"] for x in kalemler if x["durum"] == "risk"), 2),
        "kredi_kalan_faiz": round(sum(x.get("kalan_faiz", 0) for x in kalemler), 2),
        "eksik_oran": sum(1 for x in kalemler if x.get("eksik_oran")),
    }
