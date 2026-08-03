# -*- coding: utf-8 -*-

import os
import requests


HOST = "hrtos.com"

KEY = "2e9c235b6e514140bbda538042888608"

KEY_LOCATION = (
    f"https://{HOST}/{KEY}.txt"
)


urls = []


for root, dirs, files in os.walk("."):

    for file in files:

        if file.endswith(".html"):

            path = os.path.join(root,file)

            path = path.replace("\\","/")
            path = path.replace("./","")

            url = "https://" + HOST + "/" + path

            urls.append(url)



print("发现网页:", len(urls))


data = {
    "host": HOST,
    "key": KEY,
    "keyLocation": KEY_LOCATION,
    "urlList": urls
}


r = requests.post(
    "https://api.indexnow.org/indexnow",
    json=data,
    headers={
        "Content-Type":"application/json"
    }
)


print(r.status_code)
print(r.text)