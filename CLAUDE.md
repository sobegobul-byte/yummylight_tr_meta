# Yummy Light · Meta Reklam Çalışma Alanı

Hesap: Fatih Narmanlı (act_1420404848780789) · Pixel: 205661538800855 · Site: yummylightstore.com (ikas)
Hedef: Sevgililer Günü 2027'ye kadar kârlı büyüme; kısa vadeli taban ROAS 2.

## İş bölümü: iki ayrı sohbet, tek repo
Bu repo iki ayrı Claude sohbeti tarafından kullanılır. Karışmaması için:

| Sohbet | Kendi klasörü | Ne yapar |
|---|---|---|
| **Reklam** | `docs/reklam/` | Kampanya kurulumu, bütçe, günlük/haftalık raporlar, Meta API |
| **Kreatif** | `docs/kreatif/` | Video kurguları, ekran yazıları, reklam metinleri, Higgsfield üretimleri |

- **Her sohbet sadece kendi klasörüne yazar.** Diğerinin klasörünü okuyabilir, değiştirmez.
- **Köprü `docs/ortak/`:**
  - `docs/ortak/kreatif-brief-*.md`: Reklam sohbeti yazar. Hangi kurgu lazım, neden, hangi metinle.
  - `docs/ortak/teslim-listesi.md`: Kreatif sohbeti yazar. Hazır olan video/metin, dosya yeri, reklam adı.
- **Her işe başlamadan önce** `git pull` yap ve `docs/ortak/` klasörünü oku. Diğer sohbet bir şey eklemiş olabilir.
- Commit mesajının başına `[reklam]`, `[kreatif]` ya da `[ortak]` yaz.

## Rapor formatı
- Kullanıcıya verilen her rapor **PDF** olarak da gönderilir (telefondan açıyor).
- Markdown raporu yaz → `python3 tools/md2pdf.py <girdi.md> <kendi-klasörün>/pdf/<tarih-ad>.pdf` → PDF'i dosya olarak gönder.
- `tools/md2pdf.py` için gerekirse önce `pip install markdown` (Chromium/Playwright ortamda hazır).

## Kreatif ve metin kuralları (iki sohbet için de geçerli)
- "Ghibli" kelimesi kullanılmaz → "anime / masal tarzı".
- Sitede gerçekten olmayan indirim yazılmaz (%20/%40 vb.). Doğrulanmış teklif: **Ücretsiz kargo · Kapıda ödeme · Peşin fiyatına 3 taksit**.
- Yapay zeka ürünlerinde "elle çizim" denmez.
- Mevsim metni sezon bitince kaldırılır (Babalar Günü metni Şubat'ta yayında olmaz).
- Video: 8-10 sn, dikey 9:16, ilk karede ürün + vesile, ekranda teklif, son karede çağrı.
- Reklam adı standardı: `ÜRÜN_AÇI_vN` (örn. `YH_ilkbulusma_v1`). "vid1" gibi isim yok.
- Reklam hedefi satışsa yönlendirme siteye; DM/WhatsApp'a değil.

## Reklam kuralları
- Yayına alma, bütçe değişikliği, reklam açma/kapama **kullanıcı onayı olmadan yapılmaz.**
- Yeni kreatif haftada bir, tek seferde eklenir. "- Kopya" kampanya açılmaz.
- Ayrıntılı geçmiş ve kararlar: `docs/reklam/yapilacaklar.md`, analizler: `docs/reklam/raporlar/`.
