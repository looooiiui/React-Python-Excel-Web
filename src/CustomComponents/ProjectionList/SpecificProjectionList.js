import { useEffect, useState } from "react";
import axios from "axios";

//==============自定义工具引入===============
import { DebugTool } from "../../Util/DebugTool/DebugTool";
import CONSTPARAM from "../../Core/CONST/CONST";
import ThemedButton from "../OverrideCom/OverrideButton/ThemeButton";
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem";

// 显示当前加入的项目
function SpecificProjectionList() {
    const [projectionList, setProjectionList] = useState([]);
    // 列表刷新标记
    const [updateList, setUpdateList] = useState(false);

    // 初始化/刷新项目列表
    useEffect(() => {
        const fetchData = async () => {
            try {
                const listUrl = `${CONSTPARAM.PROJECTIONCENTERIP}${CONSTPARAM.PROJECTBASE}/info/getSpecific`;
                DebugTool.debugLog("前端个人项目: 发送用户请求: " + listUrl);

                const accountId = InfomationSystem.getCurrentLoginInfo().accountId;
                const sendInfo = { accountId };
                DebugTool.debugLog("前端个人项目: 发送个人项目查询: " + JSON.stringify(sendInfo));

                const res = await axios.post(listUrl, sendInfo, { timeout: 5000 });
                // 对象转数组
                const useList = Object.entries(res.data).map(([id, info]) => ({
                    id,
                    ...info
                }));
                setProjectionList(useList);
            } catch (err) {
                DebugTool.debugLog("查询个人项目失败：" + err);
            }
        };

        fetchData();
        // 关键：把刷新标记加入依赖，状态变化就重新请求
    }, [updateList]);

    // 退出项目
    function exitProject(projectId) {
        InfomationSystem.exitProjectOper(projectId, (res) => {
            DebugTool.debugLog("前端个人项目: 接收退出操作返回值: " + JSON.stringify(res.data));
            // 切换状态，触发列表刷新
            setUpdateList(prev => !prev);
        });
    }

    return (
        <div>
            <table border="1">
                <thead>
                    <tr>
                        <th>加入编号</th>
                        <th>项目ID</th>
                        <th>用户ID</th>
                        <th>用户身份</th>
                        <th>用户个人进展</th>
                        <th>用户分数</th>
                        <th>加入项目时间</th>
                        <th>退出</th>
                    </tr>
                </thead>
                <tbody>
                    {projectionList.map((projection) => (
                        <tr key={projection.id}>
                            <td>{projection.id}</td>
                            <td>{projection.project_id}</td>
                            <td>{projection.account_id}</td>
                            <td>{projection.role}</td>
                            <td>{projection.progress}</td>
                            <td>{projection.score}</td>
                            <td>{projection.submit_time}</td>
                            <td>
                                <ThemedButton onClick={() => exitProject(projection.project_id)}>
                                    退出项目
                                </ThemedButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SpecificProjectionList;