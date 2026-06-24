#=======三方库===========
from flask import Flask, jsonify, Response
from flask_cors import CORS
import pymysql
import json
#==========自定义工具类===========
from Utils.DebugTool.DebugUtil import DebugTool
from Utils import MySqlUtil

#====================================================================
# 第六部分：tb_exam_score 考试成绩表 增删改查
#====================================================================
# 1. 获取全部成绩记录
def get_all_exam_score():
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return {}
    
    try:
        sql = "SELECT * FROM tb_exam_score ORDER BY create_time DESC"
        cursor.execute(sql)
        rows = cursor.fetchall()
        data = {row["id"]: row for row in rows}
        return data
    except Exception as e:
        DebugTool.debug_log(f"获取全部成绩记录失败: {e}")
        return {}
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 2. 根据成绩ID查询单条成绩
def get_exam_score_by_id(score_id):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return None
    
    try:
        sql = "SELECT * FROM tb_exam_score WHERE id=%s"
        cursor.execute(sql, (score_id,))
        row = cursor.fetchone()
        return row
    except Exception as e:
        DebugTool.debug_log(f"查询成绩详情失败: {e}")
        return None
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 3. 新增成绩记录
def add_exam_score(class_id, user_id, score, is_pass, exam_time, retest_count):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return False, "-1"
    
    try:
        sql = """
        INSERT INTO tb_exam_score(class_id, user_id, score, is_pass, exam_time, retest_count)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        params = (class_id, user_id, score, is_pass, exam_time, retest_count)
        cursor.execute(sql, params)
        conn.commit()
        new_id = cursor.lastrowid
        return True, str(new_id)
    except Exception as e:
        conn.rollback()
        DebugTool.debug_log(f"新增成绩记录失败: {e}")
        return False, "-1"
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 4. 更新成绩记录
def update_exam_score(score_id, score, is_pass, exam_time, retest_count):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        return False, "-1"
    
    try:
        check_sql = "SELECT 1 FROM tb_exam_score WHERE id=%s"
        cursor.execute(check_sql, (score_id,))
        if not cursor.fetchone():
            return False, "2" # 成绩记录不存在
        
        sql = """
        UPDATE tb_exam_score
        SET score=%s, is_pass=%s, exam_time=%s, retest_count=%s
        WHERE id=%s
        """
        params = (score, is_pass, exam_time, retest_count, score_id)
        cursor.execute(sql, params)
        conn.commit()
        return True, "0"
    except Exception as e:
        conn.rollback()
        DebugTool.debug_log(f"更新成绩记录失败: {e}")
        return False, "-1"
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 5. 删除成绩记录
def delete_exam_score(score_id):
    conn, cursor = MySqlUtil.get_db_connection()
    if not conn:
        DebugTool.debug_log("数据库连接失败")
        return False
    
    try:
        check_sql = "SELECT 1 FROM tb_exam_score WHERE id=%s"
        cursor.execute(check_sql, (score_id,))
        if not cursor.fetchone():
            DebugTool.debug_log("未找到对应成绩记录，无需删除")
            return False
        
        sql = "DELETE FROM tb_exam_score WHERE id=%s"
        cursor.execute(sql, (score_id,))
        conn.commit()
        DebugTool.debug_log("成绩记录删除成功")
        return True
    except Exception as e:
        conn.rollback()
        DebugTool.debug_log(f"删除成绩记录失败: {e}")
        return False
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()