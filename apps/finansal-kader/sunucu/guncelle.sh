#!/bin/bash
# Oracle VM'de: sudo bash guncelle.sh  -> kodu depodan gunceller, veri/ klasorune dokunmaz
set -euo pipefail
HEDEF=/opt/finansal-kader
URL=https://raw.githubusercontent.com/sobegobul-byte/yummylight_tr_meta/claude/project-thread-u4nwb3/apps/finansal-kader/finansal-kader.tar.gz
T=$(mktemp -d)
curl -fsSL "$URL" -o "$T/paket.tar.gz"
tar -xzf "$T/paket.tar.gz" -C "$T"
cp -a "$HEDEF/app" "$T/app-yedek"
rm -rf "$HEDEF/app"
cp -r "$T/app" "$HEDEF/app"
cp "$T/requirements.txt" "$HEDEF/" && cp -r "$T/sunucu" "$HEDEF/"
chown -R opc:opc "$HEDEF/app" "$HEDEF/sunucu" "$HEDEF/requirements.txt"
sudo -u opc "$HEDEF/.venv/bin/pip" install -q --disable-pip-version-check -r "$HEDEF/requirements.txt"
systemctl restart finansal-kader
sleep 3
if [ "$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8102/giris)" != "200" ]; then
  echo "HATA: yeni surum acilmadi, eski surume donuluyor"
  rm -rf "$HEDEF/app" && cp -a "$T/app-yedek" "$HEDEF/app" && systemctl restart finansal-kader
  journalctl -u finansal-kader -n 20 --no-pager; exit 1
fi
grep -o 'SURUM = "[0-9.]*"' "$HEDEF/app/main.py"
systemctl is-active finansal-kader
rm -rf "$T"
