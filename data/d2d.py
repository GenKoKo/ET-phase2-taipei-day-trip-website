# ref: https://www.learncodewithmike.com/2020/02/python-mysql.html
# ref: https://jenifers001d.github.io/2019/12/11/Python/learning-Python-day9/

import json
import pymysql
from decimal import Decimal
import os
from dotenv import load_dotenv

load_dotenv()
db_settings ={
    "host": os.getenv('MYSQL_HOST'),
    "port": 3306,
    "user": os.getenv('MYSQL_USER'),
    "password": os.getenv('MYSQL_PASSWORD'),
    "db": os.getenv('MYSQL_DB'),
    "charset": "utf8"
}


with open('taipei-attractions.json', 'r',encoding='utf-8') as f:
    data = json.load(f)
    spots = data['result']['results']
    photo_urls = data['result']['results'][0]['file']


try:
    conn = pymysql.connect(**db_settings)

    
    with conn.cursor() as cursor: 
        # 重開新的table
        cursor.execute("DROP TABLE IF EXISTS tpspot")
        cursor.execute("CREATE TABLE tpspot (_id bigint NOT NULL, stitle varchar(255) , CAT2 varchar(255), xbody varchar(5000), address varchar(255), info varchar(5000), MRT varchar(255),latitude decimal(8,6) , longitude decimal(9,6) ,file blob(65535) ,PRIMARY KEY(_id))")

        # 測試 MySQL connect
        # command2 = "Select * from tpspot"
        # cursor.execute(command2)
        # result = cursor.fetchall()
        # print(result)

 
        for spot in spots:
            count = 0
            # 確定單一景點內有多少個連結
            count = spot['file'].count('http://')

            # 將file的連續字串切分
            photo_urls = spot['file'].split('http://')

            # 印出理清並含有jpg/png的景點連結，再依各景點整合至單一list
            i = 1
            aggregate_photo_url = []
            url_list_string = ''
            while i <= count:
                full_photo_url = 'http://' + photo_urls[i]
                # 排除jpg, png以外的檔案
                if full_photo_url.count('.jpg') or full_photo_url.count('.png') or full_photo_url.count('.JPG') or full_photo_url.count('.PNG'):
                    aggregate_photo_url.append(full_photo_url)
                i += 1

            url_list_string = str(aggregate_photo_url)   
            
            command = "INSERT INTO tpspot (_id, stitle, CAT2, xbody, address, info, MRT, latitude, longitude, file) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
            cursor.execute(command, (spot['_id'],spot['stitle'],spot['CAT2'], spot['xbody'], spot['address'], spot['info'], spot['MRT'], Decimal(spot['latitude'].strip('"')), Decimal(spot['longitude'].strip('"')), url_list_string))
            conn.commit()   
        
    print("Success")



except Exception as ex:
    print(ex)

