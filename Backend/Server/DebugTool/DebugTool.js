var isDebug = true

// 测试工具
class DebugTool {
    // Log输出
    static debugLog(msg) {
        if (isDebug) {
            console.log("测试工具: " + String(msg))
        }
    }
}

module.exports = {
    DebugTool
};