import { useState, useEffect } from 'react';
import { Layout, Table, Button, Space, message, Spin, Modal, Form, Input, InputNumber, Select } from 'antd';
import dayjs from 'dayjs';
import { InfomationSystem } from '../../InfomationSystem/InfomationSystem';
import { DebugTool } from '../../Util/DebugTool/DebugTool';
import CONSTPARAM from '../../Core/CONST/CONST';
import ThemedButton from '../OverrideCom/OverrideButton/ThemeButton';

const { Content } = Layout;

function AccountLists() {
    const [accountList, setAccountList] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const BACK_ERR = InfomationSystem.getBackError();

    // 编辑弹窗状态
    const [editOpen, setEditOpen] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [currentEditRow, setCurrentEditRow] = useState(null);
    const [form] = Form.useForm();

    // 删除确认弹窗
    const [delOpen, setDelOpen] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [delAccountId, setDelAccountId] = useState("");

    // 表格列配置
    const columns = [
        {
            title: "账号ID(ACCOUNTID)",
            dataIndex: "ACCOUNTID",
            key: "ACCOUNTID",
            width: 130
        },
        {
            title: "用户名(NAME)",
            dataIndex: "NAME",
            key: "NAME"
        },
        {
            title: "管理员标识",
            dataIndex: "ADMIN",
            key: "ADMIN",
            width: 120,
            render: val => val === "1" ? "是管理员" : "普通用户"
        },
        {
            title: "登录密码",
            dataIndex: "PASSWORD",
            key: "PASSWORD",
            width: 160
        },
        {
            title: "封禁状态",
            dataIndex: "PERMISSION",
            key: "PERMISSION",
            width: 120,
            render: val => Number(val) === 1 ? "已封禁" : "正常可用"
        },
        {
            title: "操作",
            key: "action",
            width: 280,
            render: (_, record) => (
                <Space size="middle">
                    <ThemedButton onClick={() => banStatusToggle(record.ACCOUNTID, record.PERMISSION)}>
                        切换封禁
                    </ThemedButton>
                    <Button type="primary" onClick={() => openEditModal(record)}>编辑</Button>
                    <Button danger onClick={() => openDelModal(record.ACCOUNTID)}>删除</Button>
                </Space>
            )
        }
    ];

    // 拉取全部系统用户列表
    const fetchAccountData = () => {
        setLoading(true);
        InfomationSystem.getAllAccountOper((res) => {
            setLoading(false);
            if (res === BACK_ERR || !res?.success) {
                setAccountList([]);
                message.error("加载用户列表失败");
                return;
            }
            const list = Object.values(res.data);
            setAccountList(list);
        });
    };

    useEffect(() => {
        fetchAccountData();
    }, [refresh]);

    // 封禁切换
    function banStatusToggle(accountId, banState) {
        DebugTool.debugLog(`前端用户列表: 封禁状态切换: ${accountId} | 当前权限值: ${banState}`);
        InfomationSystem.sendBanOperator(accountId, (res) => {
            if (res === BACK_ERR || !(res?.data == "0")) {
                message.error("封禁操作失败");
                return;
            }
            message.success("封禁状态切换成功");
            setRefresh(prev => !prev);
        });
    }

    // 打开编辑弹窗回填数据
    const openEditModal = (record) => {
        setCurrentEditRow(record);
        form.setFieldsValue({
            NAME: record.NAME,
            PASSWORD: record.PASSWORD,
            ADMIN: record.ADMIN,
            PERMISSION: Number(record.PERMISSION)
        });
        setEditOpen(true);
    };

    // 提交编辑用户
    const submitEditAccount = async () => {
        try {
            const values = await form.validateFields();
            setEditLoading(true);
            const updateParams = {
                NAME: values.NAME,
                PASSWORD: values.PASSWORD,
                ADMIN: values.ADMIN,
                PERMISSION: values.PERMISSION
            };
            InfomationSystem.updateAccountOper(currentEditRow.ACCOUNTID, updateParams, (res) => {
                setEditLoading(false);
                if (res === BACK_ERR) {
                    message.error("编辑接口异常");
                    return;
                }
                if (res.code === "0") {
                    message.success("用户信息编辑成功");
                    setEditOpen(false);
                    setRefresh(p => !p);
                } else {
                    message.warning(res.msg || "编辑失败");
                }
            });
        } catch (err) {
            DebugTool.debugLog("编辑用户表单校验失败：" + err);
            setEditLoading(false);
        }
    };

    // 打开删除确认弹窗
    const openDelModal = (accountId) => {
        setDelAccountId(accountId);
        setDelOpen(true);
    };

    // 确认删除用户
    const confirmDeleteAccount = () => {
        setDelLoading(true);
        InfomationSystem.deleteAccountOper(delAccountId, (res) => {
            setDelLoading(false);
            setDelOpen(false);
            if (res === BACK_ERR) {
                message.error("删除请求异常");
                return;
            }
            if (res.code === "0") {
                message.success("用户删除成功");
                setRefresh(p => !p);
            } else {
                message.warning(res.msg || "删除失败");
            }
        });
    };

    // 手动刷新
    const handleRefresh = () => setRefresh(p => !p);

    return (
        <Layout style={{ padding: 16 }}>
            <Content style={{ background: "#fff" }}>
                <div style={{ marginBottom: 16, textAlign: "right" }}>
                    <Button onClick={handleRefresh}>刷新用户列表</Button>
                </div>
                <Spin spinning={loading}>
                    <Table
                        rowKey="ACCOUNTID"
                        dataSource={accountList}
                        columns={columns}
                        bordered
                        pagination={{ pageSize: 10 }}
                    />
                </Spin>

                {/* 编辑用户弹窗 */}
                <Modal
                    title="编辑系统用户"
                    open={editOpen}
                    maskClosable={false}
                    confirmLoading={editLoading}
                    onCancel={() => setEditOpen(false)}
                    onOk={submitEditAccount}
                    width={550}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item name="NAME" label="用户姓名" rules={[{ required: true, message: "请填写姓名" }]}>
                            <Input disabled={editLoading} />
                        </Form.Item>
                        <Form.Item name="PASSWORD" label="登录密码" rules={[{ required: true, message: "请填写密码" }]}>
                            <Input.Password disabled={editLoading} />
                        </Form.Item>
                        <Form.Item name="ADMIN" label="管理员权限" rules={[{ required: true }]}>
                            <Select disabled={editLoading}>
                                <Select.Option value="0">普通用户</Select.Option>
                                <Select.Option value="1">管理员</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="PERMISSION" label="封禁状态(0正常/1封禁)" rules={[{ required: true }]}>
                            <InputNumber min={0} max={1} style={{ width: "100%" }} disabled={editLoading} />
                        </Form.Item>
                    </Form>
                </Modal>

                {/* 删除确认弹窗 */}
                <Modal
                    title="删除用户确认"
                    open={delOpen}
                    maskClosable={false}
                    confirmLoading={delLoading}
                    onCancel={() => setDelOpen(false)}
                    onOk={confirmDeleteAccount}
                    okText="确认删除"
                    okType="danger"
                >
                    <p>确定要删除账号 <b>{delAccountId}</b> 吗？删除后数据无法恢复！</p>
                </Modal>
            </Content>
        </Layout>
    );
}

export default AccountLists;