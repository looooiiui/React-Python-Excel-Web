# Web后端工具，系统工具
#=======三方库===========
from flask import Flask, jsonify, Response
from flask_cors import CORS
import pymysql
#==========自定义工具类===========
from Utils.DebugTool.DebugUtil import DebugTool

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
    
    # 出错返回空
    except Exception as e:
        return {}

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

# 获得个人项目
def get_specific_person_projection(account_id):
    conn, cursor = get_db_connection()
    if not conn:
        return {}
    
    data = {}
    try:
        # 获得所有项目数据
        sql = "SELECT * FROM user_project WHERE account_id=%s"
        cursor.execute(sql, (account_id,))
        rows = cursor.fetchall()

        # 将数据格式化为标准 id 对 信息 字典
        data = {row["project_id"]: row for row in rows}

        return data

    # 出错返回空
    except Exception as e:
        return {}

    finally:
        # 先关游标，再关连接
        if cursor:
            cursor.close()
        if conn:
            conn.close()

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

# 校验是否已经加入项目
def verify_projection_join(account_id, project_id):
    try:
        conn, cursor = get_db_connection()
        if not conn:
            return False
        
        # 检查重复加入
        check_sql = "SELECT 1 FROM user_project WHERE account_id=%s AND project_id=%s"
        cursor.execute(check_sql, (account_id, project_id))
        if cursor.fetchone():
            return True
        
        # 没有检查到已经加入的信息
        return False

    except Exception as e:
        conn.rollback() # 出错回滚
        return False
    
    finally:
        # 先关游标，再关连接
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 退出当前加入的项目
def delete_join_project(account_id, project_id):
    try:
        conn, cursor = get_db_connection()
        if not conn:
            DebugTool.debug_log("数据库连接失败")
            return False

        # 检查是否存在该记录
        DebugTool.debug_log(f"项目后端: 退出项目: 接收ID: {account_id} 接收项目: {project_id}")
        check_sql = "SELECT 1 FROM user_project WHERE account_id=%s AND project_id=%s"
        cursor.execute(check_sql, (account_id, project_id))
        if not cursor.fetchone():
            DebugTool.debug_log("未找到对应项目记录，无需删除")
            return False

        # 执行删除
        sql = "DELETE FROM user_project WHERE account_id=%s AND project_id=%s"
        cursor.execute(sql, (account_id, project_id))
        conn.commit()
        DebugTool.debug_log("项目退出成功")
        return True

    except Exception as e:
        if conn:
            conn.rollback()
        DebugTool.debug_log(f"删除项目异常：{str(e)}")
        return False

    finally:
        # 统一释放资源
        if cursor:
            cursor.close()
        if conn:
            conn.close() 

# 删除项目
def delete_project(project_id):
    conn, cursor = get_db_connection()
    if not conn:
        print("数据库连接失败")
        return False
    
    # 关闭自动提交，开启手动事务
    conn.autocommit = False

    try:
        # 检查是否存在该项目
        DebugTool.debug_log(f"项目后端: 删除项目: 接收项目: {project_id}")
        check_sql = "SELECT 1 FROM project WHERE id=%s"
        cursor.execute(check_sql, (project_id,))
        if not cursor.fetchone():
            print("未找到对应项目记录，无需删除")
            return False

        # 执行删除(关联键)
        delete_link_project(project_id=project_id, conn=conn, cursor=cursor)

        # 主表数据删除
        sql = "DELETE FROM project WHERE id=%s"
        cursor.execute(sql, (project_id,))

        # 提交主表项目删除
        conn.commit()
        DebugTool.debug_log("项目及关联数据删除成功")
        return True

    except Exception as e:
        if conn:
            conn.rollback()
        DebugTool.debug_log(f"删除项目异常：{str(e)}")
        return False

    finally:

        # 恢复自动提交，避免影响其他接口
        conn.autocommit = True

        # 统一释放资源
        if cursor:
            cursor.close()
        if conn:
            conn.close() 

# 删除项目相关联函数
def delete_link_project(project_id, conn, cursor):
    try:
        # 检查是否存在该记录
        DebugTool.debug_log(f"项目后端: 删除关联项目: {project_id}")
        # 检查关联数据存在
        check_sql = "SELECT 1 FROM user_project WHERE project_id=%s"
        cursor.execute(check_sql, (project_id,))
        if not cursor.fetchone():
            DebugTool.debug_log("未找到对应关联项目记录，无需删除")
            return

        # 执行删除
        sql = "DELETE FROM user_project WHERE project_id=%s"
        cursor.execute(sql, (project_id,))
        DebugTool.debug_log("执行项目关联删除SQL成功")
    
    except Exception as e:
        DebugTool.debug_log("删除关联项目内层异常: 向上抛出")
        raise