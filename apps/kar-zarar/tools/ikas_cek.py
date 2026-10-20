"""ikas'tan bir ayın siparişlerini çekip ham JSON olarak kaydeder.
Kullanım: python3 ikas_cek.py 2026-10 cikti.json
Ortam: IKAS_CLIENT_ID, IKAS_CLIENT_SECRET, IKAS_STORE"""
import json, os, sys, time, urllib.request, urllib.parse
from datetime import datetime, timezone, timedelta

TR = timezone(timedelta(hours=3))
API = "https://api.myikas.com/api/v1/admin/graphql"
UA = {"User-Agent": "curl/8.5.0"}  # varsayılan Python UA'sı 403 alıyor

def token():
    store = os.environ["IKAS_STORE"].replace("https://", "").strip("/").removesuffix(".myikas.com")
    data = urllib.parse.urlencode({"grant_type": "client_credentials",
        "client_id": os.environ["IKAS_CLIENT_ID"], "client_secret": os.environ["IKAS_CLIENT_SECRET"]}).encode()
    req = urllib.request.Request(f"https://{store}.myikas.com/api/admin/oauth/token", data, UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)["access_token"]

def gql(tok, query, variables=None):
    req = urllib.request.Request(API, json.dumps({"query": query, "variables": variables or {}}).encode(),
        {"Authorization": "Bearer " + tok, "Content-Type": "application/json", **UA})
    for deneme in range(4):
        try:
            with urllib.request.urlopen(req, timeout=90) as r:
                d = json.load(r)
            if "errors" in d:
                raise RuntimeError(d["errors"])
            return d["data"]
        except (urllib.error.URLError, TimeoutError):
            time.sleep(2 ** deneme)
    raise RuntimeError("ikas'a ulaşılamadı")

ORDER_Q = """query($p:Int!,$from:Timestamp!,$to:Timestamp!){ listOrder(pagination:{limit:100,page:$p}, sort:"-orderedAt",
 orderedAt:{gte:$from,lte:$to}){ hasNext data{ id orderNumber orderedAt status orderPaymentStatus orderPackageStatus
 totalFinalPrice currencyCode note salesChannel{ name } paymentMethods{ type paymentGatewayName price }
 shippingLines{ price } orderLineItems{ quantity finalPrice status variant{ name } options{ name type values{ value } } } } } }"""
TX_Q = """query($id:String!){ listOrderTransactions(orderId:$id){ status type paymentMethod
 paymentMethodDetail{ installment{ installmentCount } } } }"""

def cek(ay):
    """ay: 'YYYY-MM'. O ayın siparişlerini (kartlılarda taksit bilgisiyle) döndürür."""
    y, m = map(int, ay.split("-"))
    bas = datetime(y, m, 1, tzinfo=TR)
    son = datetime(y + (m == 12), m % 12 + 1, 1, tzinfo=TR)
    tok = token()
    siparisler, p = [], 1
    while True:
        d = gql(tok, ORDER_Q, {"p": p, "from": int(bas.timestamp() * 1000), "to": int(son.timestamp() * 1000) - 1})["listOrder"]
        siparisler += d["data"]
        if not d["hasNext"]:
            break
        p += 1
    for o in siparisler:  # taksit sayısı sadece kartlı siparişlerde lazım
        if any(pm["type"] == "CREDIT_CARD" for pm in o["paymentMethods"]):
            o["transactions"] = gql(tok, TX_Q, {"id": o["id"]})["listOrderTransactions"]
    return siparisler


def main(ay, cikti):
    siparisler = cek(ay)
    json.dump(siparisler, open(cikti, "w"), ensure_ascii=False)
    print(len(siparisler), "sipariş kaydedildi:", cikti)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
