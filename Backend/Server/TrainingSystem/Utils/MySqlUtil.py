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
    "database": "train_manage",  # 库名
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

