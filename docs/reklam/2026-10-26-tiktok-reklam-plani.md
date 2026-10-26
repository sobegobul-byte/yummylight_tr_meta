# TikTok Reklam Planı: Yıldız Haritası Lambası

**Tarih:** 26 Ekim 2026 · **Ürün:** Yuvarlak yıldız haritası lambası · **Hedef:** Siteden satış

---

## 1. Kısa özet

- **Yapı:** 1 kampanya, 1 reklam grubu, 5 video.
- **Bütçe:** Günlük **1.200 TL**, 7 günlük test. Toplam yaklaşık **8.400 TL**.
- **Hedef:** Siteden satın alma, yani "Ödemeyi tamamla" olayı.
- **Kreatifler:** Elimizdeki en güçlü 5 video: 11_YH, 17_YH, 19_YH, 20_YH, 21_YH. TikTok'ta organik olarak öne çıkan video olmadığı için Spark Ads kullanılmıyor.
- **Ön koşul hazır:** Sitede TikTok pixel zaten kurulu (`CPCTFCJC77U1S6M0B9AG`). Yarın açmadan önce satış olaylarının pixele gelip gelmediğini kontrol etmen yeterli.

---

## 2. Açmadan önce (10 dakika)

1. **Pixel kontrolü:** TikTok Reklam Yöneticisi → Araçlar → **Olaylar** bölümüne gir. `CPCTFCJC77U1S6M0B9AG` pikselinde son 7 günde **"Ödemeyi tamamla" (CompletePayment)** ve **"Sepete ekle"** olayları görünüyor mu, bak.
   - Görünüyorsa satın alma hedefiyle aç.
   - Görünmüyorsa ilk 3 gün "Ödemeyi başlat" hedefiyle aç. O sırada ikas tarafını düzeltiriz.
2. **Ödeme yöntemi:** Kart ekli mi, limit yeterli mi? Bütçe 8.400 TL.
3. **TikTok hesabını bağla:** Reklamlar @yummylightstore adıyla görünsün diye hesabını reklam hesabına bağla.
4. **UTM:** Reklam linkinin sonuna şunu ekle: `?utm_source=tiktok&utm_medium=paid&utm_campaign=yh_test_ekim`. Böylece ikas ve GA4'te TikTok satışlarını ayrı görürüz.

---

## 3. Kampanya kurulumu

| Ayar | Değer | Neden |
|---|---|---|
| Kampanya amacı | **Satışlar** (web sitesi dönüşümü) | Satın alana göstersin |
| Kampanya bütçesi | **Sınırsız** (bütçe reklam grubunda) | Kampanya bütçesi açılırsa en az 50$ isteniyor |
| Reklam grubu bütçesi | **Günlük 1.200 TL** | Asgari 20$ civarı. 1.200 TL güvenli tarafta (kuru o gün kontrol et). |
| Optimizasyon | **Ödemeyi tamamla** (pixel) | Bkz. 2. bölüm 1. madde |
| Teklif | **En yüksek teslimat** (maliyet sınırı yok) | Test aşamasında sınır koymayalım |
| Yerleşim | **Sadece TikTok** (Pangle kapalı) | Pangle uygulama içi reklam, satış getirmiyor |
| Kitle | Türkiye, **18-44**, cinsiyet hepsi, ilgi alanı **yok** (otomatik hedefleme) | TikTok geniş kitlede daha iyi öğreniyor. Siparişlerin ~%70'i sevgiliye gidiyor ve bu yaş aralığı o kitle. |
| Kampanya adı | `YH · Satış · TikTok Test · Ekim 2026` | |
| Smart+ / otomatik kreatif | Kapalı | Videolar ve metin değişmesin, hangisinin sattığını görelim |

---

## 4. Kreatifler (5 video)

| # | Video | Neden |
|---|---|---|
| 1 | **11_YH** | Meta'da 48 satış getiren kazanan. Yazı formatı zaten TikTok'un kendi yazı stilinde. |
| 2 | **19_YH (alıntı)** | 11_YH'nin hook'u, yeni ve temiz çekim. |
| 3 | **20_YH (soru)** | "Tanıştığınız gece gökyüzü nasıldı?" TikTok'ta soru hook'ları yorum alıyor. |
| 4 | **21_YH (kayıp)** | Karanlık oda, "tık" sesiyle lamba yanıyor. TikTok'ta kaydırmayı durduran bu tür ani değişimler iyi çalışıyor. |
| 5 | **17_YH** | 11_YH'nin en iyi klonu, yakın planla açılıyor. |

**Dosyalar:**
- 11_YH: `ClaudetoDestkop\Reklam Merkezi\Reklam - 11_YH İnceleme - Rapor + Video\11_YH_Hazir.mov`
- 19_YH: `Kreatif Merkezi\19_YH_Hazır\19D_alinti_YH_Hazir.mp4`
- 20_YH ve 21_YH: `Reklam Merkezi\Desktop to Claude\YH_soru_v1.mp4` ve `YH_kayip_v1.mp4`
- 17_YH: senin klasöründe (Meta'ya yüklediğin dosya)

Meta'daki 22_YH (unutmadı) TikTok'a girmiyor. 5 video yeterli, fazlası 1.200 TL'lik bütçeyi böler.

**Reklam metni (kısa, TikTok tarzı):**
> Tanıştığınız gecenin gökyüzü ✨ Tarihini yaz, o geceyi lambaya dönüştürelim.
> 🚚 Ücretsiz kargo · Kapıda ödeme · Peşin fiyatına 3 taksit

- **Buton:** "Şimdi alışveriş yap"
- **Yasak olanlar:** sitede olmayan indirim, "Ghibli", "elle çizim".

**Ses:** Videolardaki lofi müzik kalabilir. Telifli şarkı kullanma, reklam reddedilir. TikTok'un ticari ses kütüphanesinden seçilebilir.

---

## 5. Karar kuralları

**İlk 3 gün:** Hiçbir şeye dokunma. TikTok da öğrenme döneminde.

**7. gün** (ROAS = ikas'taki TikTok UTM'li ciro ÷ harcama):

| Sonuç | Karar |
|---|---|
| ROAS ≥ 1,5 | Devam. Bütçeyi her 3 günde %20 artır. |
| 0,8 – 1,5 | 1 hafta daha. En zayıf 2 videoyu kapat, yeni 2 video ekle. |
| < 0,8 | Durdur. Bütçe Meta'ya döner. Organik içerik devam eder. |

**Video bazında:** 2.000 TL harcayıp hiç satış getirmeyen video kapatılır.

**Not:** TikTok'ta reklamı izleyen kişi çoğu zaman sonradan siteye gelip Meta reklamından ya da doğrudan alıyor. Bu yüzden TikTok'un kendi raporu satışları eksik gösterebilir. 7. gün kararında **toplam site cirosundaki artışa** da bakacağız.

---

## 6. Meta ile birlikte toplam bütçe

| Kanal | Günlük |
|---|---|
| Meta (9 Ekim CBO) | 4.200 TL |
| TikTok (test) | 1.200 TL |
| **Toplam** | **5.400 TL** |

Meta'daki 5 yeni video da 25 Ekim gecesi yayına girdi. İki kanalı aynı haftada kıyaslayabileceğiz.

---

**Kaynaklar:**
- [TikTok · Bütçe kuralları (kampanya en az 50$, reklam grubu en az 20$ günlük)](https://ads.tiktok.com/resources/help/article/budget)
- [TikTok · Pixel hakkında](https://ads.tiktok.com/help/article/tiktok-pixel?lang=tr)
