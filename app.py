from flask import *
from flask import request
from flask_mysqldb import MySQL,MySQLdb
# UTF encoding https://flask.palletsprojects.com/en/1.1.x/config/
# import json
from decimal import Decimal
import os
from dotenv import load_dotenv

load_dotenv()

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.secret_key = os.getenv('secret_key')
app.config["MYSQL_HOST"] = os.getenv('MYSQL_HOST')
app.config["MYSQL_USER"] = os.getenv('MYSQL_USER')
app.config["MYSQL_PASSWORD"] = os.getenv('MYSQL_PASSWORD')
app.config["MYSQL_DB"] = os.getenv('MYSQL_DB')

mysql = MySQL(app)

class MyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, bytes):
            return str(obj, encoding='utf-8')
        elif isinstance(obj, Decimal ):
            return float(obj)
        return json.JSONEncoder.default(self, obj)
        # return str(obj, encoding='utf-8')


# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")


@app.route("/test")
def test():
	return "it is a test"

@app.route("/api/attractions")
def api_attractions():
	page = request.args.get("page", 0, type = int) 
	keyword = request.args.get("keyword", type = str)
	
	cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
	if keyword:
		# count_target_data = cur.execute(f"Select count(*) FROM tpspot WHERE stitle LIKE '%{keyword}%'")
		cur.execute(f"Select * FROM tpspot WHERE name LIKE '%{keyword}%'")
	if not keyword:
		# count_target_data = cur.execute("SELECT COUNT(*) FROM tpspot")
		cur.execute("Select * FROM tpspot")

	# ref https://my.oschina.net/u/2435120/blog/632340
	results = cur.fetchall()
	result = list(results)
	count_results = len(results)
	pages = len(result)//12+1
	
	
	list_12 = []
	# 翻頁
	j=page*12
	# 計算12個item
	i = 0
	while i < 12 and i < count_results:
		list_12.append(result[i+j])
		i += 1

	nextPage = page+1 if page < pages-1 else None

	if results:
		dict = { 'nextPage': nextPage, 'data': list_12}     
		return Response(response=json.dumps(dict, cls=MyEncoder ,indent = 2), status=200)
	else:
		dict = {'error': True, 'message': "it is 500 ERROR~伺服器內部錯誤"}
		return Response(response=json.dumps(dict, indent = 2),status=500)


@app.route("/api/attraction/<attractionId>")
def api_attractionIDL(attractionId):
	cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
	cur.execute(f"Select * FROM tpspot WHERE id = {attractionId}")
	result = cur.fetchone()


	# ref https://qiita.com/mink0212/items/52e0ebd66bd94e1303c1
	if result:
		dict = { 'data': result}     
		# {'id':result['_id'], 'name':result['stitle'], 'category':result['CAT2'], 'description':result['xbody'], 'address':result['address'], 'transport':result['info'],  'mrt':result['MRT'], 'latitude':result['latitude'], 'longitude':result['longitude'], 'images':result['file']}
		return Response(response=json.dumps(dict, cls=MyEncoder ,indent = 2), status=200)

	elif not result:
		dict = {'error': True, 'message': "it is 400 ERROR~景點編號不正確"}
		return Response(response=json.dumps(dict, indent = 2), status=400)

	else:
		dict = {'error': True, 'message': "it is 500 ERROR~伺服器內部錯誤"}
		return Response(response=json.dumps(dict, indent = 2),status=500)




if __name__ == "__main__":
	app.run(host='0.0.0.0', port=3000, debug = True)	
	# app.run(port=3000, debug = True)	



