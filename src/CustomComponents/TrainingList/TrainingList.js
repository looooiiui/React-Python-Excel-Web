import { useEffect, useState } from "react";
import { Layout, Table, Button, Modal, Form, Input, InputNumber, Select, Space, message } from "antd";
import dayjs from "dayjs";
import { DebugTool } from "../../Util/DebugTool/DebugTool";
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem";

const { Content } = Layout;
const { TextArea } = Input;

function TrainingList() {
    const [trainingList, setTrainingList] = useState([]);
    const [refresh, setRefresh] = useState(false);
    // 全部班次下拉数据源
    const [classOptionList, setClassOptionList] = useState([]);

    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState("add");
    const [currentTrain, setCurrentTrain] = useState(null);
    const [form] = Form.useForm();

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
            width: 170
        },
        {
            title: "操作",
            key: "action",
            width: 260,
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => message.info("详情弹窗待开发")}>查看详情</Button>
                    <Button onClick={() => handleEdit(record)}>编辑</Button>
                    <Button danger onClick={() => deleteTrain(record.id)}>删除课程</Button>
                </Space>
            )
        }
    ];

    // 加载全部班次用于下拉选择
    const loadAllClassOptions = () => {
        InfomationSystem.trainGetAllClassOper((res) => {
            DebugTool.debugLog("前端培训：加载全部班次下拉数据：" + JSON.stringify(res));
            if (!res) return;
            const arr = Array.isArray(res) ? res : Object.values(res);
            const options = arr.map(item => ({
                value: item.id,
                label: item.class_name
            }));
            setClassOptionList(options);
        });
    };

    // 加载课程列表 + 班次下拉
    useEffect(() => {
        const fetchCourse = () => {
            InfomationSystem.trainGetAllCourseOper((res) => {
                DebugTool.debugLog("前端培训-管理员列表：获取全部课程回调：" + JSON.stringify(res));
                if (!res) {
                    setTrainingList([]);
                    return;
                }
                const useList = Object.entries(res).map(([id, info]) => ({
                    id,
                    ...info
                }));
                setTrainingList(useList);
            });
        };
        fetchCourse();
        loadAllClassOptions();
    }, [refresh]);

    // 删除课程
    function deleteTrain(trainId) {
        InfomationSystem.trainDeleteCourseOper(trainId, (result) => {
            DebugTool.debugLog("前端培训-删除课程返回: " + JSON.stringify(result));
            if (result.code === "0") {
                setRefresh(prev => !prev);
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

    // 表单提交
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

            if (modalType === "add") {
                InfomationSystem.trainAddCourseOper(params, (res) => {
                    if (res.code === "0") {
                        message.success("新增课程成功");
                        setOpenModal(false);
                        setRefresh(p => !p);
                    } else if (res.code === "2") {
                        message.warning("课程名称已存在");
                    } else {
                        message.error("新增课程失败");
                    }
                });
            } else {
                InfomationSystem.trainUpdateCourseOper(currentTrain.id, params, (res) => {
                    if (res.code === "0") {
                        message.success("编辑课程成功");
                        setOpenModal(false);
                        setRefresh(p => !p);
                    } else if (res.code === "2") {
                        message.warning("课程名称已存在");
                    } else {
                        message.error("编辑课程失败");
                    }
                });
            }
        } catch (err) {
            DebugTool.debugLog("表单校验失败：" + err);
        }
    };

    return (
        <Layout style={{ padding: 16 }}>
            <Content style={{ background: "#fff" }}>
                <div style={{ marginBottom: 16, textAlign: "right" }}>
                    <Button type="primary" onClick={handleAdd}>新增课程</Button>
                </div>

                <Table
                    rowKey="id"
                    dataSource={trainingList}
                    columns={columns}
                    bordered
                    pagination={{ pageSize: 10 }}
                />

                <Modal
                    title={modalType === "add" ? "新增培训课程" : "编辑培训课程"}
                    open={openModal}
                    onCancel={() => setOpenModal(false)}
                    onOk={handleSubmit}
                    maskClosable={false}
                    width={580}
                >
                    <Form form={form} layout="vertical" initialValues={{ status: "1" }}>
                        <Form.Item
                            name="course_name"
                            label="课程名称"
                            rules={[{ required: true, message: "请输入课程名称" }]}
                        >
                            <Input placeholder="请输入课程名称" />
                        </Form.Item>

                        <Form.Item
                            name="course_type"
                            label="课程类型"
                            rules={[{ required: true, message: "请输入课程类型" }]}
                        >
                            <Input placeholder="例如：技术培训、安全考核" />
                        </Form.Item>

                        <Form.Item
                            name="class_hour"
                            label="总课时"
                            rules={[{ required: true, message: "请输入课时" }]}
                        >
                            <InputNumber min={1} style={{ width: "100%" }} placeholder="填写数字课时" />
                        </Form.Item>

                        {/* 新增：关联开课班次下拉（纯展示筛选，不提交后端） */}
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
                            />
                        </Form.Item>

                        <Form.Item
                            name="course_desc"
                            label="课程简介"
                            rules={[{ required: true, message: "请输入课程简介" }]}
                        >
                            <TextArea rows={3} placeholder="简单描述课程内容、学习目标" />
                        </Form.Item>

                        <Form.Item
                            name="course_file"
                            label="课程附件地址"
                        >
                            <Input placeholder="培训资料文件链接，无则留空" />
                        </Form.Item>

                        <Form.Item
                            name="status"
                            label="课程启用状态"
                            rules={[{ required: true, message: "请选择状态" }]}
                        >
                            <Select placeholder="请选择状态">
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