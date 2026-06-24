import { useEffect, useState } from "react";
import axios from "axios";
// AntD 组件引入
import { Layout, Table, Button, Space, message } from "antd";

// 自定义工具引入
import { DebugTool } from "../../Util/DebugTool/DebugTool";
import CONSTPARAM from "../../Core/CONST/CONST";
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem";

const { Content } = Layout;

// 项目列表（普通成员版：仅查看、加入项目，无新增/编辑/删除项目权限）
function ProjectionListNormal() {
    // 项目列表数据
    const [projectionList, setProjectionList] = useState([]);
    // 项目加入状态映射
    const [joinStateMap, setJoinStateMap] = useState({});
    // 刷新标记
    const [refresh, setRefresh] = useState(false);

    // 表格列定义
    const columns = [
        {
            title: "项目编号",
            dataIndex: "id",
            key: "id",
            width: 100
        },
        {
            title: "项目名称",
            dataIndex: "project_name",
            key: "project_name"
        },
        {
            title: "起始时间",
            dataIndex: "start_time",
            key: "start_time",
            width: 120
        },
        {
            title: "终止时间",
            dataIndex: "end_time",
            key: "end_time",
            width: 120
        },
        {
            title: "技术栈",
            dataIndex: "tech_stack",
            key: "tech_stack"
        },
        {
            title: "加入状态",
            key: "joinState",
            width: 100,
            render: (_, record) => {
                const state = joinStateMap[record.id];
                if (state === undefined) return <span>加载中...</span>;
                return state === "0" ? "未加入" : "已加入";
            }
        },
        {
            title: "操作",
            key: "action",
            width: 120,
            render: (_, record) => {
                const state = joinStateMap[record.id];
                return (
                    <Space size="middle">
                        <Button
                            type="primary"
                            disabled={state !== "0"}
                            onClick={() => joinProjection(record.id)}
                        >
                            加入项目
                        </Button>
                    </Space>
                );
            }
        }
    ];

    // 初始化：拉取列表 + 校验加入状态
    useEffect(() => {
        const fetchData = async () => {
            try {
                const listUrl = `${CONSTPARAM.PROJECTIONCENTERIP}${CONSTPARAM.PROJECTBASE}/info/all`;
                const res = await axios.get(listUrl);
                DebugTool.debugLog("前端项目: 发送用户请求: " + listUrl);

                const useList = Object.entries(res.data).map(([id, info]) => ({
                    id,
                    ...info
                }));
                setProjectionList(useList);

                // 批量校验加入状态
                useList.forEach((item) => {
                    InfomationSystem.veriftProjectJoinState(item.id, (res) => {
                        DebugTool.debugLog("前端项目表接收验证消息: " + JSON.stringify(res.data));
                        setJoinStateMap((prev) => ({
                            ...prev,
                            [item.id]: res.data
                        }));
                    });
                });
            } catch (err) {
                DebugTool.debugLog("拉取项目列表失败：" + err);
                message.error("拉取项目列表失败");
            }
        };

        fetchData();
    }, [refresh]);

    // 加入项目
    function joinProjection(projectionId) {
        InfomationSystem.sendJoinProjectionOper(projectionId, (result) => {
            DebugTool.debugLog("前端项目表返回: " + JSON.stringify(result));
            setJoinStateMap((prev) => ({
                ...prev,
                [projectionId]: "1"
            }));
            message.success("加入项目成功");
        });
    }

    return (
        <Layout style={{ padding: 16 }}>
            <Content style={{ background: "#fff" }}>
                {/* 普通成员无新增按钮 */}
                <Table
                    rowKey="id"
                    dataSource={projectionList}
                    columns={columns}
                    pagination={{ pageSize: 10 }}
                />
            </Content>
        </Layout>
    );
}

export default ProjectionListNormal;