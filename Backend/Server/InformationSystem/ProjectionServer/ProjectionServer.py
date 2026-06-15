# Web后端工具，系统工具
#=======三方库===========
from flask import Flask, jsonify, Response, request
from flask_cors import CORS
#========自定义工具=============
from Utils import MySqlUtil
from Utils.DebugTool.DebugUtil import DebugTool


#==============基准IP==============
DEFAULTURL: str = "26.224.10.101"
DEFAULTPORT: int = 5006
#==================================

#=================基准路由===================
DEFAULTROUTE: str = "/project"

#==========Python后端创建===================
app = Flask(__name__)
CORS(app)

"""
返回值说明:
后端返回标准:
{
    "code":
    "message":
    "data":
}

data:
返回 "-1": 执行失败
返回 "0": 执行成功
返回 "1": 输入数据有问题(为空或非法字符)
返回 "2": 数据已经存在(重复加入)
"""

#=================项目总信息=================
@app.route(f"{DEFAULTROUTE}/info/all", methods=["GET"])
def get_all_project_info():
    try:
        # 从 MySQL 读取数据
        data = MySqlUtil.get_all_projection()
        # 返回字典的 JSON 形式
        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 获得特定个人参与的项目
@app.route(f"{DEFAULTROUTE}/info/getSpecific", methods=["POST"])
def get_specific_person_projection():
    try:
        
        get_data = request.json
        if not get_data:
            return jsonify({"code": 400, "message": "请求参数不能为空", "data": "1"}), 400
        
        # 获得ID信息
        account_id = str(get_data["accountId"])
        
        # 从 MySQL 读取数据
        data = MySqlUtil.get_specific_person_projection(account_id)

        return jsonify(data)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500    


# 加入项目
@app.route(f"{DEFAULTROUTE}/oper/join", methods=["POST"])
def join_projection():
    try:
        # 获取加入信息
        data = request.json
        if not data:
            return jsonify({"code": 400, "message": "请求参数不能为空", "data": "1"}), 400

        # 加入项目
        account_id = str(data["accountId"])
        project_id = data["projectionId"]
        is_admin = str(data["isAdmin"])
        
        # 尝试加入项目
        result = MySqlUtil.join_projection(account_id=account_id, project_id=project_id, is_admin=is_admin)
        if result[1] == "0":
            return jsonify({"code": 200, "message": "项目加入成功", "data": "0"}), 200
        elif result[1] == "2":
            return jsonify({"code": 409, "message": "重复加入项目", "data": "2"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 传入项目账户ID和项目ID判断是否已经加入项目(单次)
@app.route(f"{DEFAULTROUTE}/oper/verify", methods=["POST"])
def verify_project_join():   
    try:
        # 获取加入信息
        data = request.json
        if not data:
            return jsonify({"code": 400, "message": "请求参数不能为空", "data": "1"}), 400

        # 加入项目
        account_id = str(data["accountId"])
        project_id = data["projectId"]

        # 校验是否加入项目
        result = MySqlUtil.verify_projection_join(account_id=account_id, project_id=project_id)
        if result:
            return jsonify({"code": 200, "message": "检测到重复", "data": "1"}), 200
        else:
            return jsonify({"code": 200, "message": "项目未重复加入", "data": "0"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 传入项目账户ID和项目ID用于退出项目 
@app.route(f"{DEFAULTROUTE}/info/delete", methods=["POST"])
def exit_project():   
    try:
        # 获取加入信息
        data = request.json
        if not data:
            return jsonify({"code": 400, "message": "请求参数不能为空", "data": "1"}), 400

        # 获得需要删除的个人项目
        account_id = str(data["accountId"])
        project_id = data["projectId"]

        # 退出项目
        result = MySqlUtil.delete_join_project(account_id=account_id, project_id=project_id)
        if result:
            return jsonify({"code": 200, "message": "项目退出成功", "data": "0"}), 200
        else:
            return jsonify({"code": 200, "message": "项目未重复加入", "data": "1"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 删除未启用的项目
@app.route(f"{DEFAULTROUTE}/oper/projectDelete", methods=["POST"])
def delete_project():   
    try:
        DebugTool.debug_log("删除项目接收请求")
        # 获取项目信息
        data = request.json
        if not data:
            return jsonify({"code": 400, "message": "请求参数不能为空", "data": "1"}), 400

        # 获得需要删除的项目
        project_id = data["projectId"]
        DebugTool.debug_log(f"获取删除项目ID: {project_id}")

        # 删除项目
        result = MySqlUtil.delete_project(project_id=project_id)
        if result:
            return jsonify({"code": 200, "message": "项目删除成功", "data": "0"}), 200
        else:
            return jsonify({"code": 500, "message": "项目删除失败", "data": "1"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 添加新项目
@app.route(f"{DEFAULTROUTE}/oper/add", methods=["POST"])
def add_project():
    try:
        DebugTool.debug_log("添加项目接收请求")
        data = request.json
        if not data:
            return jsonify({"code": 400, "message": "请求参数不能为空", "data": "1"}), 400

        # 校验必填字段
        required_fields = ["project_name", "tech_stack", "start_time", "end_time", "status"]
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"code": 400, "message": f"字段 {field} 不能为空", "data": "1"}), 400

        # 提取字段
        project_name = data["project_name"]
        tech_stack = data["tech_stack"]
        start_time = data["start_time"]
        end_time = data["end_time"]
        status = data["status"]

        # 调用工具类插入数据
        result = MySqlUtil.add_project(
            project_name=project_name,
            tech_stack=tech_stack,
            start_time=start_time,
            end_time=end_time,
            status=status
        )

        if result[1] == "0":
            return jsonify({"code": 200, "message": "项目添加成功", "data": "0"}), 200
        elif result[1] == "2":
            return jsonify({"code": 409, "message": "项目名称已存在", "data": "2"}), 200
        else:
            return jsonify({"code": 500, "message": "项目添加失败", "data": "-1"}), 200

    except Exception as e:
        DebugTool.debug_log(f"添加项目异常: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
# 编辑项目信息
@app.route(f"{DEFAULTROUTE}/oper/edit", methods=["POST"])
def edit_project():
    try:
        DebugTool.debug_log("编辑项目接收请求")
        data = request.json
        if not data:
            return jsonify({"code": 400, "message": "请求参数不能为空", "data": "1"}), 400

        # 必传参数校验
        required_fields = ["project_id", "project_name", "tech_stack", "start_time", "end_time", "status"]
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"code": 400, "message": f"字段 {field} 不能为空", "data": "1"}), 400

        project_id = data["project_id"]
        project_name = data["project_name"]
        tech_stack = data["tech_stack"]
        start_time = data["start_time"]
        end_time = data["end_time"]
        status = data["status"]

        # 调用工具类执行更新
        result = MySqlUtil.edit_project(
            project_id=project_id,
            project_name=project_name,
            tech_stack=tech_stack,
            start_time=start_time,
            end_time=end_time,
            status=status
        )

        if result[1] == "0":
            return jsonify({"code": 200, "message": "项目编辑成功", "data": "0"}), 200
        elif result[1] == "2":
            return jsonify({"code": 409, "message": "项目名称已存在", "data": "2"}), 200
        else:
            return jsonify({"code": 500, "message": "项目编辑失败", "data": "-1"}), 200

    except Exception as e:
        DebugTool.debug_log(f"编辑项目异常: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=DEFAULTPORT, debug=True)
    