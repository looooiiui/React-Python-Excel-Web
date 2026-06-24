from flask import Flask, jsonify, Response, request
from flask_cors import CORS
#==============自定义工具引入================
from Utils.DebugTool.DebugUtil import DebugTool
from Utils import MySqlUtil
# 培训六大业务模块操作类
from TrainingMain import Attendance
from TrainingMain import CourseOper
from TrainingMain import enroll
from TrainingMain import ExamScore
from TrainingMain import TrainClass
from TrainingMain import UserOper

#==============基准IP==============
DEFAULTURL: str = "26.224.10.101"
DEFAULTPORT: int = 5008
#==================================

#=================基准路由===================
# 各模块独立路由前缀
USER_ROUTE: str = "/train/user"
COURSE_ROUTE: str = "/train/course"
CLASS_ROUTE: str = "/train/class"
ENROLL_ROUTE: str = "/train/enroll"
ATTEND_ROUTE: str = "/train/attendance"
SCORE_ROUTE: str = "/train/score"

#==========Python后端创建===================
app = Flask(__name__)
CORS(app)

#=================================================================================
# 一、用户模块 UserOper 接口
#=================================================================================
# 1. 查询所有用户
@app.route(f"{USER_ROUTE}/info/all", methods=["GET"])
def get_all_user():
    try:
        data = UserOper.get_all_user()
        return jsonify(data)
    except Exception as e:
        DebugTool.debug_log(f"查询所有用户异常: {e}")
        return jsonify({"error": str(e)}), 500

# 2. 根据ID查询单个用户详情
@app.route(f"{USER_ROUTE}/info/<int:user_id>", methods=["GET"])
def get_user_detail(user_id):
    try:
        data = UserOper.get_user_by_id(user_id)
        if not data:
            return jsonify({"error": "用户不存在"}), 404
        return jsonify(data)
    except Exception as e:
        DebugTool.debug_log(f"查询用户详情异常: {e}")
        return jsonify({"error": str(e)}), 500

# 3. 新增用户
@app.route(f"{USER_ROUTE}/add", methods=["POST"])
def add_user():
    try:
        req_data = request.get_json()
        username = req_data.get("username")
        real_name = req_data.get("real_name")
        gender = req_data.get("gender")
        dept = req_data.get("dept")
        phone = req_data.get("phone")
        email = req_data.get("email")
        role = req_data.get("role")

        success, code = UserOper.add_user(username, real_name, gender, dept, phone, email, role)
        return jsonify({"success": success, "code": code, "message": "用户新增完成", "data": code})
    except Exception as e:
        DebugTool.debug_log(f"新增用户异常: {e}")
        return jsonify({"error": str(e)}), 500

# 4. 更新用户信息
@app.route(f"{USER_ROUTE}/update/<int:user_id>", methods=["POST"])
def update_user(user_id):
    try:
        req_data = request.get_json()
        real_name = req_data.get("real_name")
        gender = req_data.get("gender")
        dept = req_data.get("dept")
        phone = req_data.get("phone")
        email = req_data.get("email")
        role = req_data.get("role")
        status = req_data.get("status")

        success, code = UserOper.update_user(user_id, real_name, gender, dept, phone, email, role, status)
        return jsonify({"success": success, "code": code})
    except Exception as e:
        DebugTool.debug_log(f"更新用户异常: {e}")
        return jsonify({"error": str(e)}), 500

# 5. 删除用户
@app.route(f"{USER_ROUTE}/delete/<int:user_id>", methods=["POST"])
def delete_user(user_id):
    try:
        success = UserOper.delete_user(user_id)
        return jsonify({"success": success, "message": "用户删除操作完成", "data": "-10", "code": "-10"})
    except Exception as e:
        DebugTool.debug_log(f"删除用户异常: {e}")
        return jsonify({"error": str(e)}), 500

