# Web后端工具，系统工具
#=======三方库===========
from flask import Flask, jsonify, Response
from flask_cors import CORS
import pymysql

#==================== MySQL 配置 ===================
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "!Qq3303220151",    # 改成你的 MySQL 密码
    "database": "my_project",# 库名
    "charset": "utf8mb4"
}
#====================================================

#==============基准IP==============
NACOS_SERVER: str = "26.224.10.101:8848"
DEFAULTURL: str = "26.224.10.101"
DEFAULTPORT: int = 5002
#==================================

#=================基准路由===================
DEFAULTROUTE: str = "/info/accountInfo"

#==========Python后端创建===================
app = Flask(__name__)
CORS(app)

#==================== MySQL 工具 ====================
def get_db_connection():
    try:
        conn = pymysql.connect(**DB_CONFIG)
        cursor = conn.cursor(pymysql.cursors.DictCursor)  # 直接返回字典
        return conn, cursor
    except Exception as e:
        print(f"数据库连接失败: {e}")
        return None, None

# 从 MySQL 读取用户数据，返回和 Excel 完全一样的字典格式
def get_account_data_from_mysql():
    conn, cursor = get_db_connection()
    if not conn:
        return {}

    try:
        sql = "SELECT ACCOUNTID, PASSWORD, NAME, ADMIN, PERMISSION FROM user"
        cursor.execute(sql)
        rows = cursor.fetchall()

        # 构造和 Excel 版本完全一样的字典结构
        data = {}
        for row in rows:
            account_id = str(row["ACCOUNTID"])
            password = row["PASSWORD"]
            name = row["NAME"]
            admin = row["ADMIN"]
            permission = row["PERMISSION"]

            data[account_id] = {
                "PASSWORD": password,
                "NAME": name,
                "ADMIN": admin,
                "PERMISSION": permission
            }

        return data

    finally:
        cursor.close()
        conn.close()

#==================== 接口 ====================
# 请求处(路由)
# 前端提供接口(这个接口是简要信息接口，端口5002)
@app.route(DEFAULTROUTE, methods=["GET"])
def get_account_info():
    try:
        # 从 MySQL 读取数据（替代 Excel）
        data = get_account_data_from_mysql()

        # 返回字典的 JSON 形式（和原来格式完全一样！）
        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=DEFAULTPORT, debug=True)