# Tüm Zamanlar Detaylı Analiz — 2026-10-01

Hesap: Fatih Narmanlı · `act_1420404848780789` · Dönem: **Eylül 2023 – 1 Ekim 2026 (hesabın tüm geçmişi)** · Kaynak: Meta Ads (salt okuma)

## 0. Önce bir veri uyarısı ⚠️

**Mart 2024'te hatalı bir satın alma değeri kaydı var.** "Yeni Satışlar Reklamı - Kopya - Kopya" (kampanya: CBO - 165) reklamına yaklaşık **26,4 milyon TL** sahte satış değeri yazılmış (258 satış için normalde ~100 bin TL olmalıydı). Bu yüzden Meta'nın gösterdiği bazı ROAS'lar uçuk görünüyor (18-24 erkek ROAS 37, Instagram feed ROAS 31 vb.). Bu raporda bu değer **çıkarılarak** hesaplandı. Muhtemelen pixel'e o dönem fiyat yerine yanlış bir sayı (ör. sipariş no / kuruş) gönderilmiş.

## 1. Genel tablo

| | Değer |
|---|---|
| Toplam harcama | **~4,66 milyon TL** |
| Toplam satış (pixel) | **18.687** |
| Satış değeri (düzeltilmiş) | ~11,5 milyon TL |
| Ortalama ROAS (düzeltilmiş) | **~2,47** |
| Ortalama satış başı maliyet | ~249 TL |

## 2. Zaman içindeki değişim — en önemli bulgu 🔴

| Dönem | Satış başı maliyet | ROAS | Ort. sepet |
|---|---|---|---|
| Eyl 2023 – Şub 2024 | 95 – 153 TL | **2,65 – 3,80** | 350 – 410 TL |
| Mar 2024 – Ara 2024 | 217 – 354 TL | 1,27 – 2,44 | 400 – 556 TL |
| 2025 (genel) | 168 – 462 TL | 1,75 – 3,85 | 617 – 849 TL |
| Oca – Şub 2026 | 268 – 398 TL | **2,87 – 3,62** | 970 – 1.140 TL |
| **Mar – Haz 2026** | 494 – 833 TL | 1,02 – 1,80 | 800 – 940 TL |
| **Tem – Eyl 2026** | **1.170 – 1.245 TL** | **0,55 – 0,85** | 680 – 1.000 TL |

**Yorum:**
- **Mart 2026'dan beri ciddi bir kırılma var.** ROAS 3,6'dan (Şubat) 0,55'e (Eylül) düşmüş. Satış başı maliyet ~4,5 kat artmış. Bu sadece enflasyonla açıklanamaz (sepet ortalaması aynı dönemde artmamış).
- Olası sebepler (kontrol edilecek):
  1. **Ölçüm kopması** — pixel başka işletmede (Yummy Light), 27.09.2026'da yeni bir Shopify kataloğu oluşturulmuş → site/altyapı değişikliği olduysa pixel/CAPI satışları eksik sayıyor olabilir.
  2. **Bütçenin DM kampanyalarına kayması** — DM'den gelen satışlar pixel'e düşmüyor.
  3. **Kreatif yorgunluğu** — aynı "Anılarınızı Sanata Dönüştürün" Ghibli metni Nisan 2025'ten beri dönüyor.
- **Mevsimsellik net:** Her yıl **Aralık ve Şubat (Sevgililer Günü)** en iyi aylar (ROAS 3,6 – 3,85). Haziran (Babalar Günü) ikinci dönem. Mart ve Temmuz–Ağustos her yıl zayıf.
- Maliyetler fiyatlardan hızlı artmış: CPM 2023'te ~14 TL → 2026'da ~50-56 TL (~3,7×); sepet ortalaması ~350 → ~950 TL (~2,7×).

## 3. Yaş

