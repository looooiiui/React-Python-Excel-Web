#=======三方库===========
from flask import Flask, jsonify, Response
from flask_cors import CORS
import pymysql
import json
#==========自定义工具类===========
from Utils.DebugTool.DebugUtil import DebugTool
from Utils import MySqlUtil

#====================================================================
# 第四部分：tb_enroll 报名记录表 增删改查
#====================================================================
# 1. 获取全部报名记录
def get_all_enroll():
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return {}
    
    try:
        sql = "SELECT * FROM tb_enroll ORDER BY enroll_time DESC"
        cursor.execute(sql)
        rows = cursor.fetchall()
        data = {row["id"]: row for row in rows}
        return data
    except Exception as e:
        DebugTool.debug_log(f"获取全部报名记录失败: {e}")
        return {}
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 2. 根据报名ID查询单条报名
def get_enroll_by_id(enroll_id):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return None
    
    try:
        # 修正：按主键id查询，不是user_id
        sql = "SELECT * FROM tb_enroll WHERE id=%s"
        cursor.execute(sql, (enroll_id,))
        row = cursor.fetchone()
        DebugTool.debug_log(row)
        return row
    except Exception as e:
        DebugTool.debug_log(f"查询报名详情失败: {e}")
        return None
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 根据用户ID查询该用户所有报名记录
def get_enroll_by_user(user_id):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return {}
    try:
        sql = "SELECT * FROM tb_enroll WHERE user_id=%s"
        cursor.execute(sql, (user_id,))
        rows = cursor.fetchall()
        # 转id为key的字典，和你统一返回格式保持一致
        data = {item["id"]: item for item in rows}
        return data
    except Exception as e:
        DebugTool.debug_log(f"根据用户查询报名失败: {e}")
        return {}
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()



# 3. 新增报名
def add_enroll(class_id, user_id, audit_status, remark):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return False, "-1"
    
    try:
        sql = """
        INSERT INTO tb_enroll(class_id, user_id, audit_status, remark)
        VALUES (%s, %s, %s, %s)
        """
        params = (class_id, user_id, audit_status, remark)
        cursor.execute(sql, params)
        conn.commit()
        new_id = cursor.lastrowid
        return True, "0"
    except Exception as e:
        conn.rollback()
        DebugTool.debug_log(f"新增报名失败: {e}")
        return False, "-1"
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 4. 更新报名（审核状态、备注）
def update_enroll(enroll_id, audit_status, remark):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return False, "-1"
    
    try:
        check_sql = "SELECT 1 FROM tb_enroll WHERE id=%s"
        cursor.execute(check_sql, (enroll_id,))
        if not cursor.fetchone():
            return False, "2" # 报名记录不存在
        
        sql = """
        UPDATE tb_enroll
        SET audit_status=%s, remark=%s
        WHERE id=%s
        """
        params = (audit_status, remark, enroll_id)
        cursor.execute(sql, params)
        conn.commit()
        return True, "0"
    except Exception as e:
        conn.rollback()
        DebugTool.debug_log(f"更新报名记录失败: {e}")
        return False, "-1"
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 5. 删除报名记录
def delete_enroll(enroll_id):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        DebugTool.debug_log("数据库连接失败")
        return False
    
    try:
        check_sql = "SELECT 1 FROM tb_enroll WHERE id=%s"
        cursor.execute(check_sql, (enroll_id,))
        if not cursor.fetchone():
            DebugTool.debug_log("未找到对应报名记录，无需删除")
            return False
        
        sql = "DELETE FROM tb_enroll WHERE id=%s"
        cursor.execute(sql, (enroll_id,))
        conn.commit()
        DebugTool.debug_log("报名记录删除成功")
        return True
    except Exception as e:
        conn.rollback()
        DebugTool.debug_log(f"删除报名记录失败: {e}")
        return False
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()