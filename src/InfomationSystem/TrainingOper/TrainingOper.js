import axios                    from "axios";
import { DebugTool }            from "../../Util/DebugTool/DebugTool";
import CONSTPARAM               from "../../Core/CONST/CONST";
import { InfomationSystem }     from "../InfomationSystem";

// ===================== 用户模块 tb_user =====================
// 获取全部用户
export function trainGetAllUser(callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/user/info/all`;
    axios.get(url, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端培训模块: 获取全部用户成功，返回：" + res.data);
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端培训模块: 获取全部用户失败：" + err.message + err.response?.data);
            callback(InfomationSystem.getBackError());
        });
}

// 根据ID获取单用户
export function trainGetUserById(userId, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/user/info/${userId}`;
    axios.get(url, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端培训模块: 获取用户详情成功,ID:" + userId);
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端培训模块: 获取用户详情失败：" + err.message + err.response?.data);
            callback(InfomationSystem.getBackError());
        });
}

// 新增用户
export function trainAddUser(userData, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/user/add`;
    axios.post(url, userData, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端培训模块: 新增用户成功");
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端培训模块: 新增用户失败：" + err.message + err.response?.data);
            callback(InfomationSystem.getBackError());
        });
}

// 更新用户
export function trainUpdateUser(userId, userData, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/user/update/${userId}`;
    axios.post(url, userData, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端培训模块: 更新用户成功，ID：" + userId);
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端培训模块: 更新用户失败：" + err.message + err.response?.data);
            callback(InfomationSystem.getBackError());
        });
}

// 删除用户
export function trainDeleteUser(userId, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/user/delete/${userId}`;
    axios.post(url, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端培训模块: 删除用户成功，ID：" + userId);
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端培训模块: 删除用户失败：" + err.message + err.response?.data);
            callback(InfomationSystem.getBackError());
        });
}

// ===================== 课程模块 tb_course =====================
export function trainGetAllCourse(callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/course/info/all`;
    axios.get(url, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端培训模块: 获取全部课程成功");
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端培训模块: 获取全部课程失败：" + err.message);
            callback(InfomationSystem.getBackError());
        });
}

export function trainGetCourseById(courseId, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/course/info/${courseId}`;
    axios.get(url, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端培训模块: 获取课程详情成功,ID:" + courseId);
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端培训模块: 获取课程详情失败：" + err.message);
            callback(InfomationSystem.getBackError());
        });
}

export function trainAddCourse(courseData, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/course/add`;
    axios.post(url, courseData, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端培训模块: 新增课程成功");
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端培训模块: 新增课程失败：" + err.message);
            callback(InfomationSystem.getBackError());
        });
}

export function trainUpdateCourse(courseId, courseData, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/course/update/${courseId}`;
    axios.post(url, courseData, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端培训模块: 更新课程成功,ID:" + courseId);
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端培训模块: 更新课程失败：" + err.message);
            callback(InfomationSystem.getBackError());
        });
}

export function trainDeleteCourse(courseId, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/course/delete/${courseId}`;
    axios.post(url, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端培训模块: 删除课程成功，ID：" + courseId);
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端培训模块: 删除课程失败：" + err.message);
            callback(InfomationSystem.getBackError());
        });
}

// ===================== 培训班次 tb_train_class =====================
export function trainGetAllClass(callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/class/info/all`;
    axios.get(url, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端培训模块: 获取全部班次成功");
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端培训模块: 获取全部班次失败：" + err.message);
            callback(InfomationSystem.getBackError());
        });
}

export function trainGetClassById(classId, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/class/info/${classId}`;
    axios.get(url, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端培训模块: 获取班次详情成功,ID:" + classId);
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端培训模块: 获取班次详情失败：" + err.message);
            callback(InfomationSystem.getBackError());
        });
}

export function trainAddClass(classData, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/class/add`;
    axios.post(url, classData, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端培训模块: 新增班次成功");
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端培训模块: 新增班次失败：" + err.message);
            callback(InfomationSystem.getBackError());
        });
}

export function trainUpdateClass(classId, classData, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/class/update/${classId}`;
    axios.post(url, classData, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端培训模块: 更新班次成功，ID：" + classId);
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端培训模块: 更新班次失败：" + err.message);
            callback(InfomationSystem.getBackError());
        });
}

export function trainDeleteClass(classId, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/class/delete/${classId}`;
    axios.post(url, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端培训模块: 删除班次成功，ID：" + classId);
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端培训模块: 删除班次失败：" + err.message);
            callback(InfomationSystem.getBackError());
        });
}

// ===================== 报名记录 tb_enroll =====================
export function trainGetAllEnroll(callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/enroll/info/all`;
    axios.get(url, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端培训模块: 获取全部报名记录成功");
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端培训模块: 获取全部报名失败：" + err.message);
            callback(InfomationSystem.getBackError());
        });
}

