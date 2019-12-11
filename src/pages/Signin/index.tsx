import * as React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Form, Button, Input, Icon, Row, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';

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

  const [ confirmDirty, setConfirmDirty ] = useState<boolean>(false);

  const handleConfirmBlur = (e:React.FocusEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setConfirmDirty(confirmDirty || !!value );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const compareToFirstPassword = (rule:any, value:any, callback:any) => {
    const { form } = props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两个密码必须相同!');
    } else {
      callback();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateToNextPassword = (rule:any, value:any, callback:any) => {
    const { form } = props;
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

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
          rules: [{ required: true, message: '请输入用户名!' }]
        })(
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="用户名"
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [
            { required: true, message: '请输入密码' },
            {
              validator: validateToNextPassword
            }]
        })(
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="密码"
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('confirm', {
          rules: [
            { required: true, message: '请确认密码' },
            {
              validator: compareToFirstPassword
            }
          ]
        })(
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="确认密码"
            onBlur={handleConfirmBlur}
          />
        )}
      </Form.Item>
      <Form.Item>
        <Link to='/login'>返回登录</Link>
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


const Signin = () => {

  const handleSubmitSuccess = (postData:FormType) => {
    axios.post('http://localhost:8080/api/signin',postData,{
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      const { data } = response;
      const { status } = data;
      if (status === 1) {
        message.success('注册成功');
      }
      else {
        message.error(data.message);
      }
    });
  };

  return (
    <Card>
      <Row>
          用户注册
      </Row>
      <WrappedFormComponent handleSubmitSuccess={handleSubmitSuccess}/>
    </Card>
  );
};

export default Signin;