#=================================================================================
# 二、课程模块 CourseOper 接口
#=================================================================================
# 1. 查询全部课程
@app.route(f"{COURSE_ROUTE}/info/all", methods=["GET"])
def get_all_course():
    try:
        data = CourseOper.get_all_course()
        return jsonify(data)
    except Exception as e:
        DebugTool.debug_log(f"查询全部课程异常: {e}")
        return jsonify({"error": str(e)}), 500

# 2. 根据课程ID查询单条课程
@app.route(f"{COURSE_ROUTE}/info/<int:course_id>", methods=["GET"])
def get_course_detail(course_id):
    try:
        data = CourseOper.get_course_by_id(course_id)
        if not data:
            return jsonify({"error": "课程不存在"}), 404
        return jsonify(data)
    except Exception as e:
        DebugTool.debug_log(f"查询课程详情异常: {e}")
        return jsonify({"error": str(e)}), 500

# 3. 新增课程
@app.route(f"{COURSE_ROUTE}/add", methods=["POST"])
def add_course():
    try:
        req_data = request.get_json()
        course_name = req_data.get("course_name")
        course_type = req_data.get("course_type")
        class_hour = req_data.get("class_hour")
        course_desc = req_data.get("course_desc")
        course_file = req_data.get("course_file")

        success, code = CourseOper.add_course(course_name, course_type, class_hour, course_desc, course_file)
        return jsonify({"success": success, "code": code, "message": "课程新增完成", "data": code})
    except Exception as e:
        DebugTool.debug_log(f"新增课程异常: {e}")
        return jsonify({"error": str(e)}), 500

# 4. 更新课程
@app.route(f"{COURSE_ROUTE}/update/<int:course_id>", methods=["POST"])
def update_course(course_id):
    try:
        req_data = request.get_json()
        course_name = req_data.get("course_name")
        course_type = req_data.get("course_type")
        class_hour = req_data.get("class_hour")
        course_desc = req_data.get("course_desc")
        course_file = req_data.get("course_file")
        status = req_data.get("status")

        success, code = CourseOper.update_course(course_id, course_name, course_type, class_hour, course_desc, course_file, status)
        return jsonify({"success": success, "code": code})
    except Exception as e:
        DebugTool.debug_log(f"更新课程异常: {e}")
        return jsonify({"error": str(e)}), 500

# 5. 删除课程
@app.route(f"{COURSE_ROUTE}/delete/<int:course_id>", methods=["POST"])
def delete_course(course_id):
    try:
        success = CourseOper.delete_course(course_id)
        return jsonify({"success": success, "message": "课程删除操作完成", "data": "0", "code": "0"})
    except Exception as e:
        DebugTool.debug_log(f"删除课程异常: {e}")
        return jsonify({"error": str(e)}), 500

#=================================================================================
# 三、培训班次模块 TrainClass 接口
#=================================================================================
# 1. 获取所有班次
@app.route(f"{CLASS_ROUTE}/info/all", methods=["GET"])
def get_all_train_class():
    try:
        data = TrainClass.get_all_train_class()
        return jsonify(data)
    except Exception as e:
        DebugTool.debug_log(f"查询全部班次异常: {e}")
        return jsonify({"error": str(e)}), 500

# 2. 根据班次ID查询单条班次
@app.route(f"{CLASS_ROUTE}/info/<int:class_id>", methods=["GET"])
def get_train_class_detail(class_id):
    try:
        data = TrainClass.get_train_class_by_id(class_id)
        if not data:
            return jsonify({"error": "班次不存在"}), 404
        return jsonify(data)
    except Exception as e:
        DebugTool.debug_log(f"查询班次详情异常: {e}")
        return jsonify({"error": str(e)}), 500

# 3. 新增培训班次
@app.route(f"{CLASS_ROUTE}/add", methods=["POST"])
def add_train_class():
    try:
        req_data = request.get_json()
        DebugTool.debug_log(req_data)
        class_name = req_data.get("class_name")
        course_id = req_data.get("course_id")
        train_type = req_data.get("train_type")
        start_time = req_data.get("start_time")
        end_time = req_data.get("end_time")
        address = req_data.get("address")
        manager_id = req_data.get("manager_id")
        remark = req_data.get("remark")

        success, code = TrainClass.add_train_class(class_name, course_id, train_type, start_time, end_time, address, manager_id, remark)
        return jsonify({"success": success, "code": code, "message": "班次新增完成", "data": code})
    except Exception as e:
        DebugTool.debug_log(f"新增班次异常: {e}")
        return jsonify({"error": str(e)}), 500

