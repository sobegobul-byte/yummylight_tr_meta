"""Kâr-zarar uygulamasını bu bilgisayarda açar; "Güncel verileri çek" butonu ikas ve Meta'dan anında çeker.
Çalıştırma: baslat.bat (ya da: python sunucu.py). Adres: http://localhost:8101"""
import json, os, sys, traceback
from datetime import datetime, timezone, timedelta
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse, parse_qs

KLASOR = Path(__file__).resolve().parent
UYGULAMA = KLASOR.parent           # kar-zarar.html burada
VERI = UYGULAMA / "veri"
sys.path.insert(0, str(KLASOR))
import ikas_cek, ikas_donustur, meta_cek  # noqa: E402

TR = timezone(timedelta(hours=3))
PORT = 8101


def ayarlari_yukle():
    """Önce kendi ayarları, eksik ikas bilgileri varsa Sipariş Merkezi'nin ayarlarından."""
    adaylar = [VERI / "ayarlar.json",
               UYGULAMA.parent.parent / "Sipariş Merkezi" / "Uygulama" / "veri" / "ayarlar.json"]
    for dosya in adaylar:
        if dosya.exists():
            for k, v in json.loads(dosya.read_text(encoding="utf-8")).items():
                if v and not os.environ.get(k):
                    os.environ[k] = str(v)


def guncelle(ay):
    sonuc = {"tur": "kar-zarar-veri", "guncelleme": datetime.now(TR).strftime("%d.%m.%Y %H:%M"),
             "siparisler": ikas_donustur.donustur_hepsi(ikas_cek.cek(ay)), "reklamGunluk": [], "uyarilar": []}
    if os.environ.get("META_TOKEN"):
        try:
            sonuc["reklamGunluk"] = [{"tarih": t, "platform": "Meta", "tutar": round(v, 2)}
                                     for t, v in sorted(meta_cek.gunluk_harcama(ay).items()) if v]
        except Exception as e:  # Meta çalışmasa da ikas verisi gelsin
            sonuc["uyarilar"].append(f"Meta harcaması çekilemedi: {e}")
    else:
        sonuc["uyarilar"].append("Meta erişim anahtarı girilmemiş, reklam harcaması güncellenmedi (ayarlar.bat).")
    return sonuc


class Isleyici(BaseHTTPRequestHandler):
    def _gonder(self, kod, govde, tur="application/json; charset=utf-8"):
        b = govde if isinstance(govde, bytes) else json.dumps(govde, ensure_ascii=False).encode()
        self.send_response(kod)
        self.send_header("Content-Type", tur)
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(b)

    def do_GET(self):
        if urlparse(self.path).path in ("/", "/index.html"):
            sayfa = UYGULAMA / "kar-zarar.html"
            if not sayfa.exists():
                sayfa = UYGULAMA / "index.html"  # repodaki hâli
            self._gonder(200, sayfa.read_bytes(), "text/html; charset=utf-8")
        else:
            self._gonder(404, {"hata": "bulunamadı"})

    def do_POST(self):
        u = urlparse(self.path)
        if u.path != "/api/guncelle":
            return self._gonder(404, {"hata": "bulunamadı"})
        ay = parse_qs(u.query).get("ay", [datetime.now(TR).strftime("%Y-%m")])[0]
        try:
            veri = guncelle(ay)
            VERI.mkdir(exist_ok=True)
            (VERI / f"veri-{ay}.json").write_text(json.dumps(veri, ensure_ascii=False), encoding="utf-8")
            self._gonder(200, veri)
        except Exception as e:
            traceback.print_exc()
            self._gonder(500, {"hata": str(e)})

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    ayarlari_yukle()
    if not os.environ.get("IKAS_CLIENT_ID"):
        print("UYARI: ikas bilgileri yok. ayarlar.bat ile girin.")
    print(f"Kâr-Zarar açık: http://localhost:{PORT}  (kapatmak için bu pencereyi kapatın)")
    ThreadingHTTPServer(("127.0.0.1", PORT), Isleyici).serve_forever()
