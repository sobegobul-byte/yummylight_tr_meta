"""Kâr-zarar ayarları: Meta erişim anahtarı (ve gerekirse ikas bilgileri) veri/ayarlar.json'a yazılır, sadece bu bilgisayarda kalır.
ikas bilgileri Sipariş Merkezi'nde kayıtlıysa onlar kullanılır, tekrar girmeye gerek yok."""
import getpass, json
from pathlib import Path

uygulama = Path(__file__).resolve().parent.parent
veri = uygulama / "veri"
veri.mkdir(exist_ok=True)
dosya = veri / "ayarlar.json"
eski = json.loads(dosya.read_text(encoding="utf-8")) if dosya.exists() else {}
sm = uygulama.parent.parent / "Sipariş Merkezi" / "Uygulama" / "veri" / "ayarlar.json"
sm_var = sm.exists() and json.loads(sm.read_text(encoding="utf-8")).get("IKAS_CLIENT_ID")


def sor(anahtar, soru, gizli=False):
    mevcut = eski.get(anahtar, "")
    ipucu = " [kayitli, degistirmek icin yazin]" if mevcut else ""
    return (getpass.getpass if gizli else input)(f"{soru}{ipucu}: ").strip() or mevcut


print("== Kar-Zarar ayarlari ==")
print("Bilgiler sadece bu bilgisayarda, veri\\ayarlar.json dosyasinda saklanir.\n")
ayar = dict(eski)
if sm_var:
    print("ikas bilgileri Siparis Merkezi'nden alinacak.\n")
else:
    ayar["IKAS_STORE"] = sor("IKAS_STORE", "ikas magaza adresi (ornek: yummylightstore2.myikas.com)")
    ayar["IKAS_CLIENT_ID"] = sor("IKAS_CLIENT_ID", "ikas Client ID")
    ayar["IKAS_CLIENT_SECRET"] = sor("IKAS_CLIENT_SECRET", "ikas Client Secret (yazarken gorunmez)", gizli=True)
ayar["META_TOKEN"] = sor("META_TOKEN", "Meta erisim anahtari (yazarken gorunmez, bos birakabilirsiniz)", gizli=True)
dosya.write_text(json.dumps(ayar, ensure_ascii=False, indent=2), encoding="utf-8")
print("\nKaydedildi.")
