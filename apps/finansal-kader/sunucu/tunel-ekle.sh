#!/bin/bash
# Oracle VM'de: sudo bash tunel-ekle.sh  -> kader.yummylightstore.com kuralini paylasilan tunele ekler
set -euo pipefail
C=/etc/cloudflared/config.yml
if grep -q 'kader.yummylightstore.com' "$C"; then echo "Kural zaten var."; exit 0; fi
YEDEK="$C.yedek-$(date +%Y%m%d-%H%M%S)"
cp "$C" "$YEDEK"; echo "Yedek: $YEDEK"
geri_al() { cp "$YEDEK" "$C"; echo "HATA: config eski haline dondu."; exit 1; }
python3 - "$C" <<'P' || geri_al
import re, sys
p = sys.argv[1]
L = open(p).read().split("\n")
# catch-all = hostname'i olmayan son "- service:" satiri; yeni kural hemen ustune, ayni girintiyle
i = max(n for n, s in enumerate(L) if re.match(r"\s*- service:", s))
g = re.match(r"(\s*)-", L[i]).group(1)
L[i:i] = [g + "- hostname: kader.yummylightstore.com", g + "  service: http://127.0.0.1:8102"]
open(p, "w").write("\n".join(L))
P
cloudflared tunnel --config "$C" ingress validate || geri_al
cloudflared tunnel --config "$C" ingress rule https://kader.yummylightstore.com || geri_al
systemctl restart cloudflared
sleep 5
systemctl is-active cloudflared