# 4. 更新班次信息
@app.route(f"{CLASS_ROUTE}/update/<int:class_id>", methods=["POST"])
def update_train_class(class_id):
    try:
        req_data = request.get_json()
        class_name = req_data.get("class_name")
        course_id = req_data.get("course_id")
        train_type = req_data.get("train_type")
        start_time = req_data.get("start_time")
        end_time = req_data.get("end_time")
        address = req_data.get("address")
        manager_id = req_data.get("manager_id")
        remark = req_data.get("remark")
        status = req_data.get("status")

        success, code = TrainClass.update_train_class(class_id, class_name, course_id, train_type, start_time, end_time, address, manager_id, remark, status)
        return jsonify({"success": success, "code": code})
    except Exception as e:
        DebugTool.debug_log(f"更新班次异常: {e}")
        return jsonify({"error": str(e)}), 500

# 5. 删除班次
@app.route(f"{CLASS_ROUTE}/delete/<int:class_id>", methods=["POST"])
def delete_train_class(class_id):
    try:
        success = TrainClass.delete_train_class(class_id)
        return jsonify({"success": success, "message": "班次删除操作完成", "data": "0", "code": "0"})
    except Exception as e:
        DebugTool.debug_log(f"删除班次异常: {e}")
        return jsonify({"error": str(e)}), 500

#=================================================================================
# 四、报名记录模块 enroll 接口
#=================================================================================
# 1. 获取全部报名记录
@app.route(f"{ENROLL_ROUTE}/info/all", methods=["GET"])
def get_all_enroll():
    try:
        data = enroll.get_all_enroll()
        return jsonify(data)
    except Exception as e:
        DebugTool.debug_log(f"查询全部报名记录异常: {e}")
        return jsonify({"error": str(e)}), 500

# 2. 根据报名ID查询单条报名
@app.route(f"{ENROLL_ROUTE}/info/<int:enroll_id>", methods=["GET"])
def get_enroll_detail(enroll_id):
    try:
        data = enroll.get_enroll_by_id(enroll_id)
        if not data:
            return jsonify({"error": "报名记录不存在"}), 404
        return jsonify(data)
    except Exception as e:
        DebugTool.debug_log(f"查询报名详情异常: {e}")
        return jsonify({"error": str(e)}), 500

# 3. 新增报名
@app.route(f"{ENROLL_ROUTE}/add", methods=["POST"])
def add_enroll():
    try:
        req_data = request.get_json()
        class_id = req_data.get("class_id")
        user_id = req_data.get("user_id")
        audit_status = req_data.get("audit_status")
        remark = req_data.get("remark")

        success, code = enroll.add_enroll(class_id, user_id, audit_status, remark)
        return jsonify({"success": success, "code": code, "message": "报名记录新增完成", "data": code})
    except Exception as e:
        DebugTool.debug_log(f"新增报名异常: {e}")
        return jsonify({"error": str(e)}), 500

# 4. 更新报名审核状态
@app.route(f"{ENROLL_ROUTE}/update/<int:enroll_id>", methods=["POST"])
def update_enroll(enroll_id):
    try:
        req_data = request.get_json()
        audit_status = req_data.get("audit_status")
        remark = req_data.get("remark")

        success, code = enroll.update_enroll(enroll_id, audit_status, remark)
        return jsonify({"success": success, "code": code})
    except Exception as e:
        DebugTool.debug_log(f"更新报名记录异常: {e}")
        return jsonify({"error": str(e)}), 500

# 5. 删除报名记录
@app.route(f"{ENROLL_ROUTE}/delete/<int:enroll_id>", methods=["POST"])
def delete_enroll(enroll_id):
    try:
        success = enroll.delete_enroll(enroll_id)
        return jsonify({"success": success, "message": "报名记录删除完成", "data": "-10", "code": "-10"})
    except Exception as e:
        DebugTool.debug_log(f"删除报名记录异常: {e}")
        return jsonify({"error": str(e)}), 500