export function trainGetEnrollById(enrollId, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/enroll/info/${enrollId}`;
    axios.get(url, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端培训模块: 获取单条报名成功，ID：" + enrollId);
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端培训模块: 获取报名详情失败：" + err.message);
            callback(InfomationSystem.getBackError());
        });
}

export function trainAddEnroll(enrollData, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/enroll/add`;
    axios.post(url, enrollData, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端培训模块: 新增报名记录成功");
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端培训模块: 新增报名失败：" + err.message);
            callback(InfomationSystem.getBackError());
        });
}

export function trainUpdateEnroll(enrollId, enrollData, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/enroll/update/${enrollId}`;
    axios.post(url, enrollData, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端培训模块: 更新报名记录成功，ID：" + enrollId);
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端培训模块: 更新报名失败：" + err.message);
            callback(InfomationSystem.getBackError());
        });
}

export function trainDeleteEnroll(enrollId, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/enroll/delete/${enrollId}`;
    axios.post(url, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端培训模块: 删除报名记录成功，ID：" + enrollId);
            callback(res.data);
        })
        .catch(err => {
            DebugTool.debugLog("前端培训模块: 删除报名失败：" + err.message);
            callback(InfomationSystem.getBackError());
        });
}

// 扩展：根据班次查报名
export function trainGetEnrollByClass(classId, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/enroll/byClass/${classId}`;
    axios.get(url, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端培训模块: 根据班次查询报名成功");
            callback(res.data);
        })
        .catch(err => {
            callback(InfomationSystem.getBackError());
        });
}

// 扩展：根据用户查报名
export function trainGetEnrollByUser(userId, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/enroll/byUser/${userId}`;
    axios.get(url, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端培训模块: 根据用户查询报名成功");
            callback(res.data);
        })
        .catch(err => {
            callback(InfomationSystem.getBackError());
        });
}

// ===================== 考勤 tb_attendance =====================
export function trainGetAllAttendance(callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/attendance/info/all`;
    axios.get(url, { timeout: 5000 })
        .then(res => {
            DebugTool.debugLog("前端培训模块: 获取全部考勤成功");
            callback(res.data);
        })
        .catch(err => {
            callback(InfomationSystem.getBackError());
        });
}

export function trainGetAttendanceById(attId, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/attendance/info/${attId}`;
    axios.get(url, { timeout: 5000 })
        .then(res => {
            callback(res.data);
        })
        .catch(err => {
            callback(InfomationSystem.getBackError());
        });
}

export function trainAddAttendance(attData, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/attendance/add`;
    axios.post(url, attData, { timeout: 5000 })
        .then(res => {
            callback(res.data);
        })
        .catch(err => {
            callback(InfomationSystem.getBackError());
        });
}

export function trainUpdateAttendance(attId, attData, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/attendance/update/${attId}`;
    axios.post(url, attData, { timeout: 5000 })
        .then(res => {
            callback(res.data);
        })
        .catch(err => {
            callback(InfomationSystem.getBackError());
        });
}

export function trainDeleteAttendance(attId, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/attendance/delete/${attId}`;
    axios.post(url, { timeout: 5000 })
        .then(res => {
            callback(res.data);
        })
        .catch(err => {
            callback(InfomationSystem.getBackError());
        });
}

export function trainGetAttendanceByClass(classId, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/attendance/byClass/${classId}`;
    axios.get(url, { timeout: 5000 })
        .then(res => {
            callback(res.data);
        })
        .catch(err => {
            callback(InfomationSystem.getBackError());
        });
}

// ===================== 成绩 tb_exam_score =====================
export function trainGetAllScore(callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/score/info/all`;
    axios.get(url, { timeout: 5000 })
        .then(res => {
            callback(res.data);
        })
        .catch(err => {
            callback(InfomationSystem.getBackError());
        });
}

export function trainGetScoreById(scoreId, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/score/info/${scoreId}`;
    axios.get(url, { timeout: 5000 })
        .then(res => {
            callback(res.data);
        })
        .catch(err => {
            callback(InfomationSystem.getBackError());
        });
}

export function trainAddScore(scoreData, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/score/add`;
    axios.post(url, scoreData, { timeout: 5000 })
        .then(res => {
            callback(res.data);
        })
        .catch(err => {
            callback(InfomationSystem.getBackError());
        });
}

export function trainUpdateScore(scoreId, scoreData, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/score/update/${scoreId}`;
    axios.post(url, scoreData, { timeout: 5000 })
        .then(res => {
            callback(res.data);
        })
        .catch(err => {
            callback(InfomationSystem.getBackError());
        });
}

export function trainDeleteScore(scoreId, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/score/delete/${scoreId}`;
    axios.post(url, { timeout: 5000 })
        .then(res => {
            callback(res.data);
        })
        .catch(err => {
            callback(InfomationSystem.getBackError());
        });
}

export function trainGetScoreByClass(classId, callback) {
    const url = `${CONSTPARAM.TRAINIP}${CONSTPARAM.TRAINBASE}/score/byClass/${classId}`;
    axios.get(url, { timeout: 5000 })
        .then(res => {
            callback(res.data);
        })
        .catch(err => {
            callback(InfomationSystem.getBackError());
        });
}