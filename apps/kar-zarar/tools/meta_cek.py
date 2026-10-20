"""Meta reklam hesabının günlük harcamasını (KDV hariç) Marketing API'den çeker.
Ortam: META_TOKEN (ads_read yetkili erişim anahtarı), META_HESAP (varsayılan act_1420404848780789)."""
import json, os, urllib.parse, urllib.request
from datetime import date, timedelta

SURUM = os.environ.get("META_API_SURUM", "v23.0")


def gunluk_harcama(ay):
    y, m = map(int, ay.split("-"))
    bas = date(y, m, 1)
    son = min(date(y + (m == 12), m % 12 + 1, 1) - timedelta(days=1), date.today())
    hesap = os.environ.get("META_HESAP", "act_1420404848780789")
    q = urllib.parse.urlencode({"fields": "spend", "level": "account", "time_increment": 1,
        "time_range": json.dumps({"since": bas.isoformat(), "until": son.isoformat()}),
        "limit": 100, "access_token": os.environ["META_TOKEN"]})
    url, sonuc = f"https://graph.facebook.com/{SURUM}/{hesap}/insights?{q}", {}
    while url:
        with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "curl/8.5.0"}), timeout=60) as r:
            d = json.load(r)
        for satir in d.get("data", []):
            sonuc[satir["date_start"]] = float(satir["spend"])
        url = d.get("paging", {}).get("next")
    return sonuc
