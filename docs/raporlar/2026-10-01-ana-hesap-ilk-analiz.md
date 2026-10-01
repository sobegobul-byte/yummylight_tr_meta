# Ana Hesap İlk Analiz — 2026-10-01

Hesap: Fatih Narmanlı · `act_1420404848780789` · Dönem: son 90 gün · Kaynak: Meta Ads (salt okuma, hiçbir değişiklik yapılmadı)

## Özet

- Toplam harcama ≈ **111.000 TL**
- Pixel'e göre ağırlıklı ROAS ≈ **0,7** (DM satışları dahil değil — aşağıya bakın)
- Hesap durumu: **IN_GRACE_PERIOD** → ödeme sorunu, çözülmezse hesap kapanabilir

## Harcama yapan kampanyalar

| Kampanya | ID | Durum | Günlük bütçe | Harcama | Sonuç | Sonuç başı maliyet | Satın alma ROAS | CPM | CTR |
|---|---|---|---|---|---|---|---|---|---|
| CBO-DM-24.08 | 120255713576620309 | ✅ Aktif | 1.000 TL | 37.177 TL | 1.650 mesaj | 22,53 TL | 0,50 | 46,8 TL | %0,85 |
| CBO-0306 | 120252166825590309 | Duraklatıldı | 6.000 TL | 29.818 TL | 33 satış | 903,57 TL | 1,03 | 53,9 TL | %0,66 |
| CBO-DM-2205 | 120251172364960309 | Duraklatıldı | 2.000 TL | 29.071 TL | 1.219 mesaj | 23,85 TL | 0,48 | 28,5 TL | %0,75 |
| 24.08.2026 YapayZeka2 | 120255713527820309 | Duraklatıldı | 1.000 TL | 3.799 TL | 7 satış | 542,69 TL | 0,82 | 76,2 TL | %0,77 |
| **24.08 Yapay zeka3** | 120255713527810309 | Duraklatıldı | 1.000 TL | 3.677 TL | 6 satış | 612,86 TL | **1,83** | 83,1 TL | %1,08 |
| 24.08.2026 Yapay Zeka Cbo | 120255713527790309 | Duraklatıldı | 1.000 TL | 3.531 TL | 5 satış | 706,27 TL | 1,27 | 109 TL | %0,57 |
| YH \| Satın Alma \| ABO \| Eki 2026 | 120256269101840309 | ✅ Aktif | (reklam seti düzeyi) | 2.181 TL | 2 satış | 1.090,57 TL | 0,76 | 71,7 TL | %0,74 |
| 27.08 Yıldız CBO | 120255758118680309 | Duraklatıldı | 1.500 TL | 1.365 TL | 0 | — | — | 238,8 TL | %4,69 |

(Küçük harcamalı eski kampanyalar — ABO-23.05.2025, Ghibli, Yapay Zeka -yt — toplam ~450 TL, satış yok.)

## Bulgular

1. **Bütçenin ~%60'ı DM (mesaj) kampanyalarında.** Mesaj başı ~23 TL iyi; ancak DM'den kapanan satışlar pixel'e düşmediği için ROAS 0,5 görünüyor. Gerçek kârlılık bilinmiyor → **DM'den satışa dönüş oranı ölçülmeli.**
2. **"Yapay zeka" kreatifleri web satışında en iyi sonuç** (ROAS 1,27–1,83), ama ~3.500 TL'de durdurulmuşlar. Yapay zeka3 yeniden test adayı.
3. **CBO-0306** en çok satış getiren web kampanyası (33 satış, ROAS ~1,0) — başa baş civarı.
4. **27.08 Yıldız CBO**: CTR %4,69 (çok yüksek) ama CPM 239 TL ve 0 satış — tıklama var, dönüşüm yok → açılış sayfası/teklif uyumsuzluğu şüphesi.
5. **Pixel/işletme karmaşası:** Hesap Yummy Leather'da, ölçen pixel ("Yummy Light's pixel") Yummy Light işletmesinde. Kullanılmayan 2 pixel daha var.
6. **Eski kampanyalarda teslim hataları** (aktif reklamları etkilemiyor): silinmiş ürün setleri (Halil Abo Test 06.05.2026), silinmiş özel/benzer kitleler (PUR 30d, 30 gün alışveriş, Video min %50, addtocard-checkout-180, Benzer Hedef Kitle TR %5/%7), yasaklı hedefleme birleşimleri. Hesapta 50+ kampanya, çoğu "Kopya" → temizlik gerekli.

## Sonraki adımlar

Bkz. [`../yapilacaklar.md`](../yapilacaklar.md)