| Yaş | Harcama | Payı | Satış | Satış başı | ROAS (düz.) |
|---|---|---|---|---|---|
| 18-24 | 1,36 M TL | %29 | 6.697 | **202 TL** | ~2,67 |
| **25-34** | **2,25 M TL** | **%48** | **8.955** | 252 TL | ~2,61 |
| 35-44 | 0,74 M TL | %16 | 2.150 | 343 TL | 1,95 |
| 45-54 | 0,24 M TL | %5 | 682 | 349 TL | 1,90 |
| 55-64 | 46 bin TL | %1 | 127 | 360 TL | 1,72 |
| 65+ | 28 bin TL | %0,6 | 76 | 369 TL | 1,59 |

- **18-34 yaş = harcamanın %77'si, satışların %84'ü.** Doğru yere harcanmış.
- **35+ yaşta satış başı maliyet ~%40-80 daha pahalı.** 35+ yaştakiler daha çok tıklıyor (CTR %1,5 – 2,8) ama daha az satın alıyor → "tıklayıp bakan ama almayan" kitle.

## 4. Cinsiyet

| Cinsiyet | Harcama | Payı | Satış | Satış başı | ROAS (düz.) | Tık → satış |
|---|---|---|---|---|---|---|
| Erkek | 2,71 M TL | %58 | 11.312 | **239 TL** | ~2,56 | %3,6 |
| Kadın | 1,90 M TL | %41 | 7.162 | 265 TL | ~2,35 | %3,2 |

- **Erkekler biraz daha verimli** (hediye alan taraf). Kadınlar reklama daha çok tıklıyor (CTR kadın %1,2 – 2,8 / erkek %0,7 – 1,9) ama tıklayan kadınların daha azı satın alıyor.
- **En verimli segment: 18-24 kadın** (195 TL) ve **18-24 erkek** (208 TL). **25-34 erkek** en büyük hacim (5.750 satış, 232 TL).
- **En verimsiz: 55+ kadın** (569 – 628 TL, ROAS ~1).

## 5. Lokasyon (Türkiye illeri)

> Meta il kırılımında satış verisi vermiyor; sadece harcama, tık ve tık maliyeti var.

- Harcamanın **%99,8'i Türkiye**; yurtdışı ~11 bin TL (İngiltere, ABD, Kanada) — muhtemelen geniş hedeflemeden sızıntı.
- **İstanbul %37,7**, Ankara %10,3, Antalya %5,4, Bursa %4,9 → ilk 4 il = harcamanın %58'i.
- **En pahalı tık:** Kocaeli (10,0 TL), Muğla (9,7), Kırklareli (9,6), Tekirdağ (9,4), Antalya (9,1), İstanbul (9,05).
- **En ucuz tık:** Erzurum (7,0), Sivas (7,1), Diyarbakır (7,2), Kayseri (7,2), Kütahya, Isparta (7,3).
- Fark sınırlı (~%30). İl hariç tutmak önerilmez; Meta zaten dağıtıyor. Kapıda ödeme olan dönemlerde Anadolu performansı daha iyiydi (bkz. madde 6).

## 6. Reklam metni (açıklama) temaları — en çok harcayan 80 reklam (~3,09 M TL)

| Tema | Reklam | Harcama | Satış | Satış başı | ROAS | Tık→satış |
|---|---|---|---|---|---|---|
| **A) Sevgili + "Fotoğrafını yükle, çizime dönüştür" + Kapıda ödeme + %20-40 indirim** | 18 | 627 bin | **5.098** | **123 TL** 🏆 | **3,40** | **%4,4** |
| C) Yıldız haritası | 15 | 351 bin | 1.468 | 239 TL | 2,55 | %4,0 |
| H) Katalog (dinamik ürün) | 4 | 98 bin | 457 | 215 TL | 2,32 | %3,0 |
| B) Araba / araç lambası | 6 | 98 bin | 426 | 230 TL | 2,19 | %3,0 |
| G) Çocuk odası | 2 | 27 bin | 104 | 259 TL | 2,53 | %3,7 |
| F) Fotoğraf/anı genel, Spotify, line art | 10 | 198 bin | 744 | 266 TL | 2,23 | %3,5 |
| E) Babalar Günü (Ghibli) | 6 | 193 bin | 615 | 314 TL | 2,27 | %2,1 |
| D) Ghibli / yapay zeka (genel) | 19 | **1,50 M** | 4.666 | 321 TL | 2,43 | %3,5 |

