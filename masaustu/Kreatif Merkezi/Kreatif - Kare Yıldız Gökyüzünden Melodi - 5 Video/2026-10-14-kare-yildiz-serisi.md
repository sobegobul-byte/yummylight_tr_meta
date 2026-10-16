# Kare Yıldız serisi · 5 reklam videosu (14 Ekim 2026)

**Ürün:** Gökyüzünden Melodi: Yıldız Haritası & Spotify Temalı
- Link: https://yummylightstore.com/gokyuzunden-melodi--yildiz-haritasi-spotify-temali
- Yıldız haritası, kişiye özel tarih ve konuma göre çizilir. Altında seçilen şarkının kodu var; kod telefonla okutulunca şarkı açılıyor.

**Kaynak:** Fatih'in "Kare Yıldız" klasörü, 68 klip.
- RGB nemlendiricili klipler (2864–2891 ve copy_*) kullanılmadı. Lamba sıcak ışıklı ve renkli ışık yanıltıcı olur.
- 3303–3306 kullanılmadı, çünkü içlerinde başka ürünler var.

**Ortak kurallar:** Hepsi 9 saniye, dikey 9:16. Ürün ilk karede görünüyor, teklif ortada, çağrı sonda. Yazılar üst alanda, alt %20 boş.
- Orta yazı: "Hızlı kargo · Peşin fiyatına 3 taksit"
- Son yazı: "Tarihini seç, şarkını ekle ↓" + "Ücretsiz kargo · Kapıda ödeme"
- Sitedeki %20 indirim yazılmadı, çünkü fiyat değişebilir. Bu üründe önizleme doğrulanmadığı için önizleme sözü de yok.

**Dosyalar:**
- Videolar: `/mnt/project-files/kreatif/videolar/YH_*_v1.mp4`
- Kurgu kodu: `docs/kreatif/remotion/src/Y1..Y5*.tsx`

## Videolar

| Reklam adı | Stil (yeni) | Hook (ilk 3 sn) | Klipler |
|---|---|---|---|
| `YH_gokyuzu_v1` | Takımyıldız çizimi: yıldızlar belirir ve çizgilerle bağlanır, ince Bodoni yazı | "Tanıştığınız gece gökyüzü böyleydi." | 2734, 2736, 2733, 2746, 2800 |
| `YH_sarki_v1` | Müzik çalar kartı: dönen plak, ekolayzır, ilerleme çubuğu | "Bu lambayı telefonla okut… ve çalsın ▶" (kodu okutma çekimi) | 2734, 2747, 2748, 2746, 2800 |
| `YH_tarih_v1` | Sayaç: tarih rakamları dönerek oturur, koordinatlar daktiloyla yazılır | "Hangi tarih hayatını değiştirdi? 12.06.2019" | 2800, 2799, 2801, 2796 |
| `YH_anket_v1` | Hikâye anketi: "Sevgiline hediye? Çiçek / Sizin gökyüzünüz", parmakla seçim | "Çiçek birkaç günde solar. Gökyüzünüz her gece yanar." | 2860, 2862 (sis), 2859, 2892, 2853 |
| `YH_not_v1` | Daktilo notu: krem kâğıda lambadaki cümle yazılır | "Ona hiç söyleyemediğin o cümle… her gece başucunda yazsın." | 2737, 2736, 2860, 2859, 2733 |

**Öneri:** `YH_sarki_v1` ve `YH_gokyuzu_v1` ilk sırada denensin. Şarkının telefonla çaldığını göstermek, ürünü diğer yıldız haritalarından ayıran en güçlü kanıt.

## Reklam metinleri (video başına; buton "Alışveriş Yap", link ürün sayfası)

Hepsinin son satırı aynı: 🚚 Ücretsiz kargo · Kapıda ödeme · Peşin fiyatına 3 taksit 👇

| Reklam | Metin (ilk 3 satır) | Başlık | Açıklama |
|---|---|---|---|
| YH_gokyuzu_v1 | Tanıştığınız gece gökyüzü tam olarak böyleydi ✨ / 📍 Tarih ve şehri seç, o gecenin gerçek yıldız haritasını çizelim / 🎵 Altında ilk şarkınızın kodu | O Gecenin Gökyüzü Başucunuzda ✨ | Ücretsiz kargo · Kapıda ödeme |
| YH_sarki_v1 | Telefonla okut, şarkınız çalsın 🎵 / ✨ Yıldız haritanız ve şarkınızın kodu tek lambada / 💡 Ahşap tabanlı, sıcak ışıklı gece lambası | Okut, Şarkınız Çalsın 🎵 | Yıldız haritası + şarkı kodu |
| YH_tarih_v1 | Hangi tarih hayatını değiştirdi? 💫 / 📍 O gün, o şehirden görünen gökyüzünü lambaya işleyelim / 🎵 İsterseniz altına şarkınızın kodu | O Tarihin Gökyüzü Lambanda 💫 | Ücretsiz kargo · Kapıda ödeme |
| YH_anket_v1 | Çiçek birkaç günde solar… gökyüzünüz her gece yanar 🌌 / 📍 Tanıştığınız gecenin yıldız haritası / 🎵 İlk şarkınızın kodu, kişiye özel mesajınız | Solmayan Hediye: Sizin Gökyüzünüz 🌌 | Sevgiliye anlamlı hediye |
| YH_not_v1 | Ona hiç söyleyemediğin o cümle… her gece başucunda yazsın 💛 / ✍️ Mesajın, tarihin ve şarkın tek lambada / 🌌 O gecenin gerçek yıldız haritasıyla | Söyleyemediklerin Işıkla Yazsın 💛 | Ücretsiz kargo · Kapıda ödeme |

## Test planı
- **Kurulum:** 5 video Yıldız setine tek seferde eklenir.
- **3. gün:** CTR'ı ve 3 saniye izlenme oranı en düşük 2 video kapatılır.
- **7. gün:** satış başı maliyeti en iyi olan kalır ve onun v2'si yapılır.
- **Onay:** yayına alma ve bütçe kararları Fatih'in onayıyla, Reklam tarafında.
