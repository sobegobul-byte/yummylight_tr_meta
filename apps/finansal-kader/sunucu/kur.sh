#!/bin/bash
# Oracle VM'de calistirilir: sudo bash kur.sh <paket.tar.gz>
set -euo pipefail
PAKET="$1"; HEDEF=/opt/finansal-kader
if ss -ltn | grep -q ':8102 '; then echo "HATA: 8102 portu dolu"; exit 1; fi
mkdir -p $HEDEF
tar -xzf "$PAKET" -C $HEDEF --no-same-owner
mkdir -p $HEDEF/veri && chmod 700 $HEDEF/veri
chown -R opc:opc $HEDEF
sudo -u opc python3 -m venv $HEDEF/.venv
sudo -u opc $HEDEF/.venv/bin/pip install -q --disable-pip-version-check -r $HEDEF/requirements.txt
cp $HEDEF/sunucu/finansal-kader.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now finansal-kader
sleep 3
systemctl is-active finansal-kader
curl -s -o /dev/null -w "yerel test: %{http_code}\n" http://127.0.0.1:8102/giris
