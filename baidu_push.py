import os
import requests
import time


# ==========================
# ��������
# ==========================

DOMAIN = "https://hrtos.com"

TOKEN = "6SddKqcy7lDycMqo"

SITE = "hrtos.com"

# ��վ�ļ�Ŀ¼
ROOT_DIR = "./"


# �ٶȽӿ�
API = (
    "http://data.zz.baidu.com/urls?"
    f"site={SITE}&token={TOKEN}"
)


# ==========================
# ɨ��HTML
# ==========================

def scan_html():

    urls = []

    for root, dirs, files in os.walk(ROOT_DIR):

        for file in files:

            if file.endswith(".html"):

                path = os.path.join(root, file)

                path = path.replace("\\", "/")

                # ȥ�� ./ 
                path = path.replace("./", "")

                url = DOMAIN + "/" + path

                urls.append(url)

    return urls



# ==========================
# �ٶ��ύ
# ==========================

def push(urls):

    # �ٶȽ���һ�β�Ҫ̫��
    batch = 50

    total = len(urls)

    print("������ҳ:", total)


    for i in range(0, total, batch):

        data = "\n".join(
            urls[i:i+batch]
        )


        try:

            r = requests.post(
                API,
                data=data.encode("utf-8"),
                headers={
                    "Content-Type":"text/plain"
                }
            )


            print(
                f"�ύ {i+1}-{min(i+batch,total)}:"
            )

            print(r.text)


        except Exception as e:

            print("����:", e)


        time.sleep(1)



# ==========================
# ������
# ==========================

if __name__ == "__main__":

    urls = scan_html()

    push(urls)