from flask import Flask, jsonify, Response, request
from flask_cors import CORS
#==============自定义工具引入================
from Utils.DebugTool.DebugUtil import DebugTool
from Utils import MySqlUtil

#==============基准IP==============
DEFAULTURL: str = "26.224.10.101"
DEFAULTPORT: int = 5007
#==================================

#=================基准路由===================
DEFAULTROUTE: str = "/article"

#==========Python后端创建===================
app = Flask(__name__)
CORS(app)

# 1. 查询所有文章
@app.route(f"{DEFAULTROUTE}/info/all", methods=["GET"])
def get_all_article():
    try:
        data = MySqlUtil.get_all_articles()
        return jsonify(data)
    except Exception as e:
        DebugTool.debug_log(f"查询所有文章异常: {e}")
        return jsonify({"error": str(e)}), 500

# 2. 根据ID查询单篇文章（详情）
@app.route(f"{DEFAULTROUTE}/info/<int:article_id>", methods=["GET"])
def get_article_detail(article_id):
    try:
        # 阅读量+1
        MySqlUtil.increase_views(article_id)
        data = MySqlUtil.get_article_by_id(article_id)
        if not data:
            return jsonify({"error": "文章不存在"}), 404
        return jsonify(data)
    except Exception as e:
        DebugTool.debug_log(f"查询文章详情异常: {e}")
        return jsonify({"error": str(e)}), 500

# 3. 新增文章
@app.route(f"{DEFAULTROUTE}/add", methods=["POST"])
def add_article():
    try:
        req_data = request.get_json()
        title = req_data.get("title")
        content = req_data.get("content")
        author_id = req_data.get("author_id")

        success, code = MySqlUtil.add_article(title, content, author_id)
        return jsonify({"success": success, "code": code, "message": "没什么,就占个格式", "data": code})
    except Exception as e:
        DebugTool.debug_log(f"新增文章异常: {e}")
        return jsonify({"error": str(e)}), 500

# 4. 编辑/更新文章
@app.route(f"{DEFAULTROUTE}/update/<int:article_id>", methods=["POST"])
def update_article(article_id):
    try:
        req_data = request.get_json()
        title = req_data.get("title")
        content = req_data.get("content")

        success, code = MySqlUtil.update_article(article_id, title, content)
        return jsonify({"success": success, "code": code})
    except Exception as e:
        DebugTool.debug_log(f"更新文章异常: {e}")
        return jsonify({"error": str(e)}), 500

# 5. 删除文章
@app.route(f"{DEFAULTROUTE}/delete/<int:article_id>", methods=["POST"])
def delete_article(article_id):
    try:
        success = MySqlUtil.delete_article(article_id)
        return jsonify({"success": success, "message": "占个格式", "data": "-10", "code": "-10"})
    except Exception as e:
        DebugTool.debug_log(f"删除文章异常: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=DEFAULTPORT, debug=True)