"""ikas_cek.py çıktısını kâr-zarar uygulamasının "ikas dosyası yükle" formatına çevirir.
Kullanım: python3 ikas_donustur.py ham.json cikti.json"""
import json, re, sys
from datetime import datetime, timezone, timedelta

TR = timezone(timedelta(hours=3))

# DM/havale siparişleri ikas'a 0 TL girilir, fiyat notta yazar (Fatih, 19 Eki 2026).
# tutar -> (ahşap, pleksi). 50 TL fazlası ahşap yazısıdır.
NOT_FIYAT = {600: (1, 1), 750: (1, 1), 800: (1, 1), 850: (1, 1),
             1000: (1, 2), 1050: (1, 2), 1200: (2, 2), 1250: (2, 2), 1400: (2, 4), 1450: (2, 4)}

URUN = [("spotify", "Spotify lambası"), ("melodi", "Spotify lambası"), ("yıldız", "Yıldız haritası lambası"),
        ("araç", "Araç lambası"), ("çocuk", "Çocuk lambası"), ("figürlü", "Çocuk lambası"),
        ("animasyon", "Anime fotoğraf lambası"), ("fotoğraf", "Anime fotoğraf lambası")]

def urun_adi(ad):
    k = ad.lower()
    return next((v for a, v in URUN if a in k), "Diğer")

def ikinci_pleksi(li):
    return any("2. Fotoğraflı Pleksi" in op["name"] and any(v["value"] == "true" for v in op["values"])
               for op in li.get("options") or [])

def odeme(o):
    gw = (o["paymentMethods"] or [{}])[0]
    if gw.get("type") == "CREDIT_CARD":
        sat = [t for t in o.get("transactions", []) if t["type"] == "SALE" and t["status"] == "SUCCESS"]
        taksit = max([((t.get("paymentMethodDetail") or {}).get("installment") or {}).get("installmentCount") or 1
                      for t in sat] or [1])
        return "taksit" if taksit > 1 else "kart"
    if "Kapıda" in (gw.get("paymentGatewayName") or ""):
        return "kapida"
    return "havale"

def donustur(o):
    tarih = datetime.fromtimestamp(o["orderedAt"] / 1000, TR).strftime("%Y-%m-%d")
    urun = urun_adi(o["orderLineItems"][0]["variant"]["name"]) if o["orderLineItems"] else "Diğer"
    s = {"no": o["orderNumber"], "tarih": tarih, "kanal": "ikas (site)", "urun": urun,
         "durum": "iade" if o["status"] == "REFUNDED" else "tamam", "kaynak": "ikas"}
    if o["totalFinalPrice"] == 0:
        notu = (o.get("note") or "").strip()
        m = re.match(r"(\d+)", notu)
        if not m:
            return None  # notunda tutar yok: hesaba katılmaz
        tutar = int(m.group(1))
        ahsap, pleksi = NOT_FIYAT.get(tutar, (None, None))
        m_a, m_p = re.search(r"(\d+)\s*ahşap", notu), re.search(r"(\d+)\s*pleksi", notu)
        if m_a or m_p:  # notta açıkça yazılmışsa onu kullan ("1600 10 ahşap", "300 1 pleksi + kargo")
            ahsap = int(m_a.group(1)) if m_a else 0
            pleksi = int(m_p.group(1)) if m_p else 0
        kontrol = ahsap is None
        if kontrol:  # bilinmeyen tutar: ~700 TL'ye bir lamba say
            ahsap = pleksi = max(1, round(tutar / 700))
        s.update(kanal="DM (havale)", tutar=tutar, odeme="havale", adet=max(ahsap, 1),
                 ahsap=ahsap, pleksi=pleksi, notu=notu, kontrol=kontrol)
        return s
    adet = sum(li["quantity"] for li in o["orderLineItems"])
    pleksi = sum(li["quantity"] * (2 if ikinci_pleksi(li) else 1) for li in o["orderLineItems"])
    s.update(tutar=o["totalFinalPrice"], odeme=odeme(o), adet=adet, ahsap=adet, pleksi=pleksi,
             notu=(o.get("note") or "").strip(), kontrol=False)
    return s

def donustur_hepsi(ham):
    return [s for o in ham if o["status"] != "CANCELLED" for s in [donustur(o)] if s]

def main(girdi, cikti):
    out = donustur_hepsi(json.load(open(girdi)))
    json.dump({"tur": "ikas-siparis", "siparisler": out}, open(cikti, "w"), ensure_ascii=False, indent=1)
    print(len(ham), "ham,", len(out), "aktarıldı,", sum(s["kontrol"] for s in out), "kontrol gerekli")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
