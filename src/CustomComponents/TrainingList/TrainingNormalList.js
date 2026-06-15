import { useEffect, useState } from "react";
import { Layout, Table, Button, Space, message, Modal, Form, Select } from "antd";
import dayjs from "dayjs";
import { DebugTool } from "../../Util/DebugTool/DebugTool";
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem";

const { Content } = Layout;

function TrainingNormalList() {
    const [trainingList, setTrainingList] = useState([]);
    const [signMap, setSignMap] = useState({});
    const [refresh, setRefresh] = useState(false);
    const loginUserId = InfomationSystem.getCurrentLoginInfo().accountId;

    // 班次下拉
    const [classOptions, setClassOptions] = useState([]);
    // 报名弹窗控制
    const [signModalOpen, setSignModalOpen] = useState(false);
    // 当前待报名课程
    const [currentCourse, setCurrentCourse] = useState(null);
    const [signForm] = Form.useForm();

    // 加载全部班次下拉
    const loadClassOptions = () => {
        InfomationSystem.trainGetAllClassOper((res) => {
            if (!res) return;
            const arr = Array.isArray(res) ? res : Object.values(res);
            const opts = arr.map(item => ({
                value: item.id,
                label: item.class_name
            }));
            setClassOptions(opts);
        });
    };

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
            title: "课时",
            dataIndex: "class_hour",
            key: "class_hour",
            width: 90
        },
        {
            title: "状态",
            dataIndex: "status",
            key: "status",
            width: 110,
            render: (val) => val === 1 ? "可报名" : "未启用"
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
            width: 220,
            render: (_, record) => {
                const signed = signMap[record.id];
                const isClose = record.status !== 1;
                return (
                    <Space size="middle">
                        <Button onClick={() => message.info("详情弹窗待开发")}>查看详情</Button>
                        <Button
                            type="primary"
                            disabled={signed || isClose}
                            onClick={() => openSignModal(record)}
                        >
                            {signed ? "已报名" : "立即报名"}
                        </Button>
                    </Space>
                );
            }
        }
    ];

    // 打开报名弹窗
    const openSignModal = (course) => {
        setCurrentCourse(course);
        signForm.resetFields();
        setSignModalOpen(true);
        loadClassOptions();
    };

    // 提交报名
    const submitSign = async () => {
        try {
            const values = await signForm.validateFields();
            const enrollParams = {
                user_id: loginUserId,
                class_id: values.class_id,
                course_id: currentCourse.id,
                audit_status: "0",
                remark: ""
            };
            InfomationSystem.trainAddEnrollOper(enrollParams, (res) => {
                DebugTool.debugLog("前端培训-报名回调：" + JSON.stringify(res));
                if (res.code === "0") {
                    setSignMap(prev => ({ ...prev, [currentCourse.id]: true }));
                    setSignModalOpen(false);
                    message.success("课程报名成功");
                } else {
                    message.error("报名失败，请检查所选班次");
                }
            });
        } catch (err) {
            DebugTool.debugLog("报名表单校验失败：" + err);
        }
    };

    useEffect(() => {
        InfomationSystem.trainGetAllCourseOper((courseRes) => {
            DebugTool.debugLog("前端培训-普通用户列表：全部课程回调：" + JSON.stringify(courseRes));
            if (!courseRes) {
                setTrainingList([]);
                return;
            }
            const courseList = Object.entries(courseRes).map(([id, info]) => ({ id, ...info }));
            setTrainingList(courseList);

            // 加载本人报名记录
            InfomationSystem.trainGetEnrollByUserOper(loginUserId, (enrollRes) => {
                DebugTool.debugLog("前端培训-校验用户报名记录：" + JSON.stringify(enrollRes));
                const signObj = {};
                if (enrollRes) {
                    const arr = Array.isArray(enrollRes) ? enrollRes : Object.values(enrollRes);
                    arr.forEach(item => {
                        signObj[item.course_id] = true;
                    });
                }
                setSignMap(signObj);
            });
        });
    }, [refresh, loginUserId]);

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

                {/* 报名弹窗：班次下拉选择 */}
                <Modal
                    title={`报名课程：${currentCourse?.course_name || ""}`}
                    open={signModalOpen}
                    onCancel={() => setSignModalOpen(false)}
                    onOk={submitSign}
                    maskClosable={false}
                    width={460}
                >
                    <Form form={signForm} layout="vertical">
                        <Form.Item
                            name="class_id"
                            label="选择开课班次"
                            rules={[{ required: true, message: "请选择本次报名的班次" }]}
                        >
                            <Select
                                placeholder="下拉选择班次"
                                options={classOptions}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </Content>
        </Layout>
    );
}

export default TrainingNormalList;