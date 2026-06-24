#=======三方库===========
from flask import Flask, jsonify, Response
from flask_cors import CORS
import pymysql
import json
#==========自定义工具类===========
from Utils.DebugTool.DebugUtil import DebugTool
from Utils import MySqlUtil

# 数据库连接统一调用 MySqlUtil.get_db_connection()
# 日志统一使用 DebugTool.debug_log("日志内容")

#====================================================================
# 第二部分：tb_course 课程表 增删改查
#====================================================================
# 1. 获取全部课程
def get_all_course():
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return {}
    
    try:
        sql = "SELECT * FROM tb_course ORDER BY create_time DESC"
        cursor.execute(sql)
        rows = cursor.fetchall()
        data = {row["id"]: row for row in rows}
        return data
    except Exception as e:
        DebugTool.debug_log(f"获取全部课程失败: {e}")
        return {}
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 2. 根据课程ID查询单条课程
def get_course_by_id(course_id):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return None
    
    try:
        sql = "SELECT * FROM tb_course WHERE id=%s"
        cursor.execute(sql, (course_id,))
        row = cursor.fetchone()
        return row
    except Exception as e:
        DebugTool.debug_log(f"查询课程详情失败: {e}")
        return None
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 3. 新增课程
def add_course(course_name, course_type, class_hour, course_desc, course_file):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return False, "-1"
    
    try:
        sql = """
        INSERT INTO tb_course(course_name, course_type, class_hour, course_desc, course_file)
        VALUES (%s, %s, %s, %s, %s)
        """
        params = (course_name, course_type, class_hour, course_desc, course_file)
        cursor.execute(sql, params)
        conn.commit()
        new_id = cursor.lastrowid
        return True, "0"
    except Exception as e:
        conn.rollback()
        DebugTool.debug_log(f"新增课程失败: {e}")
        return False, "-1"
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 4. 更新课程
def update_course(course_id, course_name, course_type, class_hour, course_desc, course_file, status):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return False, "-1"
    
    try:
        check_sql = "SELECT 1 FROM tb_course WHERE id=%s"
        cursor.execute(check_sql, (course_id,))
        if not cursor.fetchone():
            return False, "2" # 课程不存在
        
        sql = """
        UPDATE tb_course
        SET course_name=%s, course_type=%s, class_hour=%s, course_desc=%s, course_file=%s, status=%s, update_time=CURRENT_TIMESTAMP
        WHERE id=%s
        """
        params = (course_name, course_type, class_hour, course_desc, course_file, status, course_id)
        cursor.execute(sql, params)
        conn.commit()
        return True, "0"
    except Exception as e:
        conn.rollback()
        DebugTool.debug_log(f"更新课程失败: {e}")
        return False, "-1"
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 5. 删除课程
def delete_course(course_id):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        DebugTool.debug_log("数据库连接失败")
        return False
    
    try:
        check_sql = "SELECT 1 FROM tb_course WHERE id=%s"
        cursor.execute(check_sql, (course_id,))
        if not cursor.fetchone():
            DebugTool.debug_log("未找到对应课程记录，无需删除")
            return False
        
        sql = "DELETE FROM tb_course WHERE id=%s"
        cursor.execute(sql, (course_id,))
        conn.commit()
        DebugTool.debug_log("课程删除成功")
        return True
    except Exception as e:
        conn.rollback()
        DebugTool.debug_log(f"删除课程失败: {e}")
        return False
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()