**Kazanan metnin anatomisi (A):**
> ❤️🌠 Sevgililerinize kendi fotoğraflarınızla özel bir aşk hikayesi yaşatın!
> ❤️🌠 Fotoğrafını yükle ve çizime dönüştür
> Sadece USB ile tak çalıştır ve tüm oda aydınlansın.
> Kapıda Ödeme Fırsatı 📦🚚 — Hemen %40 indirimle sipariş verin ✨💑
> **Başlık:** "Kapıda Ödeme Fırsatı 📦🚚"

Neden çalışıyor: (1) kısa, (2) **kime** (sevgili) net, (3) **nasıl** (fotoğraf yükle → çizim) net, (4) pratik fayda (USB tak-çalıştır), (5) **risk azaltıcı: kapıda ödeme**, (6) güçlü indirim.

**Not:** A teması 2023-2024'te, CPM'in ucuz olduğu dönemde koştu; bir kısmı dönem avantajı. Ama ROAS (enflasyondan daha az etkilenir) de en yüksek: 3,40 vs Ghibli 2,43.

**En çok para harcanan metin** ("📌 Anılarınızı Sanata Dönüştürün… Ghibli Esintili Çizim Detayı…", başlık "%20 İndirim ve Ücretsiz Kargo 🚚") — tek reklamda 383 bin TL, 1.277 satış, ROAS 2,33. İyi ama: **uzun, maddeli, "kime" belirsiz, kapıda ödeme yok.**

**Başlık gözlemleri:**
- "Kapıda Ödeme Fırsatı 📦🚚" → en iyi performanslı başlık.
- "🌟🌟🌟🌟🌟 (+65 Müşteri Yorumu)" (sosyal kanıt) → yıldız haritası reklamlarında 136 – 175 TL ile çok iyi ("karışık cost cap" kampanyası ROAS 3,6 – 4,1).
- "Ücretsiz kargo / %20 indirim" → orta.
- DM başlıkları ("Chat with us", "Fotoğrafını Işığa Dönüştür") → pixel'de neredeyse sıfır satış.

## 7. CTA (buton)

| CTA | Reklam | Harcama | Satış | Satış başı | ROAS |
|---|---|---|---|---|---|
| **SHOP_NOW (Alışverişe başla)** | 30 | 956 bin | 6.153 | **155 TL** 🏆 | **3,03** |
| ORDER_NOW (Hemen sipariş ver) | 35 | 1,84 M | 6.607 | 279 TL | 2,55 |
| LEARN_MORE (Daha fazla bilgi) | 3 | 44 bin | 191 | 231 TL | 2,39 |
| Katalog / dinamik | 4 | 98 bin | 457 | 215 TL | 2,32 |
| WHATSAPP_MESSAGE | 6 | 120 bin | 161* | 746 TL* | 0,77* |
| MESSAGE_PAGE (Mesaj gönder) | 2 | 27 bin | 9* | 3.002 TL* | 0,28* |

\* Mesaj CTA'larında satışlar DM'de kapanıyor, pixel göremiyor → gerçek değer bilinmiyor.

- SHOP_NOW'ın üstünlüğünün bir kısmı yine A temasıyla aynı döneme denk gelmesinden. Yine de **2025-26'da neredeyse sadece ORDER_NOW kullanılmış — SHOP_NOW tekrar test edilmeli.**

## 8. Platform & yerleşim

| Yerleşim | Harcama | Payı | Satış başı | ROAS |
|---|---|---|---|---|
| **Instagram Reels** | 2,78 M TL | **%60** | 270 TL | 2,28 |
| Instagram Feed | 925 bin | %20 | 227 TL | ~2,75 (düz.) |
| Instagram Stories | 770 bin | %17 | 222 TL | 2,79 |
| Facebook Feed | 60 bin | %1,3 | **196 TL** | **3,23** |
| Facebook Reels | 52 bin | %1,1 | 396 TL | 1,62 |
| Instagram Keşfet | 40 bin | %0,9 | **152 TL** | **3,05** |
| Facebook Stories | 6 bin | | 620 TL | 0,94 ❌ |
| WhatsApp Durum | 4,7 bin | | 0 satış ❌ | — |
| Audience Network | 5,5 bin | | 197 – 254 TL | 3,2 – 3,6 (CTR %15-18 → kazara tık şüphesi) |

