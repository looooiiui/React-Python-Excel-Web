#=======三方库===========
from flask import Flask, jsonify, Response
from flask_cors import CORS
import pymysql
import json
#==========自定义工具类===========
from Utils.DebugTool.DebugUtil import DebugTool
from Utils import MySqlUtil

#====================================================================
# 第一部分：tb_user 参训人员表 增删改查
#====================================================================
# 1. 获取所有用户（列表）
def get_all_user():
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return {}
    
    try:
        sql = "SELECT * FROM tb_user ORDER BY create_time DESC"
        cursor.execute(sql)
        rows = cursor.fetchall()
        data = {row["id"]: row for row in rows}
        return data
    
    except Exception as e:
        DebugTool.debug_log(f"获取所有用户失败: {e}")
        return {}
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 2. 根据ID获取单个用户详情
def get_user_by_id(user_id):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return None
    
    try:
        sql = "SELECT * FROM tb_user WHERE id=%s"
        cursor.execute(sql, (user_id,))
        row = cursor.fetchone()
        return row
    except Exception as e:
        DebugTool.debug_log(f"获取用户详情失败: {e}")
        return None
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 3. 新增用户
def add_user(username, real_name, gender, dept, phone, email, role):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return False, "-1"
    
    try:
        sql = """
        INSERT INTO tb_user(username, real_name, gender, dept, phone, email, role)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        params = (username, real_name, gender, dept, phone, email, role)
        cursor.execute(sql, params)
        conn.commit()
        new_id = cursor.lastrowid
        return True, str(new_id)
    except Exception as e:
        conn.rollback()
        DebugTool.debug_log(f"新增用户失败: {e}")
        return False, "-1"
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 4. 更新用户信息
def update_user(user_id, real_name, gender, dept, phone, email, role, status):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return False, "-1"
    
    try:
        check_sql = "SELECT 1 FROM tb_user WHERE id=%s"
        cursor.execute(check_sql, (user_id,))
        if not cursor.fetchone():
            return False, "2" # 2=用户不存在
        
        sql = """
        UPDATE tb_user
        SET real_name=%s, gender=%s, dept=%s, phone=%s, email=%s, role=%s, status=%s, update_time=CURRENT_TIMESTAMP
        WHERE id=%s
        """
        params = (real_name, gender, dept, phone, email, role, status, user_id)
        cursor.execute(sql, params)
        conn.commit()
        return True, "0"
    except Exception as e:
        conn.rollback()
        DebugTool.debug_log(f"更新用户失败: {e}")
        return False, "-1"
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 5. 删除用户
def delete_user(user_id):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        DebugTool.debug_log("数据库连接失败")
        return False
    
    try:
        check_sql = "SELECT 1 FROM tb_user WHERE id=%s"
        cursor.execute(check_sql, (user_id,))
        if not cursor.fetchone():
            DebugTool.debug_log("未找到对应用户记录，无需删除")
            return False
        
        sql = "DELETE FROM tb_user WHERE id=%s"
        cursor.execute(sql, (user_id,))
        conn.commit()
        DebugTool.debug_log("用户删除成功")
        return True
    except Exception as e:
        conn.rollback()
        DebugTool.debug_log(f"删除用户失败: {e}")
        return False
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()