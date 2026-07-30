import { useEffect, useState, useRef } from "react";
import { Layout, Table, Button, Modal, Form, Input, DatePicker, Select, Space, message, Spin } from "antd";
import dayjs                    from "dayjs";
import { DebugTool }            from "../../Util/DebugTool/DebugTool";
import { InfomationSystem }     from "../../InfomationSystem/InfomationSystem";

const { Content } = Layout;
const { TextArea } = Input;

function TrainClassList() {
    const [classList, setClassList] = useState([]);
    const [courseOptions, setCourseOptions] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const courseCacheRef = useRef(null); // 课程下拉缓存，不触发重渲染

    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState("add");
    const [currentClass, setCurrentClass] = useState(null);
    const [form] = Form.useForm();
    const BACK_ERR = InfomationSystem.getBackError();

    // 表格列定义
    const columns = [
        {
            title: "班次ID",
            dataIndex: "id",
            width: 90
        },
        {
            title: "班次名称",
            dataIndex: "class_name"
        },
        {
            title: "所属课程",
            dataIndex: "course_id",
            render: (cid) => {
                const target = courseOptions.find(item => item.value === Number(cid));
                return target?.label || "未知课程";
            },
            width: 160
        },
        {
            title: "培训类型",
            dataIndex: "train_type",
            width: 130
        },
        {
            title: "开班时间",
            dataIndex: "start_time",
            width: 120,
            render: (time) => time ? dayjs(time).format("YYYY-MM-DD") : "-"
        },
        {
            title: "结束时间",
            dataIndex: "end_time",
            width: 120,
            render: (time) => time ? dayjs(time).format("YYYY-MM-DD") : "-"
        },
        {
            title: "培训地点",
            dataIndex: "address",
            width: 140
        },
        {
            title: "状态",
            dataIndex: "status",
            render: (v) => v === 1 ? "正常开班" : "停用",
            width: 100
        },
        {
            title: "操作",
            width: 240,
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => message.info(`班次${record.id}详情待开发`)}>查看</Button>
                    <Button onClick={() => handleEdit(record)} disabled={submitLoading}>编辑</Button>
                    <Button danger onClick={() => deleteClass(record.id)} disabled={submitLoading}>删除</Button>
                </Space>
            )
        }
    ];

    // 加载全部课程下拉（带缓存，仅首次请求）
    const loadCourseOptions = () => {
        if (courseCacheRef.current) {
            setCourseOptions(courseCacheRef.current);
            return;
        }
        InfomationSystem.trainGetAllCourseOper((res) => {
            if (!res || res === BACK_ERR) return;
            const arr = Array.isArray(res) ? res : Object.values(res);
            const opts = arr.map(item => ({
                value: Number(item.id),
                label: item.course_name
            }));
            setCourseOptions(opts);
            courseCacheRef.current = opts;
        });
    };

    // 加载班次列表
    const loadClassData = () => {
        setPageLoading(true);
        InfomationSystem.trainGetAllClassOper((res) => {
            setPageLoading(false);
            DebugTool.debugLog("前端班次管理：加载全部班次：" + JSON.stringify(res));
            if (!res || res === BACK_ERR) {
                setClassList([]);
                return;
            }
            // 统一转数字ID，消除字符串匹配bug
            const list = Object.entries(res).map(([strId, info]) => ({
                id: Number(strId),
                ...info
            }));
            setClassList(list);
        });
    };

    // 全局刷新，重置缓存+重新拉取数据
    const refreshAllData = () => {
        courseCacheRef.current = null;
        setRefresh(prev => !prev);
    };

    useEffect(() => {
        loadClassData();
        loadCourseOptions();
    }, [refresh]);

    // 删除班次
    const deleteClass = (classId) => {
        setSubmitLoading(true);
        InfomationSystem.trainDeleteClassOper(classId, (res) => {
            setSubmitLoading(false);
            DebugTool.debugLog("删除班次返回：" + JSON.stringify(res));
            if (res?.code === "0") {
                refreshAllData();
                message.success("班次删除成功");
            } else {
                message.error("删除失败");
            }
        });
    };

    // 打开新增弹窗
    const handleAdd = () => {
        setModalType("add");
        setCurrentClass(null);
        form.resetFields();
        setOpenModal(true);
    };

    // 编辑班次回填
    const handleEdit = (record) => {
        setModalType("edit");
        setCurrentClass(record);
        form.setFieldsValue({
            class_name: record.class_name,
            course_id: Number(record.course_id),
            train_type: record.train_type,
            start_time: dayjs(record.start_time),
            end_time: dayjs(record.end_time),
            address: record.address,
            manager_id: record.manager_id,
            remark: record.remark,
            status: String(record.status)
        });
        setOpenModal(true);
    };

    // 新增/编辑共用提交逻辑
    const submitClassRequest = (params, targetId = null) => {
        setSubmitLoading(true);
        const successCallback = () => {
            setSubmitLoading(false);
            setOpenModal(false);
            refreshAllData();
        };

        if (modalType === "add") {
            InfomationSystem.trainAddClassOper(params, (res) => {
                if (res?.code === "0") {
                    message.success("新增班次成功");
                    successCallback();
                } else if (res?.code === "2") {
                    setSubmitLoading(false);
                    message.warning("班次名称重复");
                } else {
                    setSubmitLoading(false);
                    message.error("新增班次失败");
                }
            });
        } else {
            InfomationSystem.trainUpdateClassOper(targetId, params, (res) => {
                if (res?.code === "0") {
                    message.success("编辑班次成功");
                    successCallback();
                } else if (res?.code === "2") {
                    setSubmitLoading(false);
                    message.warning("班次名称重复");
                } else {
                    setSubmitLoading(false);
                    message.error("编辑班次失败");
                }
            });
        }
    };

    // 表单提交入口
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const params = {
                class_name: values.class_name,
                course_id: values.course_id,
                train_type: values.train_type,
                start_time: values.start_time.format("YYYY-MM-DD"),
                end_time: values.end_time.format("YYYY-MM-DD"),
                address: values.address,
                manager_id: values.manager_id,
                remark: values.remark,
                status: values.status
            };
            submitClassRequest(params, currentClass?.id);
        } catch (err) {
            DebugTool.debugLog("班次表单校验失败：" + err);
        }
    };

    return (
        <Layout style={{ padding: 16 }}>
            <Content style={{ background: "#fff" }}>
                <div style={{ marginBottom: 16, textAlign: "right", display: "flex", gap: 12, justifyContent: "flex-end" }}>
                    <Button onClick={refreshAllData}>刷新班次列表</Button>
                    <Button type="primary" onClick={handleAdd}>新建培训班次</Button>
                </div>

                <Spin spinning={pageLoading}>
                    <Table
                        rowKey="id"
                        dataSource={classList}
                        columns={columns}
                        pagination={{ pageSize: 10 }}
                    />
                </Spin>

                <Modal
                    title={modalType === "add" ? "新建培训班次" : "编辑培训班次"}
                    open={openModal}
                    onCancel={() => setOpenModal(false)}
                    onOk={handleSubmit}
                    maskClosable={false}
                    width={620}
                    confirmLoading={submitLoading}
                >
                    <Form form={form} layout="vertical" initialValues={{ status: "1" }}>
                        <Form.Item name="class_name" label="班次名称" rules={[{ required: true, message: "请填写班次名称" }]}>
                            <Input placeholder="例如：React开发第1期" disabled={submitLoading} />
                        </Form.Item>

                        <Form.Item name="course_id" label="所属课程" rules={[{ required: true, message: "请选择绑定课程" }]}>
                            <Select options={courseOptions} placeholder="选择该班次对应的课程" disabled={submitLoading} />
                        </Form.Item>

                        <Form.Item name="train_type" label="培训类型" rules={[{ required: true, message: "请填写培训类型" }]}>
                            <Input placeholder="线下实训 / 线上直播" disabled={submitLoading} />
                        </Form.Item>

                        <div style={{ display: "flex", gap: 16 }}>
                            <Form.Item name="start_time" label="开班时间" rules={[{ required: true }]} style={{ flex: 1 }}>
                                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" disabled={submitLoading} />
                            </Form.Item>
                            <Form.Item name="end_time" label="结束时间" rules={[{ required: true }]} style={{ flex: 1 }}>
                                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" disabled={submitLoading} />
                            </Form.Item>
                        </div>

                        <Form.Item name="address" label="培训地点" rules={[{ required: true }]}>
                            <Input placeholder="线下填写教室，线上填平台地址" disabled={submitLoading} />
                        </Form.Item>

                        <Form.Item name="manager_id" label="负责人ID">
                            <Input placeholder="管理该班次的用户账号ID，无则留空" disabled={submitLoading} />
                        </Form.Item>

                        <Form.Item name="remark" label="备注说明">
                            <TextArea rows={2} placeholder="班次补充说明" disabled={submitLoading} />
                        </Form.Item>

                        <Form.Item name="status" label="班次状态" rules={[{ required: true }]}>
                            <Select disabled={submitLoading}>
                                <Select.Option value="0">停用</Select.Option>
                                <Select.Option value="1">正常开班</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </Content>
        </Layout>
    );
}

export default TrainClassList;