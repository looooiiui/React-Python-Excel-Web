// 自定义工具引入
import { DebugTool }        from "../DebugTool/DebugTool";
import CONSTPARAM           from "../../Core/CONST/CONST";

// 三方工具引入
import axios                from "axios";
import { useNavigate }      from "react-router-dom";

// 常用工具类
class NormalTool {
    // =======================单次图片上传===================
    static uploadByDrop = async (e, form, fieldName) => {
        if (!e || !form || !fieldName) {
            DebugTool.debugLog("图片上传参数缺失：e/form/fieldName不能为空");
            return;
        }

        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file || !file.type.startsWith("image/")) return;

        const formData = new FormData();
        formData.append("imgFile", file);
        DebugTool.debugLog("前端测试网址: 向后端资源中心传输图片");

        try {
            const res = await axios.post(`${CONSTPARAM.RESOURCEIP}${CONSTPARAM.RESOURCEBASE}/upload`, formData);
            const imgUrl = res.data.data.imgUrl;
            DebugTool.debugLog("前端测试网址: 获得后端图片基址: " + imgUrl);
            const oldText = form.getFieldValue(fieldName) || "";
            const insertImg = `![图片](${imgUrl})`;
            form.setFieldsValue({ [fieldName]: oldText + insertImg });
        } catch (err) {
            DebugTool.debugLog("前端测试网址: 上传图片失败：" + err.message);
        }
    };

    // ================粘贴截图/图片==========================
    static uploadByPaste = async (e, form, fieldName) => {
        if (!e || !form || !fieldName) {
            DebugTool.debugLog("图片上传参数缺失：e/form/fieldName不能为空");
            return;
        }
        e.preventDefault();

        const items = e.clipboardData.items;
        for (const item of items) {
            if (item.kind === "file") {
                const file = item.getAsFile();
                const formData = new FormData();
                formData.append("imgFile", file);
                DebugTool.debugLog("前端测试网址: 向后端资源中心传输图片(批量)");

                try {
                    const res = await axios.post(`${CONSTPARAM.RESOURCEIP}${CONSTPARAM.RESOURCEBASE}/upload`, formData);
                    const imgUrl = res.data.data.imgUrl;
                    DebugTool.debugLog("前端测试网址: 获得后端图片基址: " + imgUrl);
                    const oldText = form.getFieldValue(fieldName) || "";
                    const insertImg = `![图片](${imgUrl})`;
                    form.setFieldsValue({ [fieldName]: oldText + insertImg });
                } catch (err) {
                    DebugTool.debugLog("前端测试网址: 上传图片失败：" + err.message);
                }
                break; // 一次只粘贴一张图片，跳出循环
            }
        }
    };
}


export default NormalTool;
