# Web后端工具，系统工具
import sys
from pathlib import Path
#=======三方库===========
from flask import Flask, jsonify, Response
from flask_cors import CORS

# 项目根目录
ROOT_DIR = Path(__file__).parent
# 子模块目录 spreadsheet_processing 文件夹
SP_DIR = ROOT_DIR / "spreadsheet_processing"

# 加入目录搜索路径
sys.path.append(str(ROOT_DIR))
sys.path.append(str(SP_DIR))

# ========================Godot处代码复用====================
from FileProcessingMain import (
    load_godot_arguments,
    receive_excel,
    injection_convert_json,
    ExcelManager,
    DEFAULT_EXCEL_PATH,
    DebugTool
)

#==============基准IP==============
NACOS_SERVER: str = "26.224.10.101:8848"
DEFAULTURL: str = "26.224.10.101"
DEFAULTPORT: str = 5002
#==================================

#=================基准路由===================
DEFAULTROUTE: str = "/info/accountInfo"
DEFAULTACCOUNTSHEET: str = "PlayerData"

#==========Python后端创建===================
app = Flask(__name__)
CORS(app)

# 请求处(路由)
# 前端提供接口(这个接口是简要信息接口，端口5002)
@app.route(DEFAULTROUTE, methods=["GET"])
def get_account_info():
    try:
        # 开启Excel表格
        DebugTool.debug_log(DEFAULT_EXCEL_PATH)
        excel_manager = ExcelManager(DEFAULT_EXCEL_PATH)
        sheet = excel_manager.get_sheet(DEFAULTACCOUNTSHEET)

        # 空表检测
        if not sheet:
            return jsonify({"error": "找不到表"}), 400
        
        # 读取账户表(转化为字典形式)
        # 具体转化形式在对应脚本中说明
        from spreadsheet_processing.excel_format_convert import ExcelFormatConversion
        data = ExcelFormatConversion.convert_injection_dict(sheet)

        excel_manager.close_workbook()

        # 返回字典的 JSON 形式
        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=DEFAULTPORT, debug=True)