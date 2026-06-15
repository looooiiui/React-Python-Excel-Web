import { useEffect, useState } from "react";
import { Layout, Table, Space, Button, message } from "antd";
import dayjs from "dayjs";
import { DebugTool } from "../../Util/DebugTool/DebugTool";
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem";

const { Content } = Layout;

function MyTrainingList() {
    const [trainingList, setTrainingList] = useState([]);
    const [refresh, setRefresh] = useState(false);

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
            width: 170
        },
        {
            title: "操作",
            key: "action",
            width: 120,
            render: () => (
                <Space size="middle">
                    <Button onClick={() => message.info("详情弹窗待开发")}>查看详情</Button>
                </Space>
            )
        }
    ];

    useEffect(() => {
        const userId = InfomationSystem.getCurrentLoginInfo().accountId;
        InfomationSystem.trainGetEnrollByUserOper(userId, (res) => {
            DebugTool.debugLog("前端培训-我的培训：获取用户报名记录回调：" + JSON.stringify(res));
            if (!res || res.length === 0) {
                setTrainingList([]);
                return;
            }
            const enrollArr = Array.isArray(res) ? res : Object.values(res);
            // 组装课程+班次名称
            const finalList = [];
            let finishCount = 0;
            const totalCount = enrollArr.length;

            enrollArr.forEach(enrollItem => {
                // 根据课程ID拿课程信息
                InfomationSystem.trainGetCourseDetailOper(enrollItem.course_id, (courseRes) => {
                    // 根据班次ID拿班次名称
                    InfomationSystem.trainGetClassDetailOper(enrollItem.class_id, (classRes) => {
                        finishCount++;
                        if (courseRes && classRes) {
                            finalList.push({
                                id: courseRes.id,
                                course_name: courseRes.course_name,
                                course_type: courseRes.course_type,
                                class_hour: courseRes.class_hour,
                                status: courseRes.status,
                                create_time: courseRes.create_time,
                                class_name: classRes.class_name
                            });
                        }
                        if (finishCount === totalCount) {
                            setTrainingList(finalList);
                        }
                    });
                });
            });
        });
    }, [refresh]);

    return (
        <Layout style={{ padding: 16 }}>
            <Content style={{ background: "#fff" }}>
                <Table
                    rowKey="id"
                    dataSource={trainingList}
                    columns={columns}
                    bordered
                    pagination={{ pageSize: 10 }}
                />
            </Content>
        </Layout>
    );
}

export default MyTrainingList;