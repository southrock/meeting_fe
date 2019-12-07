import * as React from 'react';
import axios from 'axios';
import { Button, Card, Form, Row, Input, Icon, message, Transfer, DatePicker  } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Moment } from 'moment';

const { useEffect,useState } = React;

interface FormType {
  name: string;
  time: number | Moment;
  position: string;
  attenders: [];
  requires: [];
}

interface HandleSubmitSuccessProps {
  name: string;
}

interface MeetingFormProps extends FormComponentProps {
  handleSubmitSuccess: (data: FormType) => void;
  allUsersArray: string[];
  allRequires: string[];
}


const MeetingForm:React.FC<MeetingFormProps> = (props) => {
  const { allUsersArray, allRequires } = props;
  const { getFieldDecorator } = props.form;

  const [ targetAttenders, setTargetAttenders ] = useState<string[]>([]);
  const [ targetRequires, setTargetRequires ] = useState<string[]>([]);

  const handleSubmit:React.FormEventHandler = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        const {
          name,
          time,
          position,
          attenders,
          requires
        } = props.form.getFieldsValue();
        props.handleSubmitSuccess({name,time,position,attenders,requires});
      }
    });
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  };

  return (
    <Form onSubmit={handleSubmit} {...formItemLayout}>
      <Form.Item label="会议名称">
        {getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入会议名称!' }]
        })(
          <Input />
        )}
      </Form.Item>
      <Form.Item label="会议时间">
        {getFieldDecorator('time', {
          rules: [{ required: true, message: '请输入会议时间' }]
        })(
          <DatePicker showTime/>
        )}
      </Form.Item>
      <Form.Item label="会议地点">
        {getFieldDecorator('position', {
          rules: [{ required: true, message: '请输入会议地点!' }]
        })(
          <Input />
        )}
      </Form.Item>
      <Form.Item label="参会人员">
        {getFieldDecorator('attenders', {
          rules: [{ required: true, message: '请选择参会人员'}]
        })(
          <Transfer
            dataSource={allUsersArray.map((item) => ({key:item,title:item.toString()}))}
            titles={['候选人员', '与会人员']}
            targetKeys={targetAttenders}
            onChange={(t) => {setTargetAttenders(t)}}
            render={item => item.title}
          />
        )}
      </Form.Item>
      <Form.Item label="要求信息">
        {getFieldDecorator('requires', {
          rules: [{ required: true, message: '请选择要求信息'}]
        })(
          <Transfer
            dataSource={allRequires.map((item) => ({key:item,title:item.toString()}))}
            titles={['候选要求', '要求信息']}
            targetKeys={targetRequires}
            onChange={(t) => {setTargetRequires(t)}}
            render={item => item.title}
          />
        )}
      </Form.Item>
      <Form.Item
        wrapperCol={{
          xs: { span: 24, offset: 0 },
          sm: { span: 16, offset: 8 }
        }}>
        <Button type="primary" htmlType="submit" className="login-form-button">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

const WrappedFormComponent = Form.create<MeetingFormProps>({ name: 'meeting_form' })( MeetingForm );

const CreateMeeting:React.FC = (props) => {
  const [ allUsersArray, setAllUsersArray ] = useState<string[]>([]);
  const [ allRequires, setAllRequires ] = useState<string[]>([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/users')
      .then((response) => {
        const { data, status, statusText } = response;
        const { users } = data.data;
        if (status === 200) {
          setAllUsersArray(users);
        }
      });
    axios.get('http://localhost:8080/api/meeting/register')
      .then((response) => {
        const { data, status, statusText } = response;
        const { requires } = data.data;
        if (status === 200) {
          setAllRequires(requires);
        }
      });
  },[]);

  const handleSubmitSuccess = (data:FormType) => {

    const postData = {
      ...data,
      time: data.time.valueOf()
    };
    console.log(postData);
    axios.post('http://localhost:8080/api/meeting/register',postData,{
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      const { data } = response;
      const { status } = data;
      if (status === 1) {
        message.success(data.message);
        message.success(`会议id为${data.meeting_id}`);
        // 切换页面 授权
      }
      else {
        message.error(data.message);
      }
    });

  };


  return (
    <div>
      <Card>
        <WrappedFormComponent handleSubmitSuccess={handleSubmitSuccess} allUsersArray={allUsersArray} allRequires={allRequires}/>
      </Card>
    </div>
  );
};

export default CreateMeeting;
