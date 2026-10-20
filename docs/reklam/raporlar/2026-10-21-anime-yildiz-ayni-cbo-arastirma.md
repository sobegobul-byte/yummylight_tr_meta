# Anime ve Yıldız Haritası Aynı CBO'da mı Kalmalı?

**Tarih:** 21 Ekim 2026 · **Kampanya:** 9 Ekim 2026 CBO (3.500 TL/gün) · **Veri:** 9-20 Ekim, Meta

---

## 1. Kısa cevap

**Şimdilik aynı kampanyada kalsın, ama Anime setine minimum harcama tabanı koyalım.** Ayrı kampanyaya bölmenin zamanı günlük bütçe yaklaşık 7.000-8.000 TL'ye çıktığında gelir.

Bunu üç nedene dayandırıyorum:
1. **Bütçe bölünmeye yetmiyor.** İki ayrı kampanya, her biri öğrenmeden çıkmak için günde yaklaşık 3.600-4.500 TL ister. Bizim toplam bütçemiz 3.500 TL. Bölersek iki kampanya da kalıcı olarak "Öğrenme sınırlı" kalır.
2. **CBO şu an yanlış bir şey yapmıyor.** Bütçeyi satış maliyeti daha düşük olan Yıldız'a kaydırıyor (Yıldız'da satış başı 507 TL, Anime'de 637 TL). Bu senin 17 Ekim'deki "ana ürün yıldız haritası" kararınla da uyumlu.
3. **Anime'nin asıl sorunu kampanya yapısı değil, ölçüm.** WhatsApp'tan gelen Anime siparişleri Meta'ya değersiz satış olarak gidiyor. Meta, Anime'yi olduğundan zayıf görüyor. Önce bunu düzeltmek gerekiyor.

---

## 2. Bizim verimiz (9-20 Ekim)

| Set | Ürün | Harcama | Satış | Ciro | ROAS | Satış başı maliyet |
|---|---|---|---|---|---|---|
| Yıldız | Yıldız haritası | 19.775 TL | 39 | 32.943 TL | **1,67** | 507 TL |
| Anime | Anime fotoğraf lamba | 12.108 TL | 19 | 12.373 TL | 1,02 | 637 TL |
| Baba | Anime (baba açısı) | 2.098 TL | 3 | 3.099 TL | 1,48 | 699 TL |
| Araç | Arabalı lamba | 2.676 TL | 5 | 3.749 TL | 1,40 | 535 TL |
| Spotify | Spotify fotoğraflı | 3.292 TL | 3 | 2.199 TL | 0,67 | 1.097 TL |

**Anime (Anime ve Baba setleri birlikte):** 14.206 TL harcama, 22 satış, ROAS 1,09.

### CBO bütçeyi nasıl dağıttı (günlük pay)
| Dönem | Yıldız payı | Anime + Baba payı |
|---|---|---|
| 9-13 Ekim | %29-50 (ort. ~%39) | %22-39 (ort. ~%33) |
| 14-20 Ekim | %50-61 (ort. ~%56) | %30-47 (ort. ~%36) |

- **İlk günler:** Kampanyanın ilk 5 gününde CBO dört seti de sınadı. Anime bir gün (10 Ekim) Yıldız'dan fazla harcadı.
- **Sonraki hafta:** Yıldız'ın daha ucuza satış getirdiğini öğrendi ve payını %56'ya çıkardı.
- **Anime kaybolmadı.** Hâlâ günde 700-1.500 TL harcıyor, yani CBO onu tamamen aç bırakmıyor.
- **Asıl aç kalan Spotify oldu.** 14 Ekim'den sonra neredeyse sıfıra düştü.

### Ölçüm sorunu (en önemli bulgu)
- Anime setine yazılan satışların bir kısmı **değersiz**. Örneğin 14 Ekim'de 2 satışın değeri görünmüyor, 8_Yz ve 13_Yz'nin satışları da öyle. Bunlar büyük ihtimalle senin WhatsApp'tan aldığın ve ikas'a elle girdiğin siparişler.
- Anime müşterisi önizleme için DM'e daha çok yazıyor. Yani Anime'nin gerçek cirosu Meta'nın gördüğünden yüksek.
- CBO "satın alma sayısı" için optimize ediyorsa, değersiz satışlar yine sayılıyor. Ama ROAS'a bakarak verdiğimiz kararlarda Anime haksız yere zayıf görünüyor.

