import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

//==============自定义工具引入===============
import { DebugTool } from "../../Util/DebugTool/DebugTool";
import CONSTPARAM from "../../Core/CONST/CONST";
import ThemedButton from "../OverrideCom/OverrideButton/ThemeButton";
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem";
import Theme from "../../Theme/theme";

// 全部项目显示(加入退出等操作组件)
function ProjectionList() {
    const [projectionList, setProjectionList] = useState([]);
    const [joinStateMap, setJoinStateMap] = useState({});
    const [refresh, setRefresh] = useState(false);

    // 初始化项目表 + 查询加入状态
    useEffect(() => {
        const fetchData = async () => {
            try {
                let listUrl = `${CONSTPARAM.PROJECTIONCENTERIP}${CONSTPARAM.PROJECTBASE}/info/all`;
                // 返回的全部项目
                let res = await axios.get(listUrl);
                DebugTool.debugLog("前端项目: 发送用户请求: " + listUrl);
                // 把对象转成数组，方便渲染
                const useList = Object.entries(res.data).map(([id, info]) => ({
                    id,
                    ...info
                }));
                setProjectionList(useList);

                // 遍历数组查询加入状态
                useList.forEach((item) => {
                    InfomationSystem.veriftProjectJoinState(item.id, (res) => {
                        DebugTool.debugLog("前端项目表接收验证消息: " + JSON.stringify(res.data));
                        // 更新映射状态
                        setJoinStateMap((prev) => ({
                            ...prev,
                            [item.id]: res.data
                        }));
                    });
                });
            } catch (err) {
                DebugTool.debugLog("拉取项目列表失败：" + err);
            }
        };

        fetchData();
    }, [refresh]);

    // 加入项目
    function joinProjection(projectionId) {
        InfomationSystem.sendJoinProjectionOper(projectionId, (result) => {
            DebugTool.debugLog("前端项目表返回: " + JSON.stringify(result));
            // 加入成功后，主动更新本地状态，不用刷新页面
            setJoinStateMap(prev => ({
                ...prev,
                [projectionId]: "1"
            }));
        });
    }

    // 删除项目
    function deleteProjection(projectId) {
        InfomationSystem.deleteProjectOper(projectId, (result) => {
            DebugTool.debugLog("前端删除项目返回: " + JSON.stringify(result));
            setRefresh((prev) => (!prev));
        })
    }

    // 根据状态返回按钮
    function renderButton(projectId) {
        const state = joinStateMap[projectId];
        // 接口还没返回时，先显示加载/空白
        if (state === undefined) {
            return <span>加载中...</span>;
        }

        // 0 = 未加入
        if (state === "0") {
            return (
                <ThemedButton onClick={() => joinProjection(projectId)}>
                    加入项目
                </ThemedButton>
            );
        }
        // 已加入
        return (
            <ThemedButton disabled={true}>
                已加入
            </ThemedButton>
        );
    }

    return (
        <div>
            <table border="1" style={Theme.TableMainTheme}>
                <thead style={Theme.TableHeadRowTheme}>
                    <tr>
                        <th>项目编号</th>
                        <th>项目名字</th>
                        <th>项目起始时间</th>
                        <th>项目终止时间</th>
                        <th>技术栈</th>
                        <th>加入</th>
                        <th>删除项目</th>
                    </tr>
                </thead>
                <tbody>
                    {projectionList.map((projection) => (
                        <tr key={projection.id}>
                            <td>{projection.id}</td>
                            <td>{projection.project_name}</td>
                            <td>{projection.start_time}</td>
                            <td>{projection.end_time}</td>
                            <td>{projection.tech_stack}</td>
                            <td>{renderButton(projection.id)}</td>
                            <td><ThemedButton onClick={() => { deleteProjection(projection.id) }}>删除项目</ThemedButton></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProjectionList;