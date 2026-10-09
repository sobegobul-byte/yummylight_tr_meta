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

### 04.10.2026: Temiz başlangıç
- Eski taslaklar (MSG 01.10 + WEB 02.10) API ile silinemedi ("yeni kampanyalar aktif ya da duraklatılmış olmalı" hatası). **Kullanıcı Reklam Yöneticisi'nden "taslağı at" ile silecek.**
- Yeni **WEB | Satış | CBO | Ürün Bazlı | 04.10.2026** (`120256339583750309`) · 5.000 TL/gün · en yüksek hacim · TASLAK
  - Set 1: **Spotify Fotoğraflı Gece Lambası** (`120256339585830309`) · link: /spotify-kodlu-fotografli-gece-lambasi-sevgiliye-ese · 5 reklam (1-5_FS_Hazır)
    - 1: "Kodu okuttu… sonra bu oldu" · başlık "Şarkınızı Lambaya Dönüştürün 🎵" (sevgili sürprizi)
    - 2: "Düğünümüzde ilk dansımızı…" · "Yıl Dönümünüz İçin Şarkınız Işıkta 💍" (eş / yıl dönümü)
    - 3: "O gece köprüde bu şarkıyı…" · "Şarkın + Fotoğrafın Işığa Dönüşsün ✨" (anı)
    - 4: "Mumlar üflendi… hediyesini açınca yüzü" · "Doğum Günü Hediyesi: Şarkınız Işıkta 🎂"
    - 5: "Kankamın doğum günü… Tepkisine bakın!" · "Arkadaşına En Anlamlı Hediye 🎵" (arkadaş)
  - Set 2: **Araç Fotoğraflı Gece Lambası** (`120256339673870309`) · link: /arac-fotografli-gece-lambasi-otomobil · hedef 6 reklam (3 eski kazanan + 3 yeni)
    - Eski kazananlar **mevcut gönderi ID'siyle** eklendi (beğeni/yorum korunur, metin orijinal):
      - `120256339715200309` · 1-Araba-Video · 118 satış, CPA 147, ROAS 2,52 · post 262719013454987
      - `120256339715330309` · Araç tutkunlarına 3D · 54 satış, CPA 104, ROAS 3,87 · post 448631734863713
      - `120256339715600309` · Araba v1 · 42 satış, CPA 156, ROAS 4,04 · post 546882868371932
    - Yedek (eklenmedi): araba 22 (63 satış, CPA 203), Tır 1, Proshce 2 seslendirmeli; mtor2 (motor) motor ürününe ait
    - Yeni videolar (izlenip yazıldı, link /arac-fotografli-gece-lambasi-otomobil, CTA Alışverişe Başla):
      - `120256339694560309` · 1_Araba_Hazır · "Babamın 30 yıllık ilk arabası… sadece bu fotoğrafta kalmıştı" · başlık "Babanın İlk Arabası Işıkta Yaşasın 🚗" (baba / duygusal)
      - `120256339694600309` · 2_Araba_Hazır · "POV: Erkek arkadaşın arabasına senden çok aşık…" · "Sevgilinin Arabası Gece Lambası Oldu 🚗💡" (sevgili / mizah)
      - `120256339694660309` · 3_Araba_Hazır · "Yurtdışına taşındım… en çok onu özledim. Hayır, sevgilimi değil… ARABAMI!" · "Aracını Işığa Dönüştür ✨" (araba tutkunu / kendine)
    - Kontrol: eski gönderilerin linki güncel ürün sayfasına gidiyor mu, fiyat/indirim ifadesi güncel mi?
  - Sıradaki setler: Anime, Yıldız, Fotoğraflı, Çocuk (videolar gelince)

### 04.10.2026 akşam: Katalog sorunu ve yeniden kurulum
- Kampanyaya IYZADS kataloğu bağlı olduğu için Reklam Yöneticisi 8 reklamı (5 Spotify + 3 eski araç gönderisi) **katalog karuseline çevirdi**; videolar ve metinler gitti.
- Kullanıcı kampanyada kataloğu kapattı → bu da iki setin dönüşüm olayını sildi. Setlere pixel 205661538800855 + PURCHASE API ile geri bağlandı (VALIDATED).
- 8 bozuk reklam DELETED işaretlendi, aynı video/metin/gönderilerle yeniden kuruldu:
  - Spotify: `120256339714810309`, `120256339714850309`, `120256339715020309`, `120256339715070309`, `120256339715150309`
  - Araç eski kazananlar: `120256339715200309`, `120256339715330309`, `120256339715600309`
- Yeni araç videoları (`120256339694560309`, `120256339694600309`, `120256339694660309`) sağlam kaldı.
- **Ders:** web video satış kampanyalarında kampanya seviyesinde katalog KAPALI olmalı. Katalog yalnız ayrı retargeting kampanyasında.

