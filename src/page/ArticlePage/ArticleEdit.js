import { Form, Input, Button, Typography, Card, message } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

//=============自定义工具===========================
import Theme from '../../Theme/theme';
import { InfomationSystem } from '../../InfomationSystem/InfomationSystem';

const { Title } = Typography;
const { TextArea } = Input;

function ArticleEdit() {
    const { id } = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    // 模拟根据ID拉取旧数据，回显到表单
    useEffect(() => {
        InfomationSystem.getArticleDetailOper(id, (res) => {
            if (res === 99) {
                message.error("加载失败");
                navigate('/article/list');
                return;
            }
            form.setFieldsValue({
                title: res.title,
                content: res.content
            })
        })
    }, [id])

    // 提交修改
    const handleUpdate = (values) => {
        InfomationSystem.updateArticleOper(id, values.title, values.content, (res) => {
            if (res === 99) {
                message.error("修改失败");
                return;
            }
            if (res.code === "0") {
                message.success("修改成功");
                navigate('/article/list');
            }
        });
    };

    // 提交编辑
    const onFinish = (values) => {
        console.log('编辑后的内容：', values, '文章ID:', id);
        handleUpdate(values);
    };


    return (
        <Card style={{ maxWidth: 800, margin: '0 auto', background: Theme.defalutColor }}>
            <Title level={4}>编辑文章</Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
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
                    <Button type="primary" htmlType="submit">保存修改</Button>
                    <Button style={{ marginLeft: 10 }} onClick={() => navigate('/article/list')}>取消</Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default ArticleEdit;