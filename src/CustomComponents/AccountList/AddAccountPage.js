import { useState } from "react";
import { Form, Input, InputNumber, Select, Button, Space, message, Spin } from "antd";
import { InfomationSystem } from "../../InfomationSystem/InfomationSystem";
import { DebugTool } from "../../Util/DebugTool/DebugTool";

function AddAccountPage() {
    const [form] = Form.useForm();
    const [submitLoading, setSubmitLoading] = useState(false);
    const BACK_ERR = InfomationSystem.getBackError();

    // 提交新增用户
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitLoading(true);
            const { ACCOUNTID, PASSWORD, NAME, ADMIN, PERMISSION } = values;

            InfomationSystem.addAccountOper(
                ACCOUNTID,
                PASSWORD,
                NAME,
                ADMIN,
                PERMISSION,
                (res) => {
                    setSubmitLoading(false);
                    if (res === BACK_ERR) {
                        message.error("接口请求异常，新增失败");
                        return;
                    }
                    if (res.code === "2") {
                        message.warning("账号已存在，不能重复创建");
                    } else if (res.code === "0") {
                        message.success("新增用户成功！");
                        form.resetFields();
                    } else {
                        message.error(res.msg || "新增失败");
                    }
                }
            );
        } catch (err) {
            DebugTool.debugLog("新增用户表单校验失败：" + err);
        }
    };

    // 重置表单
    const handleReset = () => {
        form.resetFields();
    };

    return (
        <div style={{ maxWidth: 600 }}>
            <Form
                form={form}
                layout="vertical"
                initialValues={{ ADMIN: "0", PERMISSION: 0 }}
            >
                <Form.Item
                    name="ACCOUNTID"
                    label="登录账号"
                    rules={[{ required: true, message: "请输入登录账号" }]}
                >
                    <Input placeholder="唯一账号，不可重复" disabled={submitLoading} />
                </Form.Item>

                <Form.Item
                    name="PASSWORD"
                    label="登录密码"
                    rules={[{ required: true, message: "请输入密码" }]}
                >
                    <Input.Password placeholder="设置登录密码" disabled={submitLoading} />
                </Form.Item>

                <Form.Item
                    name="NAME"
                    label="用户姓名"
                    rules={[{ required: true, message: "请输入用户姓名" }]}
                >
                    <Input placeholder="真实姓名" disabled={submitLoading} />
                </Form.Item>

                <Form.Item
                    name="ADMIN"
                    label="管理员权限"
                    rules={[{ required: true, message: "请选择权限类型" }]}
                >
                    <Select disabled={submitLoading}>
                        <Select.Option value="0">普通用户</Select.Option>
                        <Select.Option value="1">超级管理员</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="PERMISSION"
                    label="封禁标识(0正常 / 1封禁)"
                    rules={[{ required: true, message: "请选择状态" }]}
                >
                    <InputNumber min={0} max={1} style={{ width: "100%" }} disabled={submitLoading} />
                </Form.Item>

                <Form.Item>
                    <Space size="middle">
                        <Button type="primary" onClick={handleSubmit} loading={submitLoading}>
                            确认新增用户
                        </Button>
                        <Button onClick={handleReset} disabled={submitLoading}>
                            重置表单
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
}

export default AddAccountPage;