import { useEffect, useState } from "react";
import axios from "axios";

//==============自定义工具引入===============
import { DebugTool } from "../../Util/DebugTool/DebugTool";
import CONSTPARAM from "../../Core/CONST/CONST";
import ThemedButton from "../OverrideCom/OverrideButton/ThemeButton";
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem";
//==============UI库引入=====================
import { Table, Button, Layout, Typography } from "antd";

const { Content } = Layout;
const { Title } = Typography;

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
        // 把刷新标记加入依赖，状态变化重新请求
    }, [updateList]);

    // 退出项目
    function exitProject(projectId) {
        InfomationSystem.exitProjectOper(projectId, (res) => {
            DebugTool.debugLog("前端个人项目: 接收退出操作返回值: " + JSON.stringify(res.data));
            // 切换状态，触发列表刷新
            setUpdateList(prev => !prev);
        });
    }

    //=========================UI渲染=====================
    //======表格头==============================
    const columns = [
        { title: "加入编号", dataIndex: "id", key: "col_id" },
        { title: "项目ID", dataIndex: "project_id", key: "col_project_id" },
        { title: "用户ID", dataIndex: "account_id", key: "col_account_id" },
        { title: "用户身份", dataIndex: "role", key: "col_role" },
        { title: "用户个人进展", dataIndex: "progress", key: "col_progress" },
        { title: "用户分数", dataIndex: "score", key: "col_score" },
        { title: "加入项目时间", dataIndex: "submit_time", key: "col_submit_time" },
        {
            title: "退出",
            key: "col_exit",
            render: (_, record) => {
                return (
                    <Button danger onClick={() => exitProject(record.project_id)}>
                        退出项目
                    </Button>
                )
            }
        }
    ]

    return (
        <div style={{ width: "100%" }}>
            <Layout style={{ padding: "16px", background: "#fff", borderRadius: "6px" }}>
                {/* 组件标题，增加上下间距区分 */}
                <Title level={5} style={{ margin: "0 0 16px 0" }}>
                    我加入的项目
                </Title>
                <Table
                    rowKey="id"
                    dataSource={projectionList}
                    columns={columns}
                    pagination={{ pageSize: 10 }}
                    size="middle"
                    locale={{ emptyText: "暂无已加入项目" }}
                />
            </Layout>
        </div>
    );
}

export default SpecificProjectionList;