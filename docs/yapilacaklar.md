# Yapılacaklar

_Son güncelleme: 2026-10-01_

## Öncelik sırası

- [ ] **1. Ödeme sorununu çöz** (kullanıcı) — Ana hesap IN_GRACE_PERIOD. Faturalar ve Ödemeler'den bakiye ödenmeli / kart güncellenmeli.
- [x] **1b. Mart 2026 sonrası çöküşün sebebini bul** — Kullanıcı teyidi (01.10.2026): site/altyapı DEĞİŞMEDİ; reklamlar kötüleşti, sonra kapatıldı. → Çöküş büyük olasılıkla gerçek performans kaybı (kreatif yorgunluğu, formül değişimi, kitle kaybı), ölçüm hatası değil. Yine de pixel sağlık kontrolü yapılacak.
  - Eski not: — ROAS 3,6 (Şub) → 0,55 (Eyl). Site/altyapı değişti mi (Shopify kataloğu 27.09.2026'da oluşturulmuş)? Pixel/CAPI satışları eksik mi sayıyor? Bkz. `raporlar/2026-10-01-tum-zamanlar-detayli-analiz.md`
- [ ] **1c. Mart 2024 hatalı satış değeri** (~26,4 M TL sahte değer) — kaynağını anla, bir daha olmaması için pixel değer parametresini kontrol et.
- [ ] **2. DM satışlarını ölç** — 1.650 + 1.219 mesajdan kaçı satışa döndü? Mesaj kampanyalarının gerçek ROAS'ını hesapla.
- [ ] **3. Pixel & katalog sağlık kontrolü** — Hangi kampanya hangi pixel'i kullanıyor; "Yummy Light's pixel" kalite/etkinlik kontrolü; IYZADS kataloğu teşhis ve eşleşme oranı.
- [ ] **4. Kazanan kreatifleri yeniden test et** — "24.08 Yapay zeka3" (ROAS 1,83) ve diğer yapay zeka kreatifleri.
- [ ] **4b. "A formülü" testi** — kısa metin + "kime" net + fotoğrafını gönder → çizim + **kapıda ödeme** + indirim; başlık "Kapıda Ödeme Fırsatı 📦🚚"; CTA SHOP_NOW vs ORDER_NOW.
- [ ] **4c. Yerleşim** — Facebook Stories ve WhatsApp Durum kapatılmalı (satış yok/pahalı).
- [ ] **4d. Yeni benzer kitle** — son 180 gün satın alanlar.
- [ ] **5. Hesap temizliği** — Hatalı/eski/"Kopya" kampanyaları arşivle.

## Kapatılmış hesaplar (opsiyonel)

- [ ] "Reklam 1" ve 2. "Fatih Narmanlı" hesapları için Hesap Kalitesi'nden itiraz (gerekirse).

## Notlar

- Claude, para harcatan hiçbir işlemi (kampanya yayınlama/aktifleştirme, bütçe artırma) açık onay olmadan yapmaz. Yeni kampanyalar DURAKLATILMIŞ oluşturulur.

## Kurulum günlüğü

### 2026-10-01: Mesaj kampanyası (TASLAK, yayında değil)
- Kampanya `120256305081720309` · **MSG | WhatsApp Satış | CBO | Ürün Bazlı | 01.10.2026** · Satış amacı · CBO 1.500 TL/gün · en yüksek hacim
- Reklam setleri (hepsi WhatsApp, **mesajlaşma üzerinden satın alma** optimizasyonu, TR, 18-54 öneri, Advantage+ kitle ve yerleşim):
  - `120256305085090309` · Yıldız Haritası
  - `120256305092830309` · Yapay Zeka Anime
  - `120256305092920309` · Araba
- Meta doğrulaması: VALIDATED, hata yok → hesap satın alma optimizasyonuna uygun görünüyor (kesin onay yayınlamada)
- Bekleyen: kreatifler (kullanıcının yeni videoları + mevcut kütüphane), WhatsApp hazır ilk mesajları, yayın onayı
- Not: eski **CBO-DM-24.08** (1.000 TL/gün) hâlâ AKTİF. Yeni kampanya yayına girince duraklatılması önerilecek.
- 02.10 gece: Mesaj kampanyasına 14 reklam (Yıldız 6, Anime 5, Araba 3) + **WEB CBO** kampanyası (3 set, 11 reklam, 3.000 TL/gün) taslak olarak eklendi. Hepsi VALIDATED. Sabah listesi: `docs/sabah-kontrol-listesi-2026-10-02.md`
