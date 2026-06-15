#=======三方库===========
from flask import Flask, jsonify, Response
from flask_cors import CORS
import pymysql
import json
#==========自定义工具类===========
from Utils.DebugTool.DebugUtil import DebugTool
from Utils import MySqlUtil

#====================================================================
# 第三部分：tb_train_class 培训班次表 增删改查
#====================================================================
# 1. 获取所有班次
def get_all_train_class():
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return {}
    
    try:
        sql = "SELECT * FROM tb_train_class ORDER BY create_time DESC"
        cursor.execute(sql)
        rows = cursor.fetchall()
        data = {row["id"]: row for row in rows}
        return data
    except Exception as e:
        DebugTool.debug_log(f"获取全部班次失败: {e}")
        return {}
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 2. 根据班次ID查询单条班次
def get_train_class_by_id(class_id):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return None
    
    try:
        sql = "SELECT * FROM tb_train_class WHERE id=%s"
        cursor.execute(sql, (class_id,))
        row = cursor.fetchone()
        return row
    except Exception as e:
        DebugTool.debug_log(f"查询班次详情失败: {e}")
        return None
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 3. 新增培训班次
def add_train_class(class_name, course_id, train_type, start_time, end_time, address, manager_id, remark):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return False, "-1"
    
    try:
        sql = """
        INSERT INTO tb_train_class(class_name, course_id, train_type, start_time, end_time, address, manager_id, remark)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        params = (class_name, course_id, train_type, start_time, end_time, address, manager_id, remark)
        cursor.execute(sql, params)
        conn.commit()
        new_id = cursor.lastrowid
        return True, "0"
    except Exception as e:
        conn.rollback()
        DebugTool.debug_log(f"新增班次失败: {e}")
        return False, "-1"
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 4. 更新班次信息
def update_train_class(class_id, class_name, course_id, train_type, start_time, end_time, address, manager_id, remark, status):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return False, "-1"
    
    try:
        check_sql = "SELECT 1 FROM tb_train_class WHERE id=%s"
        cursor.execute(check_sql, (class_id,))
        if not cursor.fetchone():
            return False, "2" # 班次不存在
        
        sql = """
        UPDATE tb_train_class
        SET class_name=%s, course_id=%s, train_type=%s, start_time=%s, end_time=%s, address=%s, manager_id=%s, remark=%s, status=%s, update_time=CURRENT_TIMESTAMP
        WHERE id=%s
        """
        params = (class_name, course_id, train_type, start_time, end_time, address, manager_id, remark, status, class_id)
        cursor.execute(sql, params)
        conn.commit()
        return True, "0"
    except Exception as e:
        conn.rollback()
        DebugTool.debug_log(f"更新班次失败: {e}")
        return False, "-1"
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 5. 删除班次
def delete_train_class(class_id):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        DebugTool.debug_log("数据库连接失败")
        return False
    
    try:
        check_sql = "SELECT 1 FROM tb_train_class WHERE id=%s"
        cursor.execute(check_sql, (class_id,))
        if not cursor.fetchone():
            DebugTool.debug_log("未找到对应班次记录，无需删除")
            return False
        
        sql = "DELETE FROM tb_train_class WHERE id=%s"
        cursor.execute(sql, (class_id,))
        conn.commit()
        DebugTool.debug_log("班次删除成功")
        return True
    except Exception as e:
        conn.rollback()
        DebugTool.debug_log(f"删除班次失败: {e}")
        return False
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()