---

## 3. Araştırma: Uzmanlar ve Meta ne diyor

**Meta'nın resmi tarafı:**
- Advantage+ kampanya bütçesi (CBO) tek bir bütçeyi setler arasında paylaştırır. Amacı her sete eşit pay değil, kampanya genelinde en ucuz sonucu almaktır.
- Setlere minimum ve maksimum harcama limiti konabilir. Minimum bir "en iyi çaba" hedefidir, garanti değildir.
- Kaynak: [Meta Marketing API: Advantage Campaign Budget](https://developers.facebook.com/docs/marketing-api/bidding/guides/advantage-campaign-budget)

**Uzman ve ajans görüşleri (resmi değil, yön olarak):**
1. **Ürünleri set düzeyinde ayır, kampanya düzeyinde ayırma.** Ayrı kampanya sadece hedefler temelden farklıysa (yeni müşteri ve yeniden pazarlama gibi) ya da ürünlerin fiyatı ve satın alma döngüsü çok farklıysa açılmalı. ([Flighted](https://www.flighted.co/blog/how-multi-sku-brands-should-structure-meta-ads-campaigns), [Adwize](https://adwize.ai/blog/advantage-campaign-budget-distribution))
   - **Bizim durumumuz:** Anime ve Yıldız neredeyse aynı fiyatta (800-1.100 TL). İkisi de hediye ve aynı kitleye gidiyor, bu yüzden ayrı kampanya gerektirmiyor.
2. **CBO'nun bilinen zaafı: tek sete yığılma.** Bir set bütçenin %70-90'ını alabilir. Çözüm olarak iki şey öneriliyor: ya ihmal edilen sete minimum harcama tabanı konur, ya da o set ayrı bir kampanyaya çıkarılır. ([AdLibrary](https://adlibrary.com/posts/facebook-ads-budget-allocation-problems), [Superscale](https://superscale.ai/learn/cbo-vs-abo-advantage-plus/))
   - **Bizim durumumuz:** Yıldız'ın payı %56, yığılma var ama aşırı değil.
3. **Öğrenme eşiği haftada 50 dönüşüm.** Bir sayı olarak resmi değil ama yaygın kabul görüyor. Formül şöyle: günlük asgari bütçe = (satış başı maliyet × 50) ÷ 7. Az bütçeli hesaplarda kampanya ve set sayısını azaltmak öneriliyor. ([DTC Daily](https://dtcdaily.beehiiv.com/p/deep-dive-wednesdays-4b52), [Jetfuel](https://jetfuel.agency/meta-ads-campaign-structure-in-2026-abo-vs-cbo-and-budget-architecture-for-dtc-brands/))
4. **Aynı kitleye giden iki kampanya birbiriyle yarışır.** Meta aynı kişiye aynı hesaptan yalnızca bir reklam gösterir. İki kampanya aynı kişiyi hedeflerse biri geri çekilir. ([Warrior Forum tartışması](https://www.warriorforum.com/pay-per-click-search-engine-marketing-ppc-sem/1501430-meta-ads-multiple-product-categories-single-advantage-campaign.html))
5. **Test ve ölçek ayrımı:** Yeni ürün veya açılar küçük test kampanyalarında, kanıtlanmış kazananlar ana CBO'da çalışmalı. ([Skaleit](https://skaleit.agency/blog/abo-vs-cbo-test-scale-meta-ads/))

---

## 4. Seçenekler

### A) Aynı CBO'da kalsın (bugünkü yapı)
| Artı | Eksi |
|---|---|
| Tüm satış sinyali tek kampanyada toplanır (haftada ~45 satış) | Anime'ye ne kadar harcanacağını Meta seçer |
| Meta günlük olarak ucuz satışa kaydırır | Değersiz WhatsApp satışları yüzünden Anime zayıf görünür |
| İki ürün aynı kişiye gidiyorsa birbiriyle yarışmaz | Yeni Anime kreatifleri bütçe bulmakta zorlanır |

### B) İki ayrı CBO kampanyası (Yıldız ve Anime)
| Artı | Eksi |
|---|---|
| Her ürünün bütçesi sende, Anime garantili harcar | 3.500 TL bölününce ikisi de haftada ~20-25 satışta kalır, **ikisi de sürekli öğrenme sınırlı olur** |
| Raporlama daha temiz olur | Aynı kitleye (sevgiliye/aileye hediye alanlar) giden iki kampanya birbirinin gösterimini keser |
| | Öğrenme ikiye bölündüğü için satış maliyeti büyük ihtimalle yükselir |

**Hesap:** Yıldız'ın satış başı 507 TL × 50 ÷ 7 = günde **~3.600 TL**. Anime'nin 637 TL × 50 ÷ 7 = günde **~4.550 TL**. İkisini ayrı ayrı sağlıklı çalıştırmak için toplamda günde **~8.000 TL** gerekiyor.

### C) Aynı CBO, Anime setine minimum harcama tabanı (önerim)
- Anime seti için günlük minimum harcama 700-800 TL olsun. Baba setinde 300 TL ile yaptığımızın aynısı.
- Meta kalan bütçeyi yine istediği yere, büyük ihtimalle Yıldız'a verir.
- **Artı:** Sinyal tek kampanyada kalır, Anime'nin taban bütçesi garanti olur, geri alması kolaydır.
- **Eksi:** Tabanı çok yüksek koyarsak (örneğin 1.500 TL) CBO'nun avantajını kaybederiz. Minimum ayarı değiştirmek öğrenmeyi kısmen etkiler, o yüzden haftalık kreatif eklemesiyle aynı gün yapılmalı.

---

## 5. Önerim ve yol haritası

**Şimdi (bu hafta):**
1. **Aynı CBO'da kalalım** (seçenek C).
2. **Anime setine günlük minimum 700 TL koyalım.** Son 7 günde Anime zaten günde ortalama 1.000 TL civarı harcıyordu. Bu taban sadece kötü bir günde düşmesini engeller.
3. **Baba setini ileride Anime setine katalım.** Aynı ürün olduğu için ayrı set öğrenmeyi bölüyor. Baba setinin 18 Ekim kararı "kalsın" idi; birleştirmeyi Kasım'daki sadeleştirmede yapalım.
4. **Ölçümü düzeltelim (en önemlisi):** WhatsApp'tan gelen siparişleri ikas'a **gerçek tutarıyla** girelim. Böylece Meta'ya değerli satış olarak gider ve Anime'nin gerçek ROAS'ını görürüz.

**Ayrı kampanyaya ne zaman geçelim?** Şu üç koşuldan biri oluşursa:
- Günlük toplam bütçe **7.000-8.000 TL'yi** geçerse.
- Anime ve Yıldız **her biri** haftada 30+ satış almaya başlarsa.
- İki ürün için farklı hedef gerekirse (örneğin Anime için DM/WhatsApp satış kampanyası). Bu zaten planladığımız ayrı DM testi ve o testin kendi kampanyası olacak.

**Sevgililer Günü 2027 için:** Ocak sonunda bütçe büyüdüğünde Yıldız ve Anime'yi ayrı CBO'lara bölmek mantıklı olacak. O dönemde ikisi de günde 4.000 TL ve üzerini kaldırabilir.

---

## 6. Senin kararın

- **Seçenek C** (önerim): Aynı CBO kalsın, Anime setine minimum 700 TL.
- **Seçenek A:** Hiçbir şey değiştirmeyelim, Meta dağıtsın.
- **Seçenek B:** Şimdi iki ayrı kampanyaya bölelim. Önermem, çünkü bütçe yetmiyor.

Hiçbir değişiklik yapılmadı. Hangisini seçersen adım adım kurulum listesini veririm.
