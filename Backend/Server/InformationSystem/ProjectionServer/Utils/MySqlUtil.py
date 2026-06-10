# Web后端工具，系统工具
#=======三方库===========
from flask import Flask, jsonify, Response
from flask_cors import CORS
import pymysql

#==================== MySQL 配置 ===================
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "!Qq3303220151",
    "database": "my_project",# 库名
    "charset": "utf8mb4"
}
#====================================================


#==================== MySQL 工具 ====================
# 连接数据库
def get_db_connection():
    try:
        # 解包输入参数
        conn = pymysql.connect(**DB_CONFIG)
        cursor = conn.cursor(pymysql.cursors.DictCursor)  # 直接返回字典
        return conn, cursor
        
    except Exception as e:
        print(f"数据库连接失败: {e}")
        return None, None

# 获得所有项目
def get_all_projection():
    conn, cursor = get_db_connection()
    if not conn:
        return {}
    
    data = {}
    try:
        # 获得所有项目数据
        sql = "SELECT * FROM project"
        cursor.execute(sql)
        rows = cursor.fetchall()

        # 将数据格式化为标准 id 对 信息 字典
        data = {row["id"]: row for row in rows}

        return data

    finally:
        # 先关游标，再关连接
        if cursor:
            cursor.close()
        if conn:
            conn.close()

"""
is_admin
"0": 普通组员
"1": 组长
"2": 主控
"""
# 加入项目
def join_projection(account_id, project_id, is_admin):
    try:
        conn, cursor = get_db_connection()
        if not conn:
            return False, "-1"
        
        # 检查重复加入
        check_sql = "SELECT 1 FROM user_project WHERE account_id=%s AND project_id=%s"
        cursor.execute(check_sql, (account_id, project_id))
        if cursor.fetchone():
            return False, "2"
        
        # 加入项目
        sql = """
        INSERT INTO user_project(account_id, project_id, role, progress, score, submit_time)
        VALUES (%s, %s, %s, %s, %s, CURDATE())
        """
        # 按字段顺序传参：account_id, project_id, role, progress, score
        params = (account_id, project_id, is_admin, 0, 0)
        cursor.execute(sql, params)
        conn.commit()
        return True, "0"

    except Exception as e:
        conn.rollback() # 出错回滚
        return False, "-1"
    
    finally:
        # 先关游标，再关连接
        if cursor:
            cursor.close()
        if conn:
            conn.close()




    
    
    
    