import base64
import http.client
import json
import hashlib
from hashlib import sha256
import hmac
import string
import time

#################################### 需要修改的信息 ####################################
appid = "3d534491d3964a54b7f2db5e383bdf9d"
secret_key = "3b71de1385404987"

# 修改请求参数
# request_data = R'{"deviceSn":"xxx"}'
request_data = R'{"protocol": 1}'
# 修改接口路径
# url = "/cmiot/v2/api/device/setting"
url = "/cmiot/v2/api/device"
# 修改接口的方法大写
# method = "PUT"
method = "POST"
#################################### 需要修改的信息 ####################################


def get_parameters():
    timestamp = str(round(time.time()*1000))
    content = request_data.encode('utf-8')
    md5 = hashlib.md5(content).hexdigest()
    print(md5)
    mess = "{0},{1},{2},{3},{4}".format(secret_key, appid, timestamp, url, md5)
    print(mess)
    key = secret_key.encode('utf-8')
    message = mess.encode('utf-8')
    sign = base64.b64encode(hmac.new(key, message, digestmod=sha256).digest())
    sign_result = str(sign, 'utf-8')
    print(sign_result)

    headers = {
    'appid': appid,
    'msgSeq': 'VIOT-PYTHON-DEMO',
    'timestamp': timestamp,
    'signature': sign_result,
    'Content-Type': 'application/json'
    }

    return content,headers

def http_connect():
    data = get_parameters()
    payload = data[0]
    headers = data[1]
    conn = http.client.HTTPSConnection("openapi.videiot.cn", 8081)
    conn.request(method, url, payload, headers)
    res = conn.getresponse()
    data = res.read()
    print(data.decode("utf-8"))


if __name__ == '__main__': 
    http_connect()