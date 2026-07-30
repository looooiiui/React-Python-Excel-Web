import { useEffect, useState, useRef } from "react";
import { Layout, Table, Button, Modal, Form, Input, InputNumber, Select, Space, message, Spin } from "antd";
import { useNavigate }  from "react-router-dom";
import dayjs            from "dayjs";

//=========================自定义工具============================
import { DebugTool }            from "../../Util/DebugTool/DebugTool";
import { InfomationSystem }     from "../../InfomationSystem/InfomationSystem";
import CONSTPARAM               from "../../Core/CONST/CONST";

const { Content } = Layout;
const { TextArea } = Input;

function TrainingList() {
    const [trainingList, setTrainingList] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    // 全部班次下拉数据源 + 缓存
    const [classOptionList, setClassOptionList] = useState([]);
    const classCacheRef = useRef(null); // useRef缓存，不触发重渲染

    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState("add");
    const [currentTrain, setCurrentTrain] = useState(null);
    const [form] = Form.useForm();
    const BACK_ERR = InfomationSystem.getBackError();

    const navigate = useNavigate();

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
            title: "课时",
            dataIndex: "class_hour",
            key: "class_hour",
            width: 90
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
            render: (time) => time ? dayjs(time).format("YYYY-MM-DD HH:mm:ss") : "-"
        },
        {
            title: "操作",
            key: "action",
            width: 260,
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => { navToDetail(record.course_name) }}>查看详情</Button>
                    <Button onClick={() => handleEdit(record)}>编辑</Button>
                    <Button danger onClick={() => deleteTrain(record.id)}>删除课程</Button>
                </Space>
            )
        }
    ];

    // 加载全部班次用于下拉选择（带缓存，只请求一次）
    const loadAllClassOptions = () => {
        if (classCacheRef.current) {
            setClassOptionList(classCacheRef.current);
            return;
        }
        InfomationSystem.trainGetAllClassOper((res) => {
            DebugTool.debugLog("前端培训：加载全部班次下拉数据：" + JSON.stringify(res));
            if (!res || res === BACK_ERR) return;
            const arr = Array.isArray(res) ? res : Object.values(res);
            const options = arr.map(item => ({
                value: Number(item.id),
                label: item.class_name
            }));
            setClassOptionList(options);
            classCacheRef.current = options;
        });
    };

    // 拉取课程列表
    const fetchCourseList = () => {
        setLoading(true);
        InfomationSystem.trainGetAllCourseOper((res) => {
            setLoading(false);
            DebugTool.debugLog("前端培训-管理员列表：获取全部课程回调：" + JSON.stringify(res));
            if (!res || res === BACK_ERR) {
                setTrainingList([]);
                return;
            }
            // 统一转数字id，规避字符串key问题
            const useList = Object.entries(res).map(([strId, info]) => ({
                id: Number(strId),
                ...info
            }));
            setTrainingList(useList);
        });
    };

    // 页面初始化/刷新
    useEffect(() => {
        fetchCourseList();
        loadAllClassOptions();
    }, [refresh]);

    // 手动刷新按钮
    const handleRefreshAll = () => {
        setRefresh(prev => !prev);
    };

    // 删除课程
    function deleteTrain(trainId) {
        setSubmitLoading(true);
        InfomationSystem.trainDeleteCourseOper(trainId, (result) => {
            setSubmitLoading(false);
            DebugTool.debugLog("前端培训-删除课程返回: " + JSON.stringify(result));
            if (result?.code === "0") {
                handleRefreshAll();
                message.success("课程删除成功");
            } else {
                message.error("删除失败");
            }
        });
    }

    // 打开新增弹窗
    function handleAdd() {
        setModalType("add");
        setCurrentTrain(null);
        form.resetFields();
        setOpenModal(true);
    }

    // 打开编辑弹窗回填数据
    function handleEdit(record) {
        setModalType("edit");
        setCurrentTrain(record);
        form.setFieldsValue({
            course_name: record.course_name,
            course_type: record.course_type,
            class_hour: record.class_hour,
            course_desc: record.course_desc,
            course_file: record.course_file,
            status: String(record.status)
        });
        setOpenModal(true);
    }

    // 统一提交逻辑（新增/编辑复用）
    const submitCourseData = (params, courseId = null) => {
        setSubmitLoading(true);
        const successCallback = () => {
            setSubmitLoading(false);
            setOpenModal(false);
            handleRefreshAll();
        };
        if (modalType === "add") {
            InfomationSystem.trainAddCourseOper(params, (res) => {
                if (res?.code === "0") {
                    message.success("新增课程成功");
                    successCallback();
                } else if (res?.code === "2") {
                    setSubmitLoading(false);
                    message.warning("课程名称已存在");
                } else {
                    setSubmitLoading(false);
                    message.error("新增课程失败");
                }
            });
        } else {
            InfomationSystem.trainUpdateCourseOper(courseId, params, (res) => {
                if (res?.code === "0") {
                    message.success("编辑课程成功");
                    successCallback();
                } else if (res?.code === "2") {
                    setSubmitLoading(false);
                    message.warning("课程名称已存在");
                } else {
                    setSubmitLoading(false);
                    message.error("编辑课程失败");
                }
            });
        }
    };

    // 表单提交入口
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const params = {
                course_name: values.course_name,
                course_type: values.course_type,
                class_hour: values.class_hour,
                course_desc: values.course_desc,
                course_file: values.course_file,
                status: values.status
            };
            submitCourseData(params, currentTrain?.id);
        } catch (err) {
            DebugTool.debugLog("表单校验失败：" + err);
        }
    };

    return (
        <Layout style={{ padding: 16 }}>
            <Content style={{ background: "#fff" }}>
                <div style={{ marginBottom: 16, textAlign: "right", display: "flex", gap: 12, justifyContent: "flex-end" }}>
                    <Button onClick={handleRefreshAll}>刷新课程列表</Button>
                    <Button type="primary" onClick={handleAdd}>新增课程</Button>
                </div>

                <Spin spinning={loading}>
                    <Table
                        rowKey="id"
                        dataSource={trainingList}
                        columns={columns}
                        pagination={{ pageSize: 10 }}
                    />
                </Spin>

                <Modal
                    title={modalType === "add" ? "新增培训课程" : "编辑培训课程"}
                    open={openModal}
                    onCancel={() => setOpenModal(false)}
                    onOk={handleSubmit}
                    maskClosable={false}
                    width={580}
                    confirmLoading={submitLoading}
                >
                    <Form form={form} layout="vertical" initialValues={{ status: "1" }}>
                        <Form.Item
                            name="course_name"
                            label="课程名称"
                            rules={[{ required: true, message: "请输入课程名称" }]}
                        >
                            <Input placeholder="请输入课程名称" disabled={submitLoading} />
                        </Form.Item>

                        <Form.Item
                            name="course_type"
                            label="课程类型"
                            rules={[{ required: true, message: "请输入课程类型" }]}
                        >
                            <Input placeholder="例如：技术培训、安全考核" disabled={submitLoading} />
                        </Form.Item>

                        <Form.Item
                            name="class_hour"
                            label="总课时"
                            rules={[{ required: true, message: "请输入课时" }]}
                        >
                            <InputNumber min={1} style={{ width: "100%" }} placeholder="填写数字课时" disabled={submitLoading} />
                        </Form.Item>

                        <Form.Item
                            label="关联开课班次"
                            extra="仅用于查看当前课程下属班次，班次需在班次管理页面新增"
                        >
                            <Select
                                placeholder="查看该课程对应班次"
                                options={classOptionList}
                                mode="multiple"
                                disabled
                                style={{ width: "100%" }}
                                value={[]}
                            />
                        </Form.Item>

                        <Form.Item
                            name="course_desc"
                            label="课程简介"
                            rules={[{ required: true, message: "请输入课程简介" }]}
                        >
                            <TextArea rows={3} placeholder="简单描述课程内容、学习目标" disabled={submitLoading} />
                        </Form.Item>

                        <Form.Item
                            name="course_file"
                            label="课程附件地址"
                        >
                            <Input placeholder="培训资料文件链接，无则留空" disabled={submitLoading} />
                        </Form.Item>

                        <Form.Item
                            name="status"
                            label="课程启用状态"
                            rules={[{ required: true, message: "请选择状态" }]}
                        >
                            <Select placeholder="请选择状态" disabled={submitLoading}>
                                <Select.Option value="0">未启用</Select.Option>
                                <Select.Option value="1">已启用</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </Content>
        </Layout>
    );
}

export default TrainingList;