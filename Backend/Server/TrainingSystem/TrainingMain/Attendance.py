#=======三方库===========
from flask import Flask, jsonify, Response
from flask_cors import CORS
import pymysql
import json
#==========自定义工具类===========
from Utils.DebugTool.DebugUtil import DebugTool
from Utils import MySqlUtil

#====================================================================
# 第五部分：tb_attendance 考勤记录表 增删改查
#====================================================================
# 1. 获取全部考勤记录
def get_all_attendance():
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return {}
    
    try:
        sql = "SELECT * FROM tb_attendance ORDER BY create_time DESC"
        cursor.execute(sql)
        rows = cursor.fetchall()
        data = {row["id"]: row for row in rows}
        return data
    except Exception as e:
        DebugTool.debug_log(f"获取全部考勤记录失败: {e}")
        return {}
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 2. 根据考勤ID查询单条考勤
def get_attendance_by_id(attendance_id):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return None
    
    try:
        sql = "SELECT * FROM tb_attendance WHERE id=%s"
        cursor.execute(sql, (attendance_id,))
        row = cursor.fetchone()
        return row
    except Exception as e:
        DebugTool.debug_log(f"查询考勤详情失败: {e}")
        return None
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 3. 新增考勤记录
def add_attendance(class_id, user_id, sign_in_time, sign_out_time, attend_status, leave_reason):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return False, "-1"
    
    try:
        sql = """
        INSERT INTO tb_attendance(class_id, user_id, sign_in_time, sign_out_time, attend_status, leave_reason)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        params = (class_id, user_id, sign_in_time, sign_out_time, attend_status, leave_reason)
        cursor.execute(sql, params)
        conn.commit()
        new_id = cursor.lastrowid
        return True, str(new_id)
    except Exception as e:
        conn.rollback()
        DebugTool.debug_log(f"新增考勤记录失败: {e}")
        return False, "-1"
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 4. 更新考勤记录
def update_attendance(attendance_id, sign_in_time, sign_out_time, attend_status, leave_reason):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return False, "-1"
    
    try:
        check_sql = "SELECT 1 FROM tb_attendance WHERE id=%s"
        cursor.execute(check_sql, (attendance_id,))
        if not cursor.fetchone():
            return False, "2" # 考勤记录不存在
        
        sql = """
        UPDATE tb_attendance
        SET sign_in_time=%s, sign_out_time=%s, attend_status=%s, leave_reason=%s
        WHERE id=%s
        """
        params = (sign_in_time, sign_out_time, attend_status, leave_reason, attendance_id)
        cursor.execute(sql, params)
        conn.commit()
        return True, "0"
    except Exception as e:
        conn.rollback()
        DebugTool.debug_log(f"更新考勤记录失败: {e}")
        return False, "-1"
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 5. 删除考勤记录
def delete_attendance(attendance_id):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        DebugTool.debug_log("数据库连接失败")
        return False
    
    try:
        check_sql = "SELECT 1 FROM tb_attendance WHERE id=%s"
        cursor.execute(check_sql, (attendance_id,))
        if not cursor.fetchone():
            DebugTool.debug_log("未找到对应考勤记录，无需删除")
            return False
        
        sql = "DELETE FROM tb_attendance WHERE id=%s"
        cursor.execute(sql, (attendance_id,))
        conn.commit()
        DebugTool.debug_log("考勤记录删除成功")
        return True
    except Exception as e:
        conn.rollback()
        DebugTool.debug_log(f"删除考勤记录失败: {e}")
        return False
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()