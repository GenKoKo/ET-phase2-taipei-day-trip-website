from flask import *
from flask import request
from flask_mysqldb import MySQL,MySQLdb
# UTF encoding https://flask.palletsprojects.com/en/1.1.x/config/
# import json
from decimal import Decimal
import os
from dotenv import load_dotenv
import platform

load_dotenv()

app = Flask(__name__,
            static_folder="static",
            static_url_path="/"
        )


#MySQL 設定
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.secret_key = os.getenv('secret_key')
app.config["MYSQL_HOST"] = os.getenv('MYSQL_HOST')
app.config["MYSQL_USER"] = os.getenv('MYSQL_USER')
app.config["MYSQL_PASSWORD"] = os.getenv('MYSQL_PASSWORD')
app.config["MYSQL_DB"] = os.getenv('MYSQL_DB')
mysql = MySQL(app)

#API content encoder
class MyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, bytes):
            return str(obj, encoding='utf-8')
        elif isinstance(obj, Decimal ):
            return float(obj)
		# elif isinstance(obj, str):
		# 	return list(obj)
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

#route 測試
@app.route("/test")
def test():
	return "it is a test"

# cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

#API 旅遊景點
@app.route("/api/attractions", methods=["GET","POST"])
def api_attractions():
	
	page = request.args.get("page", 0, type = int) 
	keyword = request.args.get("keyword", type = str)
	# keyword = request.form("search",None, type = str)
	
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
	# result_str = open(result,'r')
	
	list_12 = []
	list_images =[]
	# 翻頁
	j=page*12
	# 計算12個item
	i = 0
	while i < 12 and i < count_results:
		list_images_replaced = result[i+j]['images'].decode('utf-8').replace("'","").replace("[","").replace("]","").replace(" ","")
		list_images = list_images_replaced.split(",")
		# list_images_replaced = list_images
		result[i+j]['images'] = list_images
		list_12.append(result[i+j])

		i += 1

	nextPage = page+1 if page < pages-1 else None

	if results:
		dict = { 'nextPage': nextPage, 'data': list_12}     
		return Response(response=json.dumps(dict, cls=MyEncoder ,indent = 4), status=200)
	else:
		dict = {'error': True, 'message': "it is 500 ERROR~伺服器內部錯誤"}
		return Response(response=json.dumps(dict, indent = 4),status=500)

@app.route("/api/attraction/<attractionId>")
def api_attractionIDL(attractionId):
	cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
	cur.execute(f"Select * FROM tpspot WHERE id = {attractionId}")
	result = cur.fetchone()


	# ref https://qiita.com/mink0212/items/52e0ebd66bd94e1303c1
	if result:
		image_replaced = result['images'].decode('utf-8').replace("'","").replace("[","").replace("]","").replace(" ","")
		image_splited = image_replaced.split(",")
		result['images'] = image_splited

		dict = { 'data': result}     
		# {'id':result['_id'], 'name':result['stitle'], 'category':result['CAT2'], 'description':result['xbody'], 'address':result['address'], 'transport':result['info'],  'mrt':result['MRT'], 'latitude':result['latitude'], 'longitude':result['longitude'], 'images':result['file']}
		return Response(response=json.dumps(dict, cls=MyEncoder ,indent = 4), status=200)

	elif not result:
		dict = {'error': True, 'message': "it is 400 ERROR~景點編號不正確"}
		return Response(response=json.dumps(dict, indent = 4), status=400)

	else:
		dict = {'error': True, 'message': "it is 500 ERROR~伺服器內部錯誤"}
		return Response(response=json.dumps(dict, indent = 4),status=500)


#API 使用者
@app.route("/api/user", methods=["GET", "POST","PATCH","DELETE"])
def api_user():
	cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
	# cur.execute("DROP TABLE IF EXISTS membership")
	cur.execute("CREATE TABLE IF NOT EXISTS membership  (id bigint NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, email varchar(50) NOT NULL, password varchar(20) NOT NULL, PRIMARY KEY(id))")
	mysql_command_register = "INSERT INTO membership (name, email, password) VALUES (%s, %s, %s)"


	if request.method == "GET":
		print(session)
		email = session.get('email')
		cur.execute("SELECT * FROM membership WHERE email = %s", [email])
		result = cur.fetchone()

		if result :
			id = result['id']
			name = result['name']
			dict = { "data": {"id": id, "name": name, "email": email}}
			print(dict)
			return Response(response=json.dumps(dict, cls=MyEncoder ,indent = 4), status=200)
		else:
			dict = { "error": True, "message": "不明異常" }
			return Response(response=json.dumps(dict, cls=MyEncoder ,indent = 4), status=500)

	elif request.method == "POST":
		name = request.get_json()['name']
		email = request.get_json()['email']
		password = request.get_json()['password']
		cur.execute("SELECT * from membership WHERE email = %s",[email])
		result = cur.fetchone()

		if not result:
			val = (name, email, password)
			cur.execute(mysql_command_register, val)
			mysql.connection.commit()
			dict = { "ok": True }
			print(dict)
			return Response(response=json.dumps(dict, cls=MyEncoder ,indent = 4), status=200)
		elif result:
			dict = { "error": True, "message": "該Email已被註冊" }
			print(dict)
			return Response(response=json.dumps(dict, cls=MyEncoder ,indent = 4), status=400)
		else:
			dict = {'error': True, 'message': "it is 500 ERROR~伺服器內部錯誤"}
			print(dict)
			return Response(response=json.dumps(dict, indent = 4),status=500)

	elif request.method == "PATCH":
		email = request.get_json()['email']
		password = request.get_json()['password']
		cur.execute("SELECT * FROM membership WHERE email = %s and password = %s", (email,password))
		result = cur.fetchone()

		if result:
			dict = {"ok": True}
			session['email'] = email
			session['password'] = password
			session['user_id'] = result['id']
			session['name'] = result['name']
			print(dict)
			redirect(url_for('index'))
			return Response(response=json.dumps(dict, cls=MyEncoder ,indent = 4), status=200)
		elif not result:
			# cur.execute("SELECT * FROM membership WHERE email = %s",email)
			# result_email = cur.fetchone()
			# if result_email:
			# 	dict = {"error": True,"message": "Email已被註冊"}
			# else:
			dict = {"error": True,"message": "Email或密碼錯誤"}
			print(dict)
			return Response(response=json.dumps(dict, cls=MyEncoder ,indent = 4), status=400)
		else:
			dict = {'error': True, 'message': "it is 500 ERROR~伺服器內部錯誤"}
			print(dict)
			return Response(response=json.dumps(dict, indent = 4),status=500)

	elif request.method == "DELETE":
		session.clear()
		print(session)
		dict = {"ok": True}
		redirect(url_for('index'))
		return Response(response=json.dumps(dict, cls=MyEncoder ,indent = 4), status=200)

