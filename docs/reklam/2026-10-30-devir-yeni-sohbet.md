# Reklam Merkezi: Yeni Sohbete Devir

> Bu dosya yeni Reklam sohbetinin ilk okuyacağı dosyadır. Önce bu dosyayı, sonra `CLAUDE.md` ve `docs/reklam/yapilacaklar.md` dosyalarını oku.

## 0. Teknik bilgiler (yeni sohbet için)

**Meta**
- Hesap: `1420404848780789`
- Kampanya: "9 Ekim 2026 CBO" `120256411824600309`, günlük 4.200 TL.

| Set | ID |
|---|---|
| Yıldız | `120256413166180309` |
| Anime | `120256411824620309` |
| Baba | `120256476659450309` |
| Spotify (kapalı) | `120256413855550309` |
| Araç (kapalı) | `120256413901370309` |

| Yeni Yıldız reklamı | ID |
|---|---|
| 17_YH | `120256638291120309` |
| 19_YH | `120256638291130309` |
| 20_YH | `120256638291140309` |
| 21_YH | `120256638291150309` |
| 22_YH | `120256638291160309` |

- **Bütçe alanları kuruş cinsinden:** 420000 = 4.200 TL.
- **Değişiklik akışı:** Meta MCP'de bütçe ve minimum harcama değişiklikleri taslak olarak kaydedilir. `ads_activate_entity` ile yayınlanır, sonra canlı değer okunup kontrol edilir.
- **Meta bağlantısı:** Oturumu zaman zaman kapanıyor. Kapanınca claude.ai'de Ayarlar > Bağlayıcılar'dan tekrar giriş yapılıyor.

**Veri kaynakları**
- **ikas API:** Ortam değişkenleri `IKAS_CLIENT_ID`, `IKAS_CLIENT_SECRET`, `IKAS_STORE`. Sipariş çekme betiği: `/mnt/project-files/kar-zarar/masaustu/program/ikas_cek.py` (`python3 ikas_cek.py 2026-10 cikti.json`).
- **GA4:** Mülk `395087872`, servis hesabı anahtarı `GA4_SA_B64` (base64 JSON). Gereken kütüphane: `pip install google-analytics-data`.
- **Meta UTM'leri:** GA4'te `sessionManualAdContent` alanında reklam seti adı görünüyor.
- **0 TL siparişler:** Ödeme türü OTHER olan 0 TL siparişler, elle girilen WhatsApp siparişleri.
- **TikTok pixel:** `CPCTFCJC77U1S6M0B9AG`. TikTok reklam hesabını göremiyoruz, Fatih CSV gönderecek.

