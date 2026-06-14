import { Form, Input, Button, Typography, Card, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//===================自定义工具=======================
import Theme from '../../Theme/theme';
import { InfomationSystem } from '../../InfomationSystem/InfomationSystem';

const { Title } = Typography;
const { TextArea } = Input;

function ArticlePublish() {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleSubmit = (values) => {
        InfomationSystem.addArticleOper(values.title, values.content, (res) => {
            if (res === 99 || res.success == false) {
                message.error("发布失败");
                return;
            }
            if (res.success) {
                message.success("发布成功");
                navigate('/article/list');
            }
        })
    };

    // 提交发布
    const onFinish = (values) => {
        console.log('文章内容：', values);
        // 【对接后端接口】在这里请求发布文章接口
        handleSubmit(values)
    };

    return (
        <Card style={{ maxWidth: 800, margin: '0 auto', background: Theme.defalutColor }}>
            <Title level={4}>发布新文章</Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ title: '', content: '' }}
            >
                <Form.Item
                    name="title"
                    label="文章标题"
                    rules={[{ required: true, message: '请输入文章标题' }]}
                >
                    <Input placeholder="请输入标题" maxLength={50} />
                </Form.Item>

                <Form.Item
                    name="content"
                    label="文章正文"
                    rules={[{ required: true, message: '请输入文章内容' }]}
                >
                    <TextArea rows={15} placeholder="请编写文章内容" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large">立即发布</Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default ArticlePublish;