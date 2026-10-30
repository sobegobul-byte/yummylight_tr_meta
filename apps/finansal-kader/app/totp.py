"""Google Authenticator uyumlu TOTP (RFC 6238): 6 hane, 30 saniye, SHA1. Sadece standart kutuphane."""
from __future__ import annotations

import base64
import hashlib
import hmac
import secrets
import struct
import time


def yeni_anahtar() -> str:
    return base64.b32encode(secrets.token_bytes(20)).decode().rstrip("=")


def _kod(anahtar: str, adim: int) -> str:
    k = base64.b32decode(anahtar + "=" * (-len(anahtar) % 8))
    h = hmac.new(k, struct.pack(">Q", adim), hashlib.sha1).digest()
    o = h[-1] & 0x0F
    sayi = (struct.unpack(">I", h[o:o + 4])[0] & 0x7FFFFFFF) % 1_000_000
    return f"{sayi:06d}"


def dogrula(anahtar: str, kod: str, pencere: int = 1) -> int | None:
    """Kod gecerliyse kullanilan zaman adimini dondurur (ayni kod ikinci kez kullanilmasin diye)."""
    kod = "".join(c for c in str(kod) if c.isdigit())
    if len(kod) != 6:
        return None
    simdi = int(time.time()) // 30
    for d in range(-pencere, pencere + 1):
        if hmac.compare_digest(_kod(anahtar, simdi + d), kod):
            return simdi + d
    return None


def uri(anahtar: str, hesap: str = "Fatih", yayinci: str = "Finansal Kader") -> str:
    from urllib.parse import quote
    return f"otpauth://totp/{quote(yayinci)}:{quote(hesap)}?secret={anahtar}&issuer={quote(yayinci)}&digits=6&period=30"
