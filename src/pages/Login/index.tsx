import * as React from 'react';
import axios from 'axios';
import { Button, Card, Form, Row, Input, Icon, message  } from 'antd';
import { FormComponentProps, FormProps } from 'antd/es/form';
import { RouteComponentProps } from 'react-router-dom';

const { useState } = React;

interface FormType {
  username: string;
  password: string;
}

interface HandleSubmitSuccessProps {
  name: string;
}


interface LoginFormProps extends FormComponentProps {
  handleSubmitSuccess: (data: FormType) => void;
}


const LoginForm: React.FC<LoginFormProps> = (props) => {
  const { getFieldDecorator } = props.form;

  const handleSubmit:React.FormEventHandler = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        const { username,password } = props.form.getFieldsValue();
        props.handleSubmitSuccess({username,password});
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item>
        {getFieldDecorator('username', {
          rules: [{ required: true, message: 'Please input your username!' }]
        })(
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Username"
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: 'Please input your Password!' }]
        })(
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="Password"
          />
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

const WrappedFormComponent = Form.create<LoginFormProps>({ name: 'login_form' })( LoginForm );

const Login = (props:RouteComponentProps) => {

  const handleSubmitSuccess = (postData:FormType) => {
    axios.post('http://localhost:8080/api/login',postData,{
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      const { data } = response;
      const { status } = data;
      if (status === 1) {
        message.success('登陆成功');
        // 切换页面 授权
        localStorage.setItem('username',postData.username);
        localStorage.setItem('role',data.role);
        props.history.push('/','success');
      }
      else {
        message.error(data.message);
      }
    });
  };
  return (
    <div>
      <Card>
        <Row>
          会议管理系统
        </Row>
        <WrappedFormComponent handleSubmitSuccess={handleSubmitSuccess} />
      </Card>
    </div>
  );
};

export default Login;
