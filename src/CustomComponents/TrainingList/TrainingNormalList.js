import { useEffect, useState } from "react";
import { Layout, Table, Button, Space, message, Modal, Form, Select, Spin } from "antd";
import dayjs from "dayjs";
import { DebugTool } from "../../Util/DebugTool/DebugTool";
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem";

const { Content } = Layout;

function TrainingNormalList() {
    const [trainingList, setTrainingList] = useState([]);
    const [signMap, setSignMap] = useState({});
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [classOptions, setClassOptions] = useState([]);
    const [classListCache, setClassListCache] = useState(null); // 缓存班次下拉，避免重复请求

    const loginUserId = InfomationSystem.getCurrentLoginInfo().accountId;
    const BACK_ERR = InfomationSystem.getBackError();
    const [signModalOpen, setSignModalOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [signForm] = Form.useForm();

    // 加载全部班次下拉（带缓存，只请求一次）
    const loadClassOptions = () => {
        // 存在缓存直接复用，不重复请求
        if (classListCache) {
            setClassOptions(classListCache);
            return;
        }
        InfomationSystem.trainGetAllClassOper((res) => {
            if (!res || res === BACK_ERR) return;
            const arr = Array.isArray(res) ? res : Object.values(res);
            const opts = arr.map(item => ({
                value: Number(item.id),
                label: item.class_name
            }));
            setClassOptions(opts);
            setClassListCache(opts); // 存入缓存
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
            width: 170,
            render: (time) => time ? dayjs(time).format("YYYY-MM-DD HH:mm:ss") : "-"
        },
        {
            title: "操作",
            key: "action",
            width: 220,
            render: (_, record) => {
                const signed = !!signMap[Number(record.id)];
                const isClose = record.status !== 1;
                return (
                    <Space size="middle">
                        <Button onClick={() => message.info(`课程${record.id}详情弹窗待开发`)}>查看详情</Button>
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

    // 提交报名（精简传参，只传后端需要字段）
    const submitSign = () => {
        signForm.validateFields()
            .then(values => {
                const enrollParams = {
                    user_id: loginUserId,
                    class_id: values.class_id,
                    audit_status: "0",
                    remark: ""
                };
                InfomationSystem.trainAddEnrollOper(enrollParams, (res) => {
                    DebugTool.debugLog("前端培训-报名回调：" + JSON.stringify(res));
                    // 后端成功标识 code=0
                    if (res?.success && res.code === "0") {
                        // 本地标记已报名，不用重新拉取全部数据
                        setSignMap(prev => ({ ...prev, [Number(currentCourse.id)]: true }));
                        setSignModalOpen(false);
                        message.success("课程报名成功");
                    } else {
                        message.error("报名失败，请检查所选班次是否存在");
                    }
                });
            })
            .catch(err => {
                DebugTool.debugLog("报名表单校验失败：" + err);
            });
    };

    // 拉取课程列表 + 用户报名记录
    const fetchAllData = () => {
        setLoading(true);
        // 1. 拉取全部课程
        InfomationSystem.trainGetAllCourseOper((courseRes) => {
            if (!courseRes || courseRes === BACK_ERR) {
                setTrainingList([]);
                setLoading(false);
                return;
            }
            const courseList = Object.entries(courseRes).map(([id, info]) => ({ id: Number(id), ...info }));
            setTrainingList(courseList);

            // 2. 拉取当前用户所有报名记录，反向匹配课程ID
            InfomationSystem.trainGetEnrollByUserOper(loginUserId, (enrollRes) => {
                setLoading(false);
                const signObj = {};
                if (!enrollRes || enrollRes === BACK_ERR) {
                    setSignMap({});
                    return;
                }
                const arr = Array.isArray(enrollRes) ? enrollRes : Object.values(enrollRes);
                let asyncCount = 0;
                const total = arr.length;

                if (total === 0) {
                    setSignMap({});
                    return;
                }

                arr.forEach(enrollItem => {
                    // 报名只有class_id，必须查班次拿course_id
                    const targetClassId = Number(enrollItem.class_id);
                    InfomationSystem.trainGetClassDetailOper(targetClassId, (classRes) => {
                        asyncCount++;
                        // 班次查询失败跳过本条
                        if (!classRes || classRes === BACK_ERR) {
                            if (asyncCount === total) setSignMap({ ...signObj });
                            return;
                        }
                        const courseId = Number(classRes.course_id);
                        signObj[courseId] = true;
                        // 所有报名解析完成后更新已报名标记
                        if (asyncCount === total) {
                            setSignMap({ ...signObj });
                        }
                    });
                });
            });
        });
    };

    // 页面加载/手动刷新触发
    useEffect(() => {
        fetchAllData();
        // 清除班次缓存，切换用户后重新拉取班次
        setClassListCache(null);
    }, [refresh, loginUserId]);

    // 手动刷新按钮
    const handleRefresh = () => setRefresh(!refresh);

    return (
        <Layout style={{ padding: 16 }}>
            <Content style={{ background: "#fff" }}>
                <Space style={{ marginBottom: 16 }}>
                    <Button onClick={handleRefresh}>刷新课程&报名状态</Button>
                </Space>
                <Spin spinning={loading}>
                    <Table
                        rowKey="id"
                        dataSource={trainingList}
                        columns={columns}
                        pagination={{ pageSize: 10 }}
                    />
                </Spin>

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