- Reels hacim motoru ama en pahalılardan. **Feed, Stories ve Keşfet daha ucuza satıyor.**
- Facebook Stories ve WhatsApp Durum'da para boşa gitmiş.

## 9. Nerede doğru yapılmış ✅

1. **Hedef kitle yaşı doğru** — bütçenin %77'si 18-34'e gitmiş, en verimli yaşlar.
2. **Sezonsal kampanyalar** (Sevgililer Günü, Babalar Günü, yılbaşı) güçlü çalışmış.
3. **Sosyal kanıt başlığı** ("+65 Müşteri Yorumu") ve **kapıda ödeme** vurgusu belirgin fark yaratmış.
4. **Yeni ürün temaları** (yıldız haritası, araba, çocuk) test edilmiş ve 215 – 260 TL ile kârlı bulunmuş.
5. 2023-24'teki **benzer hedef kitle (lookalike) + satış kampanyaları** en düşük maliyetli dönem (100 – 125 TL).

## 10. Nerede yanlış yapılmış ❌

1. **Mart 2026'dan beri performans çöküşü fark edilmeden harcama devam etmiş** (Mar–Eyl 2026: ~647 bin TL, ROAS ~1,3 → son 3 ay <1).
2. **Kazanan formül terk edilmiş:** "Kapıda ödeme" vurgusu ve SHOP_NOW 2025'ten sonra neredeyse kaybolmuş; metinler uzamış ve genelleşmiş.
3. **Aynı Ghibli metni 1,5 yıldır** onlarca kampanyada kopyalanarak kullanılmış (kreatif yorgunluğu).
4. **Kampanya kopyalama kültürü:** 50+ kampanya, çoğu "Kopya" → öğrenme sürekli sıfırlanmış, bütçe bölünmüş.
5. **Özel kitleler/benzer kitleler silinmiş** → bunlara bağlı reklam setleri ölmüş; en ucuz satış dönemi bu kitlelerle yapılmıştı.
6. **DM kampanyalarına ölçümsüz bütçe:** ~150 bin TL+ mesaj kampanyalarına gitmiş, dönüşüm takibi yok.
7. **Mart 2024 satış değeri hatası** düzeltilmemiş → Meta'nın değer optimizasyonu ve raporlar o dönemden beri bozuk veriyle çalışıyor olabilir.
8. **Pixel başka işletmede** → veri sahipliği ve CAPI kurulumu karışık.

## 11. Öneriler (öncelik sırasıyla)

1. **Ölçümü doğrula** (pixel + CAPI, Shopify/IYZADS hangisi aktif, satın alma değeri doğru mu). Çöküşün ne kadarı gerçek, ne kadarı ölçüm hatası — önce bunu bilmeliyiz.
2. **"A formülü"nü güncel ürünle yeniden yaz:** kısa metin + net "kime" + "fotoğrafını gönder → Ghibli/çizim" + **kapıda ödeme** + indirim; başlık "Kapıda Ödeme Fırsatı 📦🚚"; CTA **SHOP_NOW** vs ORDER_NOW A/B testi.
3. **Sosyal kanıt başlığını** (müşteri yorumu sayısı, güncel) Ghibli reklamlarına da taşı.
4. **Yerleşim:** Facebook Stories ve WhatsApp Durum'u kapat; Advantage+ yerleşimlerde kalınacaksa izlemeye al.
5. **Yaş:** 18-44'e odaklan; 55+ kadın segmentini hariç tutmayı test et (veya Advantage+ kitlesinde öneri olarak bırak).
6. **Satın alanlardan yeni benzer kitle** (son 180 gün) oluştur ve test et.
7. **Takvim:** Kasım sonundan itibaren yılbaşı, Ocak sonundan itibaren Sevgililer Günü için bütçe ve kreatif hazırlığı — her yıl en iyi dönemler.
