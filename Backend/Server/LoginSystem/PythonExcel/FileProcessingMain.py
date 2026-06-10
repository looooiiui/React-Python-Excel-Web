#===========================================#
#       现在全部使用 MYSQL 数据库
#===========================================#
import pymysql
from typing import Optional
import sys
from CONST import CONSTPARAM

#=================验证系统================
from ExcelProcessing import verify_account_data

#============= MySQL 配置 ==================#
DB_CONFIG = {
    "host": "localhost",
    "user": "root",          
    "password": "!Qq3303220151",    # 你自己的MySQL密码
    "database": "my_project",# 你刚才建的库
    "charset": "utf8mb4"
}

#=============固定命令======================#
web_login:              str = "0"
web_register:           str = "1"
web_admin_login:        str = "2"
web_ban:                str = "3"
web_password_change:    str = "4"

#=============参数索引======================#
default_order_index:            int = 2
default_excel_path_index:       int = 1
default_order_name_index:       int = 3
default_order_pwd_index:        int = 4
default_godot_argv_len:         int = 5
default_no_password_argv:       int = 4


'''规定登录系统向前端的传参:

登录:
返回值说明:
- 元组第1位:是否校验通过(True=通过,False=不通过)
- 元组第2位:状态码
    - 0 : 账号验证通过
    - 1 : 账户信息不存在
    - 2 : 账号信息验证错误（信息不全/密码错误）

注册:
账户注册处理
返回-1: 程序运行出错
返回0 : 注册成功
返回1 : 账户注册出现问题(非法字符/账户密码问题)
返回2 : 账户已被注册

后端返回标准:
{
    "code":
    "message":
    "data":
}
'''
#======================================================================
# 连接 MySQL
#======================================================================
def get_db_connection():
    try:
        conn = pymysql.connect(**DB_CONFIG)
        cursor = conn.cursor()
        return conn, cursor
    except:
        return None, None

#======================================================================
# 登录验证
#======================================================================
def login_verify(input_login_info: Optional[list[str]]) -> None:
    if not input_login_info:
        print("-1")
        return

    account_id = input_login_info[0]
    password = input_login_info[1]

    conn, cursor = get_db_connection()
    if not conn:
        print("-1")
        return

    try:
        sql = "SELECT PASSWORD, ADMIN FROM user WHERE ACCOUNTID = %s"
        cursor.execute(sql, (account_id,))
        user = cursor.fetchone()

        if not user:
            print("1")
        elif user[0] == password:
            if user[1] == "1":
                print("3")
            else:
                print("0")
        else:
            print("2")
    except:
        print("-1")
    finally:
        cursor.close()
        conn.close()

#======================================================================
# 管理员登录验证
#======================================================================
def admin_login_verify(input_login_info: Optional[list[str]]) -> None:
    if not input_login_info:
        print("-1")
        return

    account_id = input_login_info[0]
    password = input_login_info[1]

    conn, cursor = get_db_connection()
    if not conn:
        print("-1")
        return

    try:
        sql = "SELECT PASSWORD, ADMIN FROM user WHERE ACCOUNTID = %s"
        cursor.execute(sql, (account_id,))
        user = cursor.fetchone()

        if not user:
            print("1")
        elif user[0] == password and user[1] == "1":
            print("0")
        else:
            if user[1] != "1":
                print("4")
            else:
                print("2")
    except:
        print("-1")
    finally:
        cursor.close()
        conn.close()

#======================================================================
# 封禁账户（修复版：切换状态：0 ↔ 1）
#======================================================================
def admin_ban_operator(accountId: Optional[str]) -> None:
    if not accountId:
        print("-1")
        return

    conn, cursor = get_db_connection()
    if not conn:
        print("-1")
        return

    try:
        # 1. 先查询 PERMISSION 状态
        sql_select = "SELECT PERMISSION FROM user WHERE ACCOUNTID = %s"
        cursor.execute(sql_select, (accountId,))
        result = cursor.fetchone()

        # 用户不存在
        if not result:
            print("-1")
            return

        # 2. 取当前状态，取反
        current_state = result[0]
        new_state = 1 if current_state == 0 else 0

        # 3. 更新到数据库
        sql_update = "UPDATE user SET PERMISSION = %s WHERE ACCOUNTID = %s"
        cursor.execute(sql_update, (new_state, accountId))
        conn.commit()

        print("0")  # 成功

    except Exception as e:
        print("-1")
    finally:
        cursor.close()
        conn.close()

#======================================================================
# 修改信息（密码、名字等）
#======================================================================
def change_info_any(account_id: Optional[str], change_info: Optional[str], param: int) -> None:
    if not account_id or not change_info:
        print("-1")
        return

    conn, cursor = get_db_connection()
    if not conn:
        print("-1")
        return

    try:
        if param == CONSTPARAM.DEFAULT_PASSWORD_INDEX:
            sql = "UPDATE user SET PASSWORD = %s WHERE ACCOUNTID = %s"
        elif param == 3:
            sql = "UPDATE user SET NAME = %s WHERE ACCOUNTID = %s"
        else:
            print("-1")
            return

        cursor.execute(sql, (change_info, account_id))
        conn.commit()
        print("0")
    except:
        print("-1")
    finally:
        cursor.close()
        conn.close()

#======================================================================
# 注册账号
#======================================================================
def register_verify(input_register_info: Optional[list[str]]) -> None:
    if not input_register_info:
        print("-1")
        return

    account_id = input_register_info[0]
    password = input_register_info[1]
    name = input_register_info[4]

    conn, cursor = get_db_connection()
    if not conn:
        print("-1")
        return

    try:

        sql_check = "SELECT ACCOUNTID FROM user WHERE ACCOUNTID = %s"
        cursor.execute(sql_check, (account_id,))
        if cursor.fetchone():
            print("2")
            return
        
        # 校验账户
        verify_reslut = verify_account_data([account_id, password])
        if (not verify_reslut[0]):
            print("1")
            return
        

        sql_insert = """
            INSERT INTO user (ACCOUNTID, PASSWORD, ADMIN, PERMISSION, NAME)
            VALUES (%s, %s, 0, 0, %s)
        """
        cursor.execute(sql_insert, (account_id, password, name))
        conn.commit()
        print("0")
    except:
        print("-1")
    finally:
        cursor.close()
        conn.close()

#======================================================================
# 主入口
#======================================================================
if __name__ == "__main__":
    if len(sys.argv) >= default_godot_argv_len:
        receive_params = sys.argv
        web_order = receive_params[default_order_index]
        input_name = receive_params[default_order_name_index]
        input_pwd = receive_params[default_order_pwd_index]
        input_info = [input_name, input_pwd]

        if web_order == web_login:
            login_verify(input_info)
        if web_order == web_register:
            register_info = [input_name, input_pwd, "0", "0", input_name]
            register_verify(register_info)
        if web_order == web_admin_login:
            admin_login_verify(input_info)
        if web_order == web_password_change:
            change_info_any(input_name, input_pwd, CONSTPARAM.DEFAULT_PASSWORD_INDEX)
        sys.exit()

    if len(sys.argv) >= default_no_password_argv:
        receive_params = sys.argv
        web_order = receive_params[default_order_index]
        input_name = receive_params[default_order_name_index]

        if web_order == web_ban:
            admin_ban_operator(input_name)
        sys.exit()

    print("-2")
