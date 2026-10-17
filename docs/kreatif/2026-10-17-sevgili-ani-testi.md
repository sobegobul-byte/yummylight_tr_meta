# Sevgili anı testi · 11_YH kopyaları (17 Ekim 2026)

**Fatih'in kararı:** Lambayı şu anda çoğunlukla sevgililer alıyor, bu yüzden test sevgili kitlesinde kalır. 11_YH'nin kalıbı aynen korunur, her videoda değişen **tek şey anıdır**: alıntı ve lambadaki yazı.

## Sabit kalanlar (11_YH ile aynı)
- **Oda:** aynı oda, aynı görüntü. Bütün videolarda aşağıdaki tek mekan promptu kullanılır.
- **Lamba:** ilk karede yanık, ekranın ortasında, yazı okunur.
- **Alıntı kalıbı:** Sevgilimin "…" diyerek verdiği hediye. Yazı üstte, TikTok yazı stilinde, beyaz ve gölgeli.
- **Kurgu:** önce uzak plan, sonra yakın plan. Müzik aynı. Süre 9 sn.
- **Teklif:** 4,5. saniyeden sonra küçük satır: Ücretsiz kargo · Kapıda ödeme · Peşin fiyatına 3 taksit.
- **Son kare:** Kendi gecenizin gökyüzü ↓ Tarihini seç.

## Değişen: anı (6 video)

| # | Ad | Alıntı (hook) | Lambadaki yazı |
|---|---|---|---|
| 1 | YH_tanisma_v2 | Sevgilimin "seninle tanıştığımız gece yıldızlar böyleydi" diyerek verdiği hediye | Seninle tanıştığımız gece · İstanbul · 22.12.2018 · 21:30 · 41.0082°K · 28.9784°D |
| 2 | YH_ilkbulusma_v1 | Sevgilimin "ilk buluştuğumuz gece gökyüzü tam olarak böyleydi" diyerek verdiği hediye | İlk buluşmamız · İzmir · 14.02.2021 · 20:15 · 38.4237°K · 27.1428°D |
| 3 | YH_seviyorum_v1 | Sevgilimin "sana ilk kez seni seviyorum dediğim gece yıldızlar böyleydi" diyerek verdiği hediye | İlk "seni seviyorum" · Ankara · 03.09.2022 · 23:40 · 39.9334°K · 32.8597°D |
| 4 | YH_baslangic_v1 | Sevgilimin "her şeyin başladığı gece gökyüzü böyleydi" diyerek verdiği hediye | Her şeyin başladığı gece · Bursa · 17.06.2020 · 22:00 · 40.1885°K · 29.0610°D |
| 5 | YH_evet_v1 | Nişanlımın "bana evet dediğin gece yıldızlar böyleydi" diyerek verdiği hediye | Evet dediğin gece · Antalya · 08.08.2023 · 21:45 · 36.8969°K · 30.7133°D |
| 6 | YH_ozlem_v1 | Sevgilimin "uzakta olsak da aynı gökyüzünün altındayız" diyerek verdiği hediye | Aynı gökyüzünün altında · Eskişehir · 11.11.2022 · 22:30 · 39.7767°K · 30.5206°D |

- **1 numara kontrol videosudur.** 11_YH'nin alıntısını doğru koordinatla tekrarlar. Diğerleri ona göre ölçülür.
- **5 numara** kitleyi biraz daraltır (nişanlı ve evli çiftler). Yine de sevgili kitlesinin içinde kalır.
- **Tarih ve saatler örnektir.** Hepsi gece saatidir, çünkü alıntılar "gece" diyor. Koordinatlar şehir merkezlerinin gerçek değerleridir ve Starmap Studio formatındadır.

## Promptlar (Nano Banana Pro, 9:16, 2K)

### Mekan (bütün videolarda aynı, referans eklenmez)
```
Real smartphone photo of a young woman's cozy bedroom at night, vertical 9:16. A light grey desk against a wall covered with pastel posters and small art prints, a lilac ribbed rainbow ceramic object, an orange arch object, a wavy lilac vase with dried flowers, twisted cream candles, a small plant. Warm dim ambient light, slightly messy and lived-in, not a studio. Empty space in the middle of the desk in the foreground. Shallow depth of field, natural phone grain. No people, no readable text, no logos.
```

### Ürün (her anı için yalnızca dört satır değişir)
Referans olarak `referans_yuvarlak_lamba.jpg` eklenir (11_YH'deki gerçek lambanın yazısız karesi, bilgisayarda `Desktop To Cloud\Kare Yıldız\Referans\` klasöründe). Yoksa `urun_v2b.png` kullanılır.
```
Use the attached photo as the exact product reference. Real smartphone photo, vertical 9:16, of the same star map night lamp on the light grey desk of a cozy pastel bedroom at night: one single round disc of crystal clear transparent acrylic with a real star map laser-engraved inside it, glowing white stars and thin constellation lines, a thin engraved horizon line near the bottom and under it four centered lines of laser-engraved glowing text, elegant serif font:
[SATIR 1]
[SATIR 2]
[SATIR 3]
[SATIR 4]
Two small curved feet seated in a low oval light beech wood base with a warm light strip, black USB cable behind. The lamp is the main light, soft warm glow on the desk. Hand-sized lamp, warm white light, not RGB. Keep the product shape and wooden base identical to the reference. Text spelled exactly, correct Turkish letters. No people, no hands, no other text, no watermark.
```
Köşeli parantezli satırların yerine tablodaki dört satır yazılır. Örneğin 2 numara için:
```
İlk buluşmamız
İzmir
14.02.2021 · 20:15
38.4237°K · 27.1428°D
```

### Birleşik (mekan ve ürün sonucu birlikte referans)
```
Place the exact lamp from the second reference on the empty middle of the desk in the room from the first reference, lamp switched on and glowing, slightly from the side like the first reference's camera angle. Keep the lamp's shape, feet, wood base, black USB cable and the engraved text exactly as in the reference. The room stays the same. Real smartphone photo at night, natural grain. No people, no hands, no extra text. Vertical 9:16.
```

## Test önerisi (karar Reklam ve Fatih'te)
- 6 video aynı reklam setine, eşit bütçeyle girer. 11_YH açık kalır.
- 3. günün sonunda CTR ve satın almaya bakılır. En zayıf iki video kapatılır.
- Kazanan anı belirlenince ikinci tur açılır: aynı anı farklı bir odada ya da hediyeyi veren tarafın ağzından ("Sevgilime … diyerek verdiğim hediye").

## Kontrol listesi (her görselde)
- Lambadaki yazıyı harf harf kontrol et. Özellikle ı, ş, ğ, İ ve tırnak işaretleri bozulabiliyor.
- Koordinatta K ve D harfleri olmalı. N, E veya W olmamalı.
- Lamba el boyunda olmalı, ışık sıcak beyaz olmalı (RGB değil). Siyah USB kablosu görünmeli.