# 扩展接口：根据班次ID查该班所有报名学员
@app.route(f"{ENROLL_ROUTE}/byClass/<int:class_id>", methods=["GET"])
def get_enroll_by_class(class_id):
    try:
        data = enroll.get_enroll_by_class(class_id)
        return jsonify(data)
    except Exception as e:
        DebugTool.debug_log(f"根据班次查询报名异常: {e}")
        return jsonify({"error": str(e)}), 500

# 扩展接口：根据用户ID查该用户所有报名班次
@app.route(f"{ENROLL_ROUTE}/byUser/<int:user_id>", methods=["GET"])
def get_enroll_by_user(user_id):
    DebugTool.debug_log("查询单个用户培训信息: " + str(user_id))
    try:
        data = enroll.get_enroll_by_user(user_id)
        return jsonify(data)
    except Exception as e:
        DebugTool.debug_log(f"根据用户查询报名异常: {e}")
        return jsonify({"error": str(e)}), 500

#=================================================================================
# 五、考勤记录模块 Attendance 接口
#=================================================================================
# 1. 获取全部考勤记录
@app.route(f"{ATTEND_ROUTE}/info/all", methods=["GET"])
def get_all_attendance():
    try:
        data = Attendance.get_all_attendance()
        return jsonify(data)
    except Exception as e:
        DebugTool.debug_log(f"查询全部考勤记录异常: {e}")
        return jsonify({"error": str(e)}), 500

# 2. 根据考勤ID查询单条考勤
@app.route(f"{ATTEND_ROUTE}/info/<int:attendance_id>", methods=["GET"])
def get_attendance_detail(attendance_id):
    try:
        data = Attendance.get_attendance_by_id(attendance_id)
        if not data:
            return jsonify({"error": "考勤记录不存在"}), 404
        return jsonify(data)
    except Exception as e:
        DebugTool.debug_log(f"查询考勤详情异常: {e}")
        return jsonify({"error": str(e)}), 500

# 3. 新增考勤记录
@app.route(f"{ATTEND_ROUTE}/add", methods=["POST"])
def add_attendance():
    try:
        req_data = request.get_json()
        class_id = req_data.get("class_id")
        user_id = req_data.get("user_id")
        sign_in_time = req_data.get("sign_in_time")
        sign_out_time = req_data.get("sign_out_time")
        attend_status = req_data.get("attend_status")
        leave_reason = req_data.get("leave_reason")

        success, code = Attendance.add_attendance(class_id, user_id, sign_in_time, sign_out_time, attend_status, leave_reason)
        return jsonify({"success": success, "code": code, "message": "考勤记录新增完成", "data": code})
    except Exception as e:
        DebugTool.debug_log(f"新增考勤异常: {e}")
        return jsonify({"error": str(e)}), 500

# 4. 更新考勤记录
@app.route(f"{ATTEND_ROUTE}/update/<int:attendance_id>", methods=["POST"])
def update_attendance(attendance_id):
    try:
        req_data = request.get_json()
        sign_in_time = req_data.get("sign_in_time")
        sign_out_time = req_data.get("sign_out_time")
        attend_status = req_data.get("attend_status")
        leave_reason = req_data.get("leave_reason")

        success, code = Attendance.update_attendance(attendance_id, sign_in_time, sign_out_time, attend_status, leave_reason)
        return jsonify({"success": success, "code": code})
    except Exception as e:
        DebugTool.debug_log(f"更新考勤记录异常: {e}")
        return jsonify({"error": str(e)}), 500

# 5. 删除考勤记录
@app.route(f"{ATTEND_ROUTE}/delete/<int:attendance_id>", methods=["POST"])
def delete_attendance(attendance_id):
    try:
        success = Attendance.delete_attendance(attendance_id)
        return jsonify({"success": success, "message": "考勤记录删除完成", "data": "-10", "code": "-10"})
    except Exception as e:
        DebugTool.debug_log(f"删除考勤记录异常: {e}")
        return jsonify({"error": str(e)}), 500

