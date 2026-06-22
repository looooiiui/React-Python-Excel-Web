import { useEffect, useState } from "react";
import axios from "axios";
// AntD 组件引入
import { Layout, Table, Button, Modal, Form, Input, DatePicker, Select, Space, message } from "antd";
import dayjs from "dayjs";

// 自定义工具引入
import { DebugTool } from "../../Util/DebugTool/DebugTool";
import CONSTPARAM from "../../Core/CONST/CONST";
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem";

const { Content } = Layout;
const { TextArea } = Input;

// 全部项目管理列表（管理员版：新增/编辑/删除/加入）
function ProjectionList() {
    // 项目列表数据
    const [projectionList, setProjectionList] = useState([]);
    // 项目加入状态映射
    const [joinStateMap, setJoinStateMap] = useState({});
    // 刷新标记
    const [refresh, setRefresh] = useState(false);

    // 弹窗控制：新增 / 编辑
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState("add"); // add 新增 | edit 编辑
    const [currentProject, setCurrentProject] = useState(null); // 当前编辑项
    // 表单实例
    const [form] = Form.useForm();

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
            width: 320,
            render: (_, record) => {
                const state = joinStateMap[record.id];
                return (
                    <Space size="middle">
                        {/* 加入项目按钮 */}
                        <Button
                            type="primary"
                            disabled={state !== "0"}
                            onClick={() => joinProjection(record.id)}
                        >
                            加入项目
                        </Button>
                        {/* 编辑按钮 */}
                        <Button onClick={() => handleEdit(record)}>编辑</Button>
                        {/* 删除项目按钮 */}
                        <Button danger onClick={() => deleteProjection(record.id)}>删除项目</Button>
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

    // 删除项目
    function deleteProjection(projectId) {
        InfomationSystem.deleteProjectOper(projectId, (result) => {
            DebugTool.debugLog("前端删除项目返回: " + JSON.stringify(result));
            setRefresh((prev) => !prev);
            message.success("项目删除成功");
        });
    }

    // 打开新增弹窗
    function handleAdd() {
        setModalType("add");
        setCurrentProject(null);
        form.resetFields();
        setOpenModal(true);
    }

    // 打开编辑弹窗
    function handleEdit(record) {
        setModalType("edit");
        setCurrentProject(record);
        // 回填表单数据
        form.setFieldsValue({
            project_name: record.project_name,
            tech_stack: record.tech_stack,
            start_time: dayjs(record.start_time),
            end_time: dayjs(record.end_time),
            status: String(record.status)
        });
        setOpenModal(true);
    }

    // 表单提交: 新增 / 编辑
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            // 日期转字符串
            const params = {
                project_name: values.project_name,
                tech_stack: values.tech_stack,
                start_time: values.start_time.format("YYYY-MM-DD"),
                end_time: values.end_time.format("YYYY-MM-DD"),
                status: values.status
            };

            if (modalType === "add") {
                // 新增项目
                InfomationSystem.sendAddProjectOper(params, (res) => {
                    if (res.data === "0") {
                        message.success("新增项目成功");
                        setOpenModal(false);
                        setRefresh((prev) => !prev);
                    } else if (res.data === "2") {
                        message.warning("项目名称已存在");
                    } else {
                        message.error("新增项目失败");
                    }
                });
            } else {
                // 编辑项目
                params.project_id = currentProject.id;
                InfomationSystem.sendEditProjectOper(params, (res) => {
                    if (res.data === "0") {
                        message.success("编辑项目成功");
                        setOpenModal(false);
                        setRefresh((prev) => !prev);
                    } else if (res.data === "2") {
                        message.warning("项目名称已存在");
                    } else {
                        message.error("编辑项目失败");
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
                {/* 顶部操作栏 */}
                <div style={{ marginBottom: 16, textAlign: "right" }}>
                    <Button type="primary" onClick={handleAdd}>新增项目</Button>
                </div>

                {/* 项目表格 */}
                <Table
                    rowKey="id"
                    dataSource={projectionList}
                    columns={columns}
                    bordered
                    pagination={{ pageSize: 10 }}
                />

                {/* 新增/编辑弹窗 */}
                <Modal
                    title={modalType === "add" ? "新增项目" : "编辑项目"}
                    open={openModal}
                    onCancel={() => setOpenModal(false)}
                    onOk={handleSubmit}
                    maskClosable={false}
                    width={520}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{ status: "0" }}
                    >
                        <Form.Item
                            name="project_name"
                            label="项目名称"
                            rules={[{ required: true, message: "请输入项目名称" }]}
                        >
                            <Input placeholder="请输入项目名称" />
                        </Form.Item>

                        <Form.Item
                            name="tech_stack"
                            label="技术栈"
                            rules={[{ required: true, message: "请输入技术栈" }]}
                        >
                            <TextArea rows={3} placeholder="例如:React + Flask + MySQL" />
                        </Form.Item>

                        <Form.Item
                            name="start_time"
                            label="起始时间"
                            rules={[{ required: true, message: "请选择起始时间" }]}
                        >
                            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                        </Form.Item>

                        <Form.Item
                            name="end_time"
                            label="终止时间"
                            rules={[{ required: true, message: "请选择终止时间" }]}
                        >
                            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                        </Form.Item>

                        <Form.Item
                            name="status"
                            label="项目状态"
                            rules={[{ required: true, message: "请选择项目状态" }]}
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

export default ProjectionList;