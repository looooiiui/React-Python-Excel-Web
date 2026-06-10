import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

//==============自定义工具引入===============
import { DebugTool } from "../../Util/DebugTool/DebugTool";
import CONSTPARAM from "../../Core/CONST/CONST";
import ThemedButton from "../OverrideCom/OverrideButton/ThemeButton";
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem";
import { resumeToPipeableStream } from "react-dom/server";


// 全部项目显示(加入退出等操作组件)
function ProjectionList() {
    const [projectionList, setProjectionList] = useState([])

    // 初始化项目表
    useEffect(() => {
        const fetchData = async () => {
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
        }

        fetchData();
    }, []);

    // 加入项目
    function joinProjection(projectionId) {
        InfomationSystem.sendJoinProjectionOper(projectionId, (result) => {
            DebugTool.debugLog("前端项目表返回: " + JSON.stringify(result));
        })
    }

    return (
        <div>
            <table border="1">
                <thead>
                    <tr>
                        <th>项目编号</th>
                        <th>项目名字</th>
                        <th>项目起始时间</th>
                        <th>项目终止时间</th>
                        <th>技术栈</th>
                        <th>加入</th>
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
                            <td><ThemedButton onClick={() => { joinProjection(projection.id) }}>加入项目</ThemedButton></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProjectionList;