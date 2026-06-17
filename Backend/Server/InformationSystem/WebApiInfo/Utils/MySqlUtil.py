# Web后端Mysql工具，用户表CRUD
#=======三方库===========
import pymysql
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
        DebugTool.debug_log(f"数据库连接失败: {e}")
        return None, None


# 1. 获取全部用户（ACCOUNTID为key字典格式，兼容原有前端）
def get_all_accounts():
    conn, cursor = get_db_connection()
    if not conn:
        return {}

    try:
        sql = "SELECT id, ACCOUNTID, PASSWORD, NAME, ADMIN, PERMISSION FROM user"
        cursor.execute(sql)
        rows = cursor.fetchall()
        # 格式化为 {ACCOUNTID: row} 字典
        data = {row["ACCOUNTID"]: row for row in rows}
        return data

    except Exception as e:
        DebugTool.debug_log(f"获取所有用户失败: {e}")
        return {}

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# 2. 根据ACCOUNTID查询单用户详情
def get_account_by_id(accountId):
    conn, cursor = get_db_connection()
    if not conn:
        return None

    try:
        sql = "SELECT id, ACCOUNTID, PASSWORD, NAME, ADMIN, PERMISSION FROM user WHERE ACCOUNTID=%s"
        cursor.execute(sql, (accountId,))
        row = cursor.fetchone()
        return row  # 单条数据字典/None

    except Exception as e:
        DebugTool.debug_log(f"查询用户详情失败: {e}")
        return None

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# 3. 新增用户
def add_account(accountId, password, name, admin="0", permission=0):
    conn, cursor = get_db_connection()
    if not conn:
        return False, "-1"

    try:
        # 查重账号
        check_sql = "SELECT 1 FROM user WHERE ACCOUNTID=%s"
        cursor.execute(check_sql, (accountId,))
        if cursor.fetchone():
            return False, "2"  # 账号重复 code=2

        sql = """
        INSERT INTO user (ACCOUNTID, PASSWORD, NAME, ADMIN, PERMISSION)
        VALUES (%s, %s, %s, %s, %s)
        """
        params = (accountId, password, name, admin, permission)
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


# 4. 更新用户（动态字段更新）
def update_account(accountId, password=None, name=None, admin=None, permission=None):
    conn, cursor = get_db_connection()
    if not conn:
        return False, "-1"

    try:
        # 校验账号存在
        check_sql = "SELECT 1 FROM user WHERE ACCOUNTID=%s"
        cursor.execute(check_sql, (accountId,))
        if not cursor.fetchone():
            return False, "2"  # 账号不存在

        update_fields = []
        params = []
        if password is not None and str(password).strip() != "":
            update_fields.append("PASSWORD=%s")
            params.append(str(password).strip())
        if name is not None and str(name).strip() != "":
            update_fields.append("NAME=%s")
            params.append(str(name).strip())
        if admin is not None:
            update_fields.append("ADMIN=%s")
            params.append(str(admin).strip())
        if permission is not None:
            update_fields.append("PERMISSION=%s")
            params.append(int(permission))

        if not update_fields:
            return False, "-1"

        update_sql = f"UPDATE user SET {','.join(update_fields)} WHERE ACCOUNTID=%s"
        params.append(accountId)
        cursor.execute(update_sql, params)
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
def delete_account(accountId):
    conn, cursor = get_db_connection()
    if not conn:
        DebugTool.debug_log("数据库连接失败")
        return False

    try:
        check_sql = "SELECT 1 FROM user WHERE ACCOUNTID=%s"
        cursor.execute(check_sql, (accountId,))
        if not cursor.fetchone():
            DebugTool.debug_log("待删除账号不存在")
            return False

        sql = "DELETE FROM user WHERE ACCOUNTID=%s"
        cursor.execute(sql, (accountId,))
        conn.commit()
        DebugTool.debug_log(f"账号 {accountId} 删除成功")
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