# 扩展接口：根据班次ID查询本班所有考勤
@app.route(f"{ATTEND_ROUTE}/byClass/<int:class_id>", methods=["GET"])
def get_attendance_by_class(class_id):
    try:
        data = Attendance.get_attendance_by_class(class_id)
        return jsonify(data)
    except Exception as e:
        DebugTool.debug_log(f"根据班次查询考勤异常: {e}")
        return jsonify({"error": str(e)}), 500

#=================================================================================
# 六、考试成绩模块 ExamScore 接口
#=================================================================================
# 1. 获取全部成绩记录
@app.route(f"{SCORE_ROUTE}/info/all", methods=["GET"])
def get_all_exam_score():
    try:
        data = ExamScore.get_all_exam_score()
        return jsonify(data)
    except Exception as e:
        DebugTool.debug_log(f"查询全部成绩记录异常: {e}")
        return jsonify({"error": str(e)}), 500

# 2. 根据成绩ID查询单条成绩
@app.route(f"{SCORE_ROUTE}/info/<int:score_id>", methods=["GET"])
def get_exam_score_detail(score_id):
    try:
        data = ExamScore.get_exam_score_by_id(score_id)
        if not data:
            return jsonify({"error": "成绩记录不存在"}), 404
        return jsonify(data)
    except Exception as e:
        DebugTool.debug_log(f"查询成绩详情异常: {e}")
        return jsonify({"error": str(e)}), 500

# 3. 新增成绩记录
@app.route(f"{SCORE_ROUTE}/add", methods=["POST"])
def add_exam_score():
    try:
        req_data = request.get_json()
        class_id = req_data.get("class_id")
        user_id = req_data.get("user_id")
        score = req_data.get("score")
        is_pass = req_data.get("is_pass")
        exam_time = req_data.get("exam_time")
        retest_count = req_data.get("retest_count")

        success, code = ExamScore.add_exam_score(class_id, user_id, score, is_pass, exam_time, retest_count)
        return jsonify({"success": success, "code": code, "message": "成绩记录新增完成", "data": code})
    except Exception as e:
        DebugTool.debug_log(f"新增成绩异常: {e}")
        return jsonify({"error": str(e)}), 500

# 4. 更新成绩记录
@app.route(f"{SCORE_ROUTE}/update/<int:score_id>", methods=["POST"])
def update_exam_score(score_id):
    try:
        req_data = request.get_json()
        score = req_data.get("score")
        is_pass = req_data.get("is_pass")
        exam_time = req_data.get("exam_time")
        retest_count = req_data.get("retest_count")

        success, code = ExamScore.update_exam_score(score_id, score, is_pass, exam_time, retest_count)
        return jsonify({"success": success, "code": code})
    except Exception as e:
        DebugTool.debug_log(f"更新成绩记录异常: {e}")
        return jsonify({"error": str(e)}), 500

# 5. 删除成绩记录
@app.route(f"{SCORE_ROUTE}/delete/<int:score_id>", methods=["POST"])
def delete_exam_score(score_id):
    try:
        success = ExamScore.delete_exam_score(score_id)
        return jsonify({"success": success, "message": "成绩记录删除完成", "data": "-10", "code": "-10"})
    except Exception as e:
        DebugTool.debug_log(f"删除成绩记录异常: {e}")
        return jsonify({"error": str(e)}), 500

# 扩展接口：根据班次ID查询本班所有成绩
@app.route(f"{SCORE_ROUTE}/byClass/<int:class_id>", methods=["GET"])
def get_score_by_class(class_id):
    try:
        data = ExamScore.get_score_by_class(class_id)
        return jsonify(data)
    except Exception as e:
        DebugTool.debug_log(f"根据班次查询成绩异常: {e}")
        return jsonify({"error": str(e)}), 500

#=================================================================================
# 服务启动入口
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=DEFAULTPORT, debug=True)