### 05.10.2026: Sıfırdan temiz kurulum (kullanıcı tüm taslakları sildi)
- Kampanya **WEB | Satış | CBO | Ürün Bazlı | 05.10.2026** (`120256339788170309`) · Satış · CBO 5.000 TL/gün · en yüksek hacim · **katalog YOK** · TASLAK
- Setler (ikisi de pixel 205661538800855 + PURCHASE, web, TR 18-54 öneri, Advantage+ kitle/yerleşim):
  - `120256339789880309` · Spotify Fotoğraflı (5 reklam: `...791810309`, `...801990309`, `...802060309`, `...802100309`, `...802160309`)
  - `120256339789930309` · Araç Fotoğraflı (6 reklam: yeni 1-2-3 `...802200309`, `...802260309`, `...802340309`; eski kazananlar `...802390309`, `...802440309`, `...802480309`)
- Tüm reklamlar: video + ana metin + başlık + açıklama + **Alışverişe Başla** + ürün linki
- **Çoklu reklamveren reklamları KAPALI** (contextual_multi_ads OPT_OUT), **Advantage+ kreatif geliştirmeleri KAPALI** (standard_enhancements OPT_OUT)
- Eski kazananlar artık eski gönderi ID'siyle değil, **aynı videoyla yeni reklam** olarak kuruldu (gönderi kullanınca çoklu reklamveren kapatılamıyor). Sosyal kanıt sıfırdan başlar.
- Eski metinlerdeki "%40 indirim" doğrulanmadığı için çıkarıldı; yerine kapıda ödeme + ücretsiz kargo.

### 05.10.2026: Kreatifsiz reklam sorunu ve kalıcı çözüm
- **Sorun:** API'den satır içi (object_story_spec) yazılan video reklamları, Reklam Yöneticisi taslak ekranı açıkken ~1 dk içinde boş "bağlantı reklamı" şablonuna çevrildi (video/metin/link silindi, WhatsApp eki ve çoklu reklamveren yeniden açıldı).
- **Çözüm:** Önce **kalıcı kreatif** (ads_create_creative, creative_id) oluşturup reklamı ona bağlamak. Kapak görseli image_url değil **image_hash** ile verilmeli (ikisi birden "ObjectStorySpecRedundant" hatası verir).
- Tüm Advantage+ kreatif geliştirmeleri bu kreatiflerde varsayılan **KAPALI** (taslak çıktısında hepsi OPT_OUT görünüyor).
- Güncel reklamlar (hepsi hatasız):
  - Spotify set `120256339789880309`: `...862430309` (1), `...908040309` (2), `...908140309` (3), `...908200309` (4), `...908250309` (5)
  - Araç set `120256339789930309`: yeni `...908340309`, `...908400309`, `...908440309`; eski kazanan `...908480309`, `...908570309`, `...908620309`
- Önceki bozuk + geçici reklamlar DELETED işaretli; Reklam Yöneticisi'nde hâlâ görünürlerse elle silinecek.
- **Kural:** Bundan sonra her reklam creative_id yöntemiyle kurulacak.

## 9 Ekim 2026 — "9 Ekim 2026 CBO" YAYINDA (Reklam Yöneticisi'nden elle kuruldu)
- Kampanya `120256411824600309`: Satış, CBO 5.000 TL/gün, en yüksek hacim. Eski 05.10 API taslağı artık yok.
- Setler (hepsi Pixel 205661538800855 / Purchase, TR, 18+, Advantage+ kitle, 7g tık + 1g görüntüleme):
  - Yapay Zeka Anime `120256411824620309`: 7 reklam (1–7_Yz_Hazır), min harcama yok
  - Spotify Fotoğraflı `120256413855550309`: 5 reklam (1–5_FS_Hazır), min 750 TL/gün
  - Arabalı Gece Lambası `120256413901370309`: 3 reklam (1–3_Araba_Hazır), min 750 TL/gün
  - Yıldız Haritası `120256413166180309`: 7 reklam (1,2,3,4,8,9,11_YH_Hazır), min 750 TL/gün
- Açık konular:
  - 5_Yz_Hazır metni ve başlığı 1_Yz ile aynı yayına çıktı (nostalji metni girilmemiş).
  - Eski araç reklamı `120219821195440309` için yayınlanmamış bir taslak değişiklik (katalog karuseli + ürün göz atma) duruyor; atılmalı.
  - Set adı "Spotfy" yazım hatası.
  - Min harcama kuralı 4–5. günde gözden geçirilecek; yerleşim değer kuralları 5–7 gün sonra.
  - Yaratıcı ekleme: haftada bir toplu (her eklemede o setin öğrenmesi sıfırlanır).
