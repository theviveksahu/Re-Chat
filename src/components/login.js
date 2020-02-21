import React from 'react';
import 'antd/dist/antd.css';
import './../App.css';
import { Form, Icon, Input, Button, Layout } from 'antd';
import axios from 'axios';
const { Header, Content } = Layout;

 class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo:{}
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            axios({
                method:'POST',
                url:'http://localhost:3000/login',
                headers: { 'content-type':'Application/json' },
                data: values
            })
            .then((res) => {
                this.props.history.push({
                    pathname:'/chat-board',
                    state: { userInfo: res.data[0] }
                });
            })
          }
        });               
    };
    
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Layout>
                <Header>
                    Re-Chat
                </Header>
                <Content>
                    <div className="login-container">
                        {/* <div className='login-text'>Login/Register</div> */}
                        <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
                        <div className='login-text'>Login/Register</div>
                            <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: 'Please input your username!' }],
                            })(
                                <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Username"
                                />,
                            )}
                            </Form.Item>
                            <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                                <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="Password"
                                />,
                            )}
                            </Form.Item>
                            <Form.Item>
                            <Button type="primary" block htmlType="submit" className="login-form-button">
                            <Icon type="login" />
                            </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Content>
            </Layout>
        )
    }
} 
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(LoginForm);
export default WrappedNormalLoginForm;