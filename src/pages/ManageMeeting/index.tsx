import * as React from 'react';
import { Form, Table, Button, Popconfirm, Card, Row, message, Modal,Input, DatePicker } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { FormComponentProps } from 'antd/es/form';
import moment from 'moment';
import axios from 'axios';

const { useState, useEffect } = React;

interface MeetingProp {
  id: number;
  name: string;
  time: number;
  position: string;
  requires: string[];
  data: {
    [username: string]: {
      [value: string]: string;
    };
  };
}

interface HandleSubmitSuccessProps {
  name: string;
}

interface MeetingFormProps extends FormComponentProps {
  record: MeetingProp;
  // handleSubmitSuccess: (data: FormType) => void;
  // allUsersArray: string[];
  // allRequires: string[];
}

const FormComponent = React.forwardRef<FormComponentProps,MeetingFormProps>(({ form,record },ref) => {
  React.useImperativeHandle(ref,() =>({
    form,
    record
  }));

  const { getFieldDecorator } = form;

  return (
    <Form>
      <Form.Item label="会议名称">
        {getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入会议名称!' }],
          initialValue: record.name
        })(
          <Input />
        )}
      </Form.Item>
      <Form.Item label="会议时间">
        {getFieldDecorator('time', {
          rules: [{ required: true, message: '请输入会议时间' }],
          initialValue: moment(record.time)
        })(
          <DatePicker showTime />
        )}
      </Form.Item>
      <Form.Item label="会议地点">
        {getFieldDecorator('position', {
          rules: [{ required: true, message: '请输入会议地点!' }],
          initialValue: record.position
        })(
          <Input />
        )}
      </Form.Item>
    </Form>
  );
});

const WrappedFormComponent = Form.create<MeetingFormProps>({ name: 'meeting_form' })( FormComponent );

const ManageMeeting: React.FC = () => {

  const [ data,setData ] = useState([]);
  const [ nowRecord, setNowRecord ] = useState<MeetingProp>(undefined);
  const [ formModalVisible,setFormModalVisible ] = useState<boolean>(false);
  const [ tableModalVisible,setTableModalVisible ] = useState<boolean>(false);

  const formRef = React.createRef<FormComponentProps>();

  useEffect(()=> {
    axios.get('http://localhost:8080/api/meetings')
      .then((response) => {
        const { data, status, statusText } = response;
        const { meetings } = data.data;
        if (status === 200) {
          setData(meetings);
        }
      });
  },[]);

  const handleDelete = (record:MeetingProp) => {
    return () => {
      axios.delete('http://localhost:8080/api/meetings',{
        data: {
          id: record.id
        }
      }).then((response) => {
        const { data, status, statusText } = response;
        if (status === 200 && data.status === 0 ) {
          message.success(`会议 ${record.name} 删除成功`);
        }
        else {
          message.error(data.message);
        }
      });
    };
  };

  const handleSubmit = () => {
    formRef.current.form.validateFields((err, values) => {
      if (!err) {
        const {
          name,
          time,
          position
        } = formRef.current.form.getFieldsValue();
        console.log(formRef.current.form.getFieldsValue());
        // props.handleSubmitSuccess({name,time,position,attenders,requires});
      }
    });
  };

  const handleEdit = (record:MeetingProp) => {
    return () => {
      setFormModalVisible(true);
      setNowRecord(record);
    };
  };

  const handleCheck = () => {

  };


  const columns: ColumnProps<MeetingProp>[] = [
    {
      title: '会议ID',
      dataIndex: 'id'
    },
    {
      title: '会议名称',
      dataIndex: 'name'
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
      title: '操作',
      dataIndex: 'operation',
      render: (text,record) => {
        return (
          <>
            <Popconfirm
              title="你确定是否删除这个会议?"
              onConfirm={handleDelete(record)}
              okText="删除"
              cancelText="取消"
            >
              <Button type="danger">删除</Button>
            </Popconfirm>
            <Button onClick={handleEdit(record)}>编辑</Button>
            <Button onClick={() => {setTableModalVisible(true);setNowRecord(record)}}>查看与会人员信息</Button>
          </>
        );
      }
    }
  ];


  return (
    <div>
      <Row>会议管理</Row>
      <Row>
        <Card>
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
          />
        </Card>
      </Row>
      <Row>
        要求管理
      </Row>
      <Modal
        title="修改会议信息"
        visible={formModalVisible}
        okText="提交"
        onCancel={() => {setFormModalVisible(false)}}
        onOk={handleSubmit}
      >
        <WrappedFormComponent wrappedComponentRef={formRef} record={nowRecord}/>
      </Modal>
      <Modal
        title="与会人员信息"
        visible={tableModalVisible}
        okText="下载Excel表格"
        onCancel={() => {setTableModalVisible(false)}}
      >
        <Table
          columns={nowRecord ? [{title: '用户名',dataIndex:'username'}].concat(nowRecord.requires.map((v) => ({title: v,dataIndex: v}))) : [{title: '用户名',dataIndex:'username'}]}
          dataSource={nowRecord ? Object.keys(nowRecord.data).map((k:string) => ({username:k,...nowRecord.data[k]})) : null}
          rowKey="username"
        />
      </Modal>
    </div>
  );
};

export default ManageMeeting;
