# Web后端工具，系统工具
#=======三方库===========
from flask import Flask, jsonify, Response
from flask_cors import CORS
import pymysql
import json
#==========自定义工具类===========
from Utils.DebugTool.DebugUtil import DebugTool

#==================== MySQL 配置 ===================
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "!Qq3303220151",
    "database": "my_project",  # 库名
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


# 1. 获取所有文章（列表接口）
def get_all_articles():
    conn, cursor = get_db_connection()
    if not conn:
        return {}
    
    try:
        sql = "SELECT * FROM article ORDER BY create_time DESC"
        cursor.execute(sql)
        rows = cursor.fetchall()

        # 格式化为 {id: row} 字典，和你项目风格统一
        data = {row["id"]: row for row in rows}
        return data
    
    except Exception as e:
        DebugTool.debug_log(f"获取所有文章失败: {e}")
        return {}

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# 2. 获取单篇文章详情（根据文章ID）
def get_article_by_id(article_id):
    conn, cursor = get_db_connection()
    if not conn:
        return None
    
    try:
        sql = "SELECT * FROM article WHERE id=%s"
        cursor.execute(sql, (article_id,))
        row = cursor.fetchone()
        return row  # 单条数据，直接返回字典
    
    except Exception as e:
        DebugTool.debug_log(f"获取文章详情失败: {e}")
        return None

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# 3. 发布新文章（新增接口）
def add_article(title, content, author_id):
    conn, cursor = get_db_connection()
    if not conn:
        return False, "-1"
    
    try:
        sql = """
        INSERT INTO article(title, content, author_id, views)
        VALUES (%s, %s, %s, 0)
        """
        params = (title, content, author_id)
        cursor.execute(sql, params)
        conn.commit()

        # 返回新文章的ID，方便前端跳转
        new_id = cursor.lastrowid
        return True, str(new_id)
    
    except Exception as e:
        conn.rollback()
        DebugTool.debug_log(f"发布文章失败: {e}")
        return False, "-1"

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# 4. 更新文章（编辑接口）
def update_article(article_id, title, content):
    conn, cursor = get_db_connection()
    if not conn:
        return False, "-1"
    
    try:
        # 检查文章是否存在
        check_sql = "SELECT 1 FROM article WHERE id=%s"
        cursor.execute(check_sql, (article_id,))
        if not cursor.fetchone():
            return False, "2"  # 2 表示文章不存在

        sql = """
        UPDATE article
        SET title=%s, content=%s, update_time=CURRENT_TIMESTAMP
        WHERE id=%s
        """
        params = (title, content, article_id)
        cursor.execute(sql, params)
        conn.commit()
        return True, "0"
    
    except Exception as e:
        conn.rollback()
        DebugTool.debug_log(f"更新文章失败: {e}")
        return False, "-1"

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# 5. 删除文章（删除接口）
def delete_article(article_id):
    conn, cursor = get_db_connection()
    if not conn:
        DebugTool.debug_log("数据库连接失败")
        return False
    
    try:
        # 检查文章是否存在
        check_sql = "SELECT 1 FROM article WHERE id=%s"
        cursor.execute(check_sql, (article_id,))
        if not cursor.fetchone():
            DebugTool.debug_log("未找到对应文章记录，无需删除")
            return False

        sql = "DELETE FROM article WHERE id=%s"
        cursor.execute(sql, (article_id,))
        conn.commit()
        DebugTool.debug_log("文章删除成功")
        return True
    
    except Exception as e:
        conn.rollback()
        DebugTool.debug_log(f"删除文章失败: {e}")
        return False

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# 6. 增加阅读量（查看文章时调用）
def increase_views(article_id):
    conn, cursor = get_db_connection()
    if not conn:
        return False
    
    try:
        sql = "UPDATE article SET views = views + 1 WHERE id=%s"
        cursor.execute(sql, (article_id,))
        conn.commit()
        return True
    
    except Exception as e:
        conn.rollback()
        DebugTool.debug_log(f"增加阅读量失败: {e}")
        return False

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()