**Çalışma şekli**
- Raporlar MD olarak yazılır, `python3 tools/md2pdf.py <md> docs/reklam/pdf/<ad>.pdf` ile PDF'e çevrilir ve `/mnt/project-files/reklam/` klasörüne kopyalanır.
- Masaüstü klasörü: `C:\Users\fatih\Desktop\ClaudetoDestkop\Reklam Merkezi\`
- Git dalı: `claude/project-thread-a611m1`. Commit mesajı `[reklam]` ile başlar.
- Fatih Türkçe yazıyor, kısa ve net cevap istiyor. Her sabah kısa durum mesajı, her Cuma haftalık rapor sözü verildi.
- **En önemli kural:** Fatih açıkça "şunu kapat / bütçeyi şu yap" demeden hesapta hiçbir değişiklik yapılmaz. "Yapalım" demesi onay sayılmaz (21 Ekim olayı).

---


## 1. Kampanyanın şu anki hali

- **Bütçe:** Günlük 4.200 TL. 25 Ekim'de 3.500 TL'den çıkarıldı.
- **Hedef:** Kısa vadede ROAS 2. Sevgililer Günü 2027'ye kadar kârlı büyüme.

| Set | Durum | Günlük minimum harcama |
|---|---|---|
| Yıldız Haritası | Açık | 750 TL |
| Anime (Yapay Zeka) | Açık | 700 TL (25 Ekim'de kondu) |
| Baba | Açık | 300 TL |
| Spotify | Kapalı (25 Ekim) | – |
| Araç | Kapalı (25 Ekim) | – |

**Yıldız setindeki reklamlar:** 11_YH, 9_YH, 17_YH ve 25 Ekim'de eklenen dört reklam:

| Meta adı | Video |
|---|---|
| 19_YH | 19D_alinti (11_YH'nin alıntı hook'u) |
| 20_YH | YH_soru_v1 ("Tanıştığınız gece gökyüzü nasıldı?") |
| 21_YH | YH_kayip_v1 |
| 22_YH | 19B_unutmadi |

1_Yz 21 Ekim'den beri kapalı.

---

## 2. Sonuçlar

| Dönem | Harcama | Satış | Ciro | ROAS |
|---|---|---|---|---|
| 9-13 Ekim | 13.914 TL | 18 | 15.372 TL | 1,10 |
| 14-20 Ekim | 26.036 TL | 51 | 38.991 TL | 1,50 |
| 21-25 Ekim | 16.446 TL | 40 | 36.041 TL | 2,19 |
| **9-25 Ekim toplam** | **56.396 TL** | **109** | **90.404 TL** | **1,60** |

**26-28 Ekim** (ikas + GA4, harcama tahmini):
- 27 sipariş, 17.870 TL. Tahmini ROAS ~1,4.
- 27 Ekim iyi geçti (~2,6), 28 Ekim zayıftı (~0,6).
- Satışı Baba seti getirdi: 5 satış.
- Yıldız seti yeni reklamlardan sonra düştü: 1 satış.
- 10 WhatsApp siparişi ikas'a 0 TL girildi.

**Reklam puanları (23 Ekim):**
- Genel puan 54/100.
- Kazanan 11_YH: 48 satış, ROAS 1,82.
- En kârlı reklamlar 6_Araba (2,20) ve 5_Araba (2,26). Araç seti 25 Ekim'de kapatıldı.

---

## 3. Alınan kararlar

| Tarih | Karar | Kim |
|---|---|---|
| 10 Ekim | Bütçe 5.000'den 2.500 TL'ye indi, 5 zayıf reklam kapandı | Onaylı |
| 13 Ekim | Bütçe 3.500 TL'ye çıktı, Spotify minimumu kaldırıldı | Onaylı |
| 14 Ekim | Baba seti açıldı (300 TL min), 9 yeni reklam eklendi, 8 zayıf reklam kapandı | Fatih kurdu |
| 17 Ekim | Ana ürün yıldız haritası. 11_YH formatı klonlanacak. | Fatih |
| 21 Ekim | 1_Yz durduruldu. **Kural: Fatih açıkça söylemeden hesapta değişiklik yok.** | Fatih |
| 25 Ekim | Spotify ve Araç setleri kapandı. Anime'ye 700 TL minimum kondu. Bütçe 4.200 TL'ye çıktı. | Fatih onayladı, Claude uyguladı |
| 25 Ekim | Yıldız setine 5 yeni reklam eklendi (11_YH kopyalanıp sadece video değişti) | Fatih |
| 26 Ekim | TikTok testi planlandı | Fatih açacak |

---

## 4. Hazırlanan raporlar (docs/reklam/)

- `raporlar/2026-10-21-kreatif-reklam-ortak-puanlama.md`: Kreatif ve reklam ortak puanlaması. Excel tablosu da var.
- `raporlar/2026-10-23-genel-analiz-ve-puan.md`: Genel analiz, puan 54/100.
- `raporlar/2026-10-25-kampanya-karnesi.md`: 9-25 Ekim karnesi. Ne yaptık, ne yapmadık, nerede geç kaldık.
- `2026-10-26-tiktok-reklam-plani.md`: TikTok planı.
  - Günlük 1.200 TL, 7 gün.
  - Videolar 11_YH, 17_YH, 19_YH, 20_YH ve 21_YH.
  - UTM: `utm_source=tiktok`.
- `2026-10-14-dm-test-plani.md`: WhatsApp/DM test kampanyası planı.
- `raporlar/2026-10-29-hizli-rapor.md`: 26-28 Ekim hızlı rapor.

Hepsinin PDF'i `docs/reklam/pdf/` klasöründe.

---

## 5. Açık işler

**Senden (Fatih):**
1. WhatsApp siparişlerini ikas'a gerçek tutarıyla gir. Şu an 0 TL gidiyor.
2. Meta ödeme kartını kontrol et. 25 Ekim'de hesap "ödeme bekleniyor" durumuna düştü.
3. Yeni Yıldız reklamlarını incele. 500 TL'den fazla harcayıp satış getirmeyen reklam kapatılsın mı?
4. DM kampanyası: kurulumu sen mi yapacaksın, ben mi? WhatsApp mı Instagram mı?
5. TikTok: 3 gün sonra CSV dışa aktarımını buraya gönder.

**Benden (Claude):**
1. Cuma bütçe kuralı: 7 günlük ROAS 1,8 ve üstündeyse 5.000 TL öneririm, 1,2'nin altındaysa 2.500 TL. Bu hafta tahmini ROAS 1,4, bütçe 4.200 TL'de kalır.
2. Her Cuma haftalık rapor. Her sabah kısa durum mesajı.

**Kreatif Merkezi:**
- 18_YH koordinat düzeltmesi
- 3_Yz_v2
- 6_Araba_v2
- 19C_iki_kisi (bir sonraki parti)

---

## 6. Kurallar (hatırlatma)

- Bütçe, açma ve kapama için Fatih'in açık talimatı gerekir. Sadece "yapalım" demek yetmez.
- Yeni kreatifler haftada bir, tek seferde eklenir. "- Kopya" kampanya açılmaz.
- Metinlerde sitede olmayan indirim yazılmaz. Teklif: **Ücretsiz kargo · Kapıda ödeme · Peşin fiyatına 3 taksit**.
- "Ghibli" ve "elle çizim" kullanılmaz.
- Reklam adı standardı: `ÜRÜN_AÇI_vN`.