#API 預定行程
@app.route("/api/booking", methods= ["GET", "POST", "DELETE"])
def api_booking():
	cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
	# cur.execute('DROP TABLE booking_data IF EXISTS')
	cur.execute('CREATE TABLE IF NOT EXISTS booking_data (booking_id bigint NOT NULL AUTO_INCREMENT, user_id bigint NOT NULL, email varchar(50) NOT NULL, attractionId bigint NOT NULL, date varchar(50) NOT NULL , time varchar(50) NOT NULL , price INTEGER NOT NULL, PRIMARY KEY(booking_id))')

	if request.method == "GET":
		email = session.get('email')
		if email:
			get_booking_data_sqlcommand = 'SELECT * FROM booking_data WHERE email = %s'
			cur.execute(get_booking_data_sqlcommand,[email])
			result_booking = cur.fetchone()
			spot_id = result_booking['attractionId']
			date = result_booking['date']
			time = result_booking['time']
			price = result_booking['price']

			get_spot_data_sqlcommand = f'SELECT * FROM tpspot WHERE id = {spot_id}'
			cur.execute(get_spot_data_sqlcommand)
			result_spot = cur.fetchone()
			name = result_spot['name']
			address = result_spot['address']


			image_replaced = result_spot['images'].decode('utf-8').replace("'","").replace("[","").replace("]","").replace(" ","")
			image_splited = image_replaced.split(",")
			result_spot['images'] = image_splited

			image = result_spot['images'][0]

			dict = { "data": { "attraction":{ "id": spot_id, "name": name, "address": address, "image": image}, "date": date, "time": time, "price": price }}
			print(dict)
			return Response(response=json.dumps(dict, cls=MyEncoder ,indent = 4), status=200)
		else:
			dict = {"error": True, "message": "未登入系統，拒絕存取"}
			print(dict)
			return Response(response=json.dumps(dict, cls=MyEncoder ,indent = 4), status=403)
		


	elif request.method == "POST":
		attractionId = request.get_json()['attractionId']
		date = request.get_json()['date']
		time = request.get_json()['time']
		price = request.get_json()['price']
		user_id = session.get('user_id')
		email = session.get('email')
		

		delete_booking_sqlcommand = 'DELETE FROM booking_data WHERE email = %s'
		add_booking_sqlcommand = 'INSERT INTO booking_data (user_id, email, attractionId, date, time, price) VALUES (%s, %s, %s, %s, %s, %s)'
		val = (user_id, email, attractionId, date, time, price)
		
		cur.execute(delete_booking_sqlcommand, [email])
		mysql.connection.commit()
		cur.execute(add_booking_sqlcommand,val)
		mysql.connection.commit()


		if attractionId and date and time and price and user_id and email:
			dict = {"ok": True}
			print(dict)
			return Response(response=json.dumps(dict, cls=MyEncoder ,indent = 4), status=200)

		elif not(attractionId and date and time and price and user_id and email):
			dict = {"error": True, "message": "建立失敗，輸入不正確或其他原因"}
			print(dict)
			return Response(response=json.dumps(dict, cls=MyEncoder ,indent = 4), status=400)

		elif not(user_id and email):
			dict = {"error": True, "message": "未登入系統，拒絕存取"}
			print(dict)
			return Response(response=json.dumps(dict, cls=MyEncoder ,indent = 4), status=403)
		
		else:
			dict = {"error": True, "message": "伺服器內部錯誤"}
			print(dict)
			return Response(response=json.dumps(dict, cls=MyEncoder ,indent = 4), status=500)

	elif request.method == "DELETE":
		email = session.get('email')
		print(email)
		delete_booking_sqlcommand = 'DELETE FROM booking_data WHERE email = %s'
		cur.execute(delete_booking_sqlcommand, [email])
		mysql.connection.commit()

		if email:
			dict = {"ok": True}
			print(dict)
			return Response(response=json.dumps(dict, cls=MyEncoder ,indent = 4), status=200)

		elif not email:
			dict = { "error": True,"message": "未登入系統，拒絕存取"}
			print(dict)
			return Response(response=json.dumps(dict, cls=MyEncoder ,indent = 4), status=403)



#啟動網站
if __name__ == "__main__":
	if platform.system().lower() == "linux":
		print("SYSTEM is " + platform.system().lower())
		app.run(host='0.0.0.0', port=3000)		

	elif platform.system().lower() == "windows":
		print("SYSTEM is " + platform.system().lower())
		app.run(port=3000, debug = True)	



