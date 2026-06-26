from flask import Flask, jsonify, request
from flask_cors import CORS

import os
import time

from Utils.DebugTool.DebugUtil import DebugTool
# ==================基准IP================
DEFAULT_URL: str = "127.0.0.1"
DEFAULT_PORT: int = 5009

app = Flask(__name__, static_folder="Static", static_url_path="/static")
CORS(app)

# =========== 上传资源存储地址 ===============
UPLOAD_IMG_FOLDER = os.path.join(app.root_path, "Static/Img")
os.makedirs(UPLOAD_IMG_FOLDER, exist_ok=True)

@app.route("/resource/upload", methods=["POST"])
def upload():
    # 取出图片字段资源
    img_file = request.files.get("imgFile")

    # 检查拿到的图片
    if not img_file:
        return jsonify({"code": 99, "message": "图片不存在(没拿到)" , "code": -1 })
    
    # 2. 生成唯一文件名，避免覆盖旧图片
    # 时间戳+原文件名
    timestamp = int(time.time() * 1000)
    filename = f"{timestamp}_{img_file.filename}"
    save_path = os.path.join(UPLOAD_IMG_FOLDER, filename)

    # 保存图片
    img_file.save(save_path)

    # 返回给前端的后端资源地址
    img_url = f"http://{DEFAULT_URL}:{DEFAULT_PORT}/static/Img/{filename}"
    return jsonify({
        "code": 0,
        "message": "资源上传成功",
        "data": {
            "imgUrl": img_url
        }
    })

if __name__ == "__main__":
    DebugTool.debug_log("初始化图片资源地址: " + UPLOAD_IMG_FOLDER)
    app.run(host="0.0.0.0", port=DEFAULT_PORT, debug=True)