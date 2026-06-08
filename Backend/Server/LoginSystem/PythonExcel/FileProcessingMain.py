#=================openpyxl库================#
#       本文用来处理Excel的python的库       #
#===========================================#
from openpyxl.worksheet.worksheet import Worksheet

# 以下为子Python脚本引入的处理函数(这里简要解释)
from ExcelProcessing import read_from_excel             # 返回指定的Excel工作表
from ExcelProcessing import write_new_account           # 向Excel写入新账号信息,返回 tuple[bool, int] 元组
from ExcelProcessing import change_ban_state            # 封禁账户
from ExcelProcessing import change_personal_info        # 修改个人信息
from JsonProcessing import convert_excel_to_account     # 将Excel中读取的数据转化为固定字典格式 {"ID": [password, name]}
from JsonProcessing import detect_login_information     # 校验登录信息，返回 tuple[bool, int] 元组
# 引入常量工具
from CONST import CONSTPARAM
# Optional 为类型注解标记，可以用于规定函数传参传限定类型内的参数如 Optional[int | str] 指参数可以传入 int，str，None类型的  
from typing import Optional
# 这个是Python用来接收系统传参的类，其中 sys.argv 为收到的参数
import sys
import os
#=============默认存档名============#
default_save_exc_name       = "AccountInfomation.xlsx"  # 手动调用脚本时的Excel路径
default_exc_data_player     = "PlayerData"              # 默认取打开Excel中的工作表的名字为 PlayerData
default_json_out            = "PlayerGameData.json"     # 存档转化出的Json位置
#=============默认存档名============#

#=============指定参数==============#         # 这里所有的位置都是Godot中传来参数中对应参数的索引
# 五参数
default_order_index:            int = 2       # 这里是默认从godot获得的参数中取第2位为指令参数
default_excel_path_index:       int = 1       # 默认Excel位置
default_order_name_index:       int = 3       # 默认名字位置
default_order_pwd_index:        int = 4       # 默认密码位置
default_godot_argv_len:         int = 5       # 默认传参长度
# 四参数
default_no_password_argv:       int = 4       # 无密码参数
#=============指定参数==============#

#=============指定命令==============#
web_login:              str = "0"                 # 指定web登录命令为 "0"
web_register:           str = "1"                 # 指定web注册命令为 "1"
web_admin_login:        str = "2"                 # 指定管理员信息验证为 "2"
web_ban:                str = "3"                 # 指定封禁命令为 "3"
web_password_change:    str = "4"                 # 指定修改密码参数为 "4"
#=============指定命令==============#

"""
以下所有函数面向Godot返回
此时Python中print的内容就是Godot接收到的返回值+-
全部使用print
"""

"""
返回值说明:
- 元组第1位:是否校验通过(True=通过,False=不通过)
- 元组第2位:状态码
    - 0 : 账号验证通过
    - 1 : 账户信息不存在
    - 2 : 账号信息验证错误（信息不全/密码错误）
"""

# 登录验证器
def login_verify(input_login_info: Optional[list[str]]) -> None:
    if input_login_info is None:
        return None
    
    try:
        # 得到账户表格
        read_sheet = read_from_excel(default_save_exc_name, default_exc_data_player)
        stored_info_dict = convert_excel_to_account(read_sheet)
        # 验证登录信息
        verify_result: tuple =  detect_login_information(stored_info_dict, input_login_info, "0")
        # 通过验证
        print(str(verify_result[1]))
    except Exception as e:
        # 登录程序运行失败
        print("-1")

# 管理员验证器
def admin_login_verify(input_login_info: Optional[list[str]]) -> None:
    if input_login_info is None:
        return None
    
    try:
        # 得到账户表格
        read_sheet = read_from_excel(default_save_exc_name, default_exc_data_player)
        stored_info_dict = convert_excel_to_account(read_sheet)
        # 验证登录信息
        verify_result: tuple =  detect_login_information(stored_info_dict, input_login_info, "1")
        # 通过验证
        print(str(verify_result[1]))
    except Exception as e:
        # 登录程序运行失败
        print("-1")

# 封禁操作器
def admin_ban_operator(accountId: Optional[str]) -> None:
    if accountId is None:
        return None
    
    # 更改账户封禁状态
    try:

        # 更改封禁信息
        ban_result: tuple = change_ban_state(
            default_exc_data_player, 
            default_save_exc_name, 
            accountId
        )

        # 修改结果
        print(str(ban_result[1]))

    except Exception as e:
        # 封禁程序运行失败
        print("-1")

# 修改任意参数操作器
def change_info_any(account_id: Optional[str], change_info: Optional[str], param: int) -> None:
    if account_id is None or change_info is None:
        return None

    # 更改账户个人信息
    try:
        # 更改个人信息
        ban_result: tuple = change_personal_info(
            default_exc_data_player, 
            default_save_exc_name, 
            account_id,
            change_info,
            param
        )

        # 修改结果
        print(str(ban_result[1]))

    except Exception as e:
        # 封禁程序运行失败
        print("-1")

"""
账户注册处理
返回-1: 程序运行出错
返回0 : 注册成功
返回1 : 账户注册出现问题(非法字符/账户密码问题)
返回2 : 账户已被注册
"""
# 注册验证器
def register_verify(input_register_info: Optional[list[str]]) -> None:
    if input_register_info is None:
        return None
    
    try:
        # 验证注册信息并写入
        verify_result: tuple = write_new_account(
            default_exc_data_player, 
            default_save_exc_name, 
            input_register_info
        )
        print(str(verify_result[1]))

    except Exception as e:
        # 注册程序运行失败
        print("-1")
    
"""
返回 -1 为程序运行出错
返回 -2 为程序输入变量不足
"""
# 主函数进入
if __name__ == "__main__":
    if len(sys.argv) >= default_godot_argv_len:
        # 将Web传参转至本地
        receive_params: list[str] = sys.argv
        web_order = receive_params[default_order_index]
        # 格式化传参内容
        default_save_exc_name   = receive_params[default_excel_path_index]      # 获得收到的Excel地址
        input_name              = receive_params[default_order_name_index]      # 获得收到的账号ID
        input_pwd               = receive_params[default_order_pwd_index]       # 获得收到的密码
        input_info: list[str] = [input_name, input_pwd]

        # 登录注册验证请求
        if web_order == web_login:
            login_verify(input_info)
        if web_order == web_register:
            register_info: list[str] = [input_name, input_pwd, "0", "0", input_name]
            register_verify(register_info)
        # 管理员登录验证
        if web_order == web_admin_login:
            admin_login_verify(input_info)
        # 修改密码操作
        if web_order == web_password_change:
            change_info_any(input_name, input_pwd, CONSTPARAM.DEFAULT_PASSWORD_INDEX)

        # 程序结束
        sys.exit()

    #====================参数没有密码(4参数状态)=============
    if len(sys.argv) >= default_no_password_argv:
        # 将Web传参转至本地
        receive_params: list[str] = sys.argv
        web_order = receive_params[default_order_index]

        # 格式化传参内容
        default_save_exc_name   = receive_params[default_excel_path_index]      # 获得收到的Excel地址
        input_name              = receive_params[default_order_name_index]      # 获得收到的账号ID

        # 封禁操作
        if web_order == web_ban:
            admin_ban_operator(input_name)

        # 程序结束
        sys.exit()

    # 参数不够传 -2
    else:
        print("-2")