# Web后端接口层 用户账号模块
from flask          import Flask, jsonify, request
from flask_cors     import CORS
#==============自定义工具引入================
from Utils.DebugTool.DebugUtil import DebugTool
from Utils import MySqlUtil

#==============基准IP==============
DEFAULTURL: str = "127.0.0.1"
DEFAULTPORT: int = 5002
#==================================

#=================基准路由===================
DEFAULTROUTE: str = "/api/info/accountInfo"

#==========Python后端创建===================
app = Flask(__name__)
CORS(app)
# 全局固定错误码
BACK_ERR_CODE = "99"
SUCCESS_CODE = "0"

# 1. 查询全部用户（原有兼容接口）
@app.route(DEFAULTROUTE, methods=["GET"])
def get_all_account():
    try:
        data = MySqlUtil.get_all_accounts()
        return jsonify({
            "success": True,
            "code": SUCCESS_CODE,
            "messsage": "查询成功",
            "data": data
        })
    except Exception as e:
        DebugTool.debug_log(f"查询所有用户异常: {e}")
        return jsonify({
            "success": False,
            "code": BACK_ERR_CODE,
            "messsage": f"查询失败:{str(e)}",
            "data": {}
        }), 500

# 2. 根据ACCOUNTID查询单用户详情
@app.route(f"{DEFAULTROUTE}/<string:accountId>", methods=["GET"])
def get_account_detail(accountId):
    try:
        data = MySqlUtil.get_account_by_id(accountId)
        if not data:
            return jsonify({
                "success": False,
                "code": BACK_ERR_CODE,
                "message": "该账号不存在",
                "data": None
            })
        return jsonify({
            "success": True,
            "code": SUCCESS_CODE,
            "message": "查询成功",
            "data": data
        })
    except Exception as e:
        DebugTool.debug_log(f"查询用户详情异常: {e}")
        return jsonify({
            "success": False,
            "code": BACK_ERR_CODE,
            "messsage": f"查询失败:{str(e)}",
            "data": None
        }), 500

# 3. 新增用户
@app.route(f"{DEFAULTROUTE}/add", methods=["POST"])
def add_account():
    try:
        req_data = request.get_json()
        # 必传字段校验
        required = ["ACCOUNTID", "PASSWORD", "NAME"]
        for field in required:
            if field not in req_data or str(req_data[field]).strip() == "":
                return jsonify({
                    "success": False,
                    "code": BACK_ERR_CODE,
                    "message": f"缺少必填参数:{field}",
                    "data": None
                })
        accountId = str(req_data["ACCOUNTID"]).strip()
        password = str(req_data["PASSWORD"]).strip()
        name = str(req_data["NAME"]).strip()
        admin = str(req_data.get("ADMIN", "0")).strip()
        permission = int(req_data.get("PERMISSION", 0))

        success, code = MySqlUtil.add_account(accountId, password, name, admin, permission)
        if success:
            return jsonify({
                "success": True,
                "code": SUCCESS_CODE,
                "message": "新增用户成功",
                "data": {"id": code}
            })
        else:
            message = "账号已存在，无法重复新增" if code == "2" else "新增失败"
            return jsonify({
                "success": False,
                "code": code,
                "message": message,
                "data": None
            })
    except Exception as e:
        DebugTool.debug_log(f"新增用户异常: {e}")
        return jsonify({
            "success": False,
            "code": BACK_ERR_CODE,
            "message": f"新增失败:{str(e)}",
            "data": None
        }), 500

# 4. 更新用户
@app.route(f"{DEFAULTROUTE}/update/<string:accountId>", methods=["POST"])
def update_account(accountId):
    try:
        req_data = request.get_json()
        success, code = MySqlUtil.update_account(
            accountId,
            password=req_data.get("PASSWORD"),
            name=req_data.get("NAME"),
            admin=req_data.get("ADMIN"),
            permission=req_data.get("PERMISSION")
        )
        if success:
            return jsonify({
                "success": True,
                "code": SUCCESS_CODE,
                "message": "用户信息更新成功",
                "data": None
            })
        else:
            message = "待编辑账号不存在" if code == "2" else "未传入任何可更新字段/更新失败"
            return jsonify({
                "success": False,
                "code": code,
                "message": message,
                "data": None
            })
    except Exception as e:
        DebugTool.debug_log(f"更新用户异常: {e}")
        return jsonify({
            "success": False,
            "code": BACK_ERR_CODE,
            "message": f"更新失败:{str(e)}",
            "data": None
        }), 500

# 5. 删除用户
@app.route(f"{DEFAULTROUTE}/delete/<string:accountId>", methods=["POST"])
def delete_account(accountId):
    try:
        success = MySqlUtil.delete_account(accountId)
        if success:
            return jsonify({
                "success": True,
                "code": SUCCESS_CODE,
                "message": "用户删除成功",
                "data": None
            })
        else:
            return jsonify({
                "success": False,
                "code": BACK_ERR_CODE,
                "message": "待删除账号不存在",
                "data": None
            })
    except Exception as e:
        DebugTool.debug_log(f"删除用户异常: {e}")
        return jsonify({
            "success": False,
            "code": BACK_ERR_CODE,
            "message": f"删除失败:{str(e)}",
            "data": None
        }), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=DEFAULTPORT, debug=True, threaded=True)