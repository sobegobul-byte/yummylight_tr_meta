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

# İsteğe bağlı 4. argüman: uygulama HTML'i. Verinin gömülü olduğu kopyası yanına yazılır,
# böylece dosya yüklemeden açınca dolu gelir.
if len(sys.argv) > 4:
    html = open(sys.argv[4]).read()
    veri = json.dumps(json.load(open(cikti)), ensure_ascii=False).replace("</", "<\\/")
    bas = '<script type="application/json" id="gomuluVeri">'
    i = html.index(bas) + len(bas)
    html = html[:i] + veri + html[html.index("</script>", i):]
    open(sys.argv[5] if len(sys.argv) > 5 else sys.argv[4], "w").write(html)
    print("gömülü HTML yazıldı")
