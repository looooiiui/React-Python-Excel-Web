import { useEffect, useState } from "react";
import { Layout, Table, Space, Button, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

//=======================自定义工具============================
import { DebugTool } from "../../Util/DebugTool/DebugTool";
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem";
import CONSTPARAM from "../../Core/CONST/CONST";
import { ReconciliationFilled } from "@ant-design/icons";

const { Content } = Layout;

function MyTrainingList() {
    const [trainingList, setTrainingList] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false); // 加载状态
    const navigate = useNavigate();

    // 课程跳转
    function navToDetail(title) {
        DebugTool.debugLog(`查找课程详细: 标题: ${title}`);
        const params = new URLSearchParams();
        params.append("title", title);
        navigate({
            pathname: `${CONSTPARAM.FRONTARTICLE}/detailnormal`,
            search: `?${params.toString()}`
        });
    }

    const columns = [
        {
            title: "课程编号",
            dataIndex: "id",
            key: "id",
            width: 100
        },
        {
            title: "课程名称",
            dataIndex: "course_name",
            key: "course_name"
        },
        {
            title: "课程类型",
            dataIndex: "course_type",
            key: "course_type",
            width: 130
        },
        {
            title: "对应班次",
            dataIndex: "class_name",
            key: "class_name",
            width: 150
        },
        {
            title: "总课时",
            dataIndex: "class_hour",
            key: "class_hour",
            width: 100
        },
        {
            title: "课程状态",
            dataIndex: "status",
            key: "status",
            width: 110,
            render: (val) => val === 1 ? "已启用" : "未启用"
        },
        {
            title: "创建时间",
            dataIndex: "create_time",
            key: "create_time",
            width: 170,
            // 时间格式化
            render: (time) => time ? dayjs(time).format("YYYY-MM-DD HH:mm:ss") : "-"
        },
        {
            title: "操作",
            key: "action",
            width: 120,
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => { navToDetail(record.course_name) }}>查看详情</Button>
                </Space>
            )
        }
    ];

    // 封装数据拉取函数，方便手动刷新
    const fetchMyTrainData = () => {
        setLoading(true);
        const userId = InfomationSystem.getCurrentLoginInfo().accountId;
        // 根据用户ID获取所有报名记录
        InfomationSystem.trainGetEnrollByUserOper(userId, (res) => {
            DebugTool.debugLog("前端培训-我的培训：获取用户报名记录回调：" + JSON.stringify(res));
            setLoading(false);
            // 无报名数据直接清空列表
            if (!res || Object.keys(res).length === 0) {
                setTrainingList([]);
                return;
            }
            const enrollArr = Array.isArray(res) ? res : Object.values(res);
            const finalList = [];
            let finishCount = 0;
            const totalCount = enrollArr.length;
            const backErr = InfomationSystem.getBackError();

            enrollArr.forEach(enrollItem => {
                // =========修复1：参数传错，改用班次id查询班次信息=========
                const targetClassId = enrollItem.class_id;
                InfomationSystem.trainGetClassDetailOper(targetClassId, (classRes) => {
                    finishCount++;
                    // 班次接口失败直接跳过本条
                    if (classRes === backErr || !classRes?.course_id) {
                        DebugTool.debugLog(`班次${targetClassId}查询失败，跳过`);
                        if (finishCount === totalCount) setTrainingList(finalList);
                        return;
                    }
                    // 用班次内的course_id 查询课程（核心修复：之前传user_id）
                    const targetCourseId = classRes.course_id;
                    InfomationSystem.trainGetCourseDetailOper(targetCourseId, (courseRes) => {
                        // 课程接口失败直接跳过
                        if (courseRes === backErr) {
                            DebugTool.debugLog(`课程${targetCourseId}查询失败，跳过`);
                            if (finishCount === totalCount) setTrainingList(finalList);
                            return;
                        }
                        // 组装完整行数据
                        finalList.push({
                            id: courseRes.id,
                            course_name: courseRes.course_name,
                            course_type: courseRes.course_type,
                            class_hour: courseRes.class_hour,
                            status: courseRes.status,
                            create_time: courseRes.create_time,
                            class_name: classRes.class_name
                        });
                        // 全部请求完成后更新表格
                        if (finishCount === totalCount) {
                            setTrainingList([...finalList]);
                        }
                    });
                });
            });
        });
    };

    // 页面加载/刷新触发请求
    useEffect(() => {
        fetchMyTrainData();
    }, [refresh]);

    // 手动刷新按钮（补充，方便用户刷新）
    const handleRefresh = () => setRefresh(!refresh);

    return (
        <Layout style={{ padding: 16 }}>
            <Content style={{ background: "#fff" }}>
                <Space style={{ marginBottom: 16 }}>
                    <Button onClick={handleRefresh}>刷新我的培训</Button>
                </Space>
                <Spin spinning={loading}>
                    <Table
                        rowKey="id"
                        dataSource={trainingList}
                        columns={columns}
                        pagination={{ pageSize: 10 }}
                    />
                </Spin>
            </Content>
        </Layout>
    );
}

export default MyTrainingList;