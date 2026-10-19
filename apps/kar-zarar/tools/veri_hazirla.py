"""ikas siparişleri + Meta günlük harcamasını uygulamanın "Güncel veriyi yükle" dosyasında birleştirir.
Kullanım: python3 veri_hazirla.py ikas-YYYY-MM.json meta-YYYY-MM.json cikti.json
meta dosyası: {"gunluk": {"YYYY-MM-DD": tutar, ...}} (Meta amount_spent, KDV hariç)"""
import json, sys
from datetime import datetime, timezone, timedelta

ikas, meta, cikti = sys.argv[1:4]
siparisler = json.load(open(ikas))["siparisler"]
gunluk = json.load(open(meta))["gunluk"]
reklam = [{"tarih": t, "platform": "Meta", "tutar": round(v, 2)} for t, v in sorted(gunluk.items()) if v]
simdi = datetime.now(timezone(timedelta(hours=3))).strftime("%d.%m.%Y %H:%M")
json.dump({"tur": "kar-zarar-veri", "guncelleme": simdi, "siparisler": siparisler, "reklamGunluk": reklam},
          open(cikti, "w"), ensure_ascii=False, indent=1)
print(len(siparisler), "sipariş,", len(reklam), "gün reklam,", round(sum(r["tutar"] for r in reklam)), "TL ->", cikti)
