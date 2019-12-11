import * as React from 'react';
import axios from 'axios';
import { Table, Icon, Modal, Form, Input, message, Button } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { FormComponentProps } from 'antd/es/form';
import moment from 'moment';

const { useState, useEffect } = React;

interface MeetingProp {
  id: number;
  name: string;
  time: number;
  position: string;
  requires: string[];
  checked: Boolean;
}

interface FormProps extends FormComponentProps {
  requires: string[];
}

const FormComponent = React.forwardRef<FormComponentProps,FormProps>(({ form,requires },ref) => {
  React.useImperativeHandle(ref,() =>({
    form
  }));
  const { getFieldDecorator } = form;

  return (
    <Form layout="vertical">
      {requires.map((require:string) => (
        <Form.Item label={require} key={require}>
          {getFieldDecorator(require,{
            rules: [{required: true, message: `请填写${require}`}]
          })(
            <Input />
          )}
        </Form.Item>
      ))}
    </Form>
  );
});


const WrappedForm = Form.create<FormProps>({name:'meeting_form'})(FormComponent);

const MyMeetings:React.FC = () => {

  const [ ID,setID ] = useState<number>(undefined);
  const [ data,setData ] = useState([]);

  const [ requires, setRequires ] = useState<string[]>([]);
  const [ visible, setVisible ] = useState<boolean>(false);
  const [ QRVisible, setQRVisible ] = useState<boolean>(false);

  const formRef = React.createRef<FormComponentProps>();

  useEffect(()=>{
    axios.get('http://localhost:8080/api/user/meetings')
      .then((response) => {
        const { data, status } = response;
        const { meetings } = data.data;
        if (status === 200 && data.status === 1) {
          setData(meetings);
        }
      });
  },[]);

  const handleClick = (record:MeetingProp) => {
    return (e:React.MouseEvent<HTMLAnchorElement,MouseEvent>) => {
      e.persist();
      e.preventDefault();
      setRequires(record.requires);
      setID(record.id);
      setVisible(true);
    };
  };

  const handleOK = () => {
    const { form } = formRef.current;
    form.validateFields((err,values) => {
      if (!err) {
        console.log(values);
        axios.post('http://localhost:8080/api/user/meetings',{
          id:ID,
          data:values
        })
          .then((response) => {
            console.log(response);
            const { data, status } = response;
            if (status === 200 && data.status === 1) {
              message.success('提交成功');
              setVisible(false);
            }
            else {
              message.error(data.message);
            }
          });
      }
    });
  };

  const handleQRcode = (record:MeetingProp) => {
    return () => {
      setID(record.id);
      setQRVisible(true);
    };
  };

  const columns: ColumnProps<MeetingProp>[] = [
    {
      title: '会议ID',
      dataIndex: 'id'
    },
    {
      title: '会议名称',
      dataIndex: 'name',
      render: (text,record) => <a onClick={handleClick(record)}>{text}</a>
    },
    {
      title: '会议时间',
      dataIndex: 'time',
      render: v => (moment.unix(v/1000).format('YYYY年M月D日 hh:mm:ss'))
    },
    {
      title: '会议地点',
      dataIndex: 'position'
    },
    {
      title: '是否填写信息',
      dataIndex: 'checked',
      render: v => (v === true ? <Icon type="check-circle" theme="twoTone" />: <Icon type="close-circle" theme="twoTone" />)
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (_,record) => (<Button onClick={handleQRcode(record)}><Icon type="qrcode" /></Button>)
    }
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
      />
      <Modal
        title="填写会议信息"
        visible={visible}
        okText="提交"
        onCancel={() => {setVisible(false)}}
        onOk={handleOK}
      >
        <WrappedForm
          wrappedComponentRef={formRef}
          requires={requires}
        />
      </Modal>
      <Modal
        title="会议二维码"
        visible={QRVisible}
        footer={null}
        onCancel={() => setQRVisible(false)}
      >
        <div style={{'textAlign':'center'}}>
          <img src={`http://localhost:8080/api/qrcode?id=${ID}`} alt="我是二维码"/>
        </div>
      </Modal>
    </div>
  );
};

export default MyMeetings;
