import * as React from 'react';
import { Form, Table, Button, Popconfirm, Card, Row, message, Modal,Input, DatePicker, Select, Divider, Icon } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { FormComponentProps } from 'antd/es/form';
import moment, { Moment } from 'moment';
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

  const [ meetingsData,setMeetingsData ] = useState([]);
  const [ requires,setRequires ] = useState<string[]>([]);

  const [ nowRecord, setNowRecord ] = useState<MeetingProp>(undefined);

  const [ isAdding, setIsAdding ] = useState<boolean>(false);
  const [ selectedValue, setSelectedValue ] = useState<string>(undefined);
  const [ inputValue, setInputValue ] = useState<string>('');
  const [ dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [ onBlurDisable, setOnBlurDisable] = useState<boolean>(false);

  const [ formModalVisible,setFormModalVisible ] = useState<boolean>(false);
  const [ tableModalVisible,setTableModalVisible ] = useState<boolean>(false);

  const formRef = React.createRef<FormComponentProps>();

  useEffect(()=> {
    axios.get('http://localhost:8080/api/meetings')
      .then((response) => {
        const { data, status, statusText } = response;
        const { meetings } = data.data;
        if (status === 200 && data.status === 1) {
          setMeetingsData(meetings);
        }
      });
    axios.get('http://localhost:8080/api/requires')
      .then((response) => {
        const { data, status, statusText } = response;
        const { requires } = data.data;
        if (status === 200 && data.status === 1) {
          setRequires(requires);
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
        if (status === 200 && data.status === 1 ) {
          message.success(`会议 ${record.name} 删除成功`);
          console.log(meetingsData);
          console.log(record);
          const newData = meetingsData.filter((v:MeetingProp) => {
            return v.id !== record.id;
          });
          setMeetingsData(newData);

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
          position
        } = formRef.current.form.getFieldsValue();
        const time:Moment = formRef.current.form.getFieldValue('time');
        ;
        const postData = {
          id:nowRecord.id,
          name,
          time:time.valueOf(),
          position
        };
        console.log(postData);
        axios.put('http://localhost:8080/api/meetings',postData)
          .then((response) => {
            const { data, status } = response;
            if (status === 200 && data.status === 1) {
              message.success('修改成功');

            }
          });
      }
    });
  };

  const handleEdit = (record:MeetingProp) => {
    return () => {
      setFormModalVisible(true);
      setNowRecord(record);
    };
  };

  const handleExcel = () => {
    const head = [['用户名'].concat(nowRecord.requires)];
    Object.keys(nowRecord.data).forEach((name) => {
      head.push([name].concat(nowRecord.requires.map((v) => (nowRecord.data[name][v]))));
    });
    const csvRows:string[] = [];
    head.forEach((row) => {
      csvRows.push(row.join(','));
    });
    const csvString = csvRows.join('\n');
    const _utf = '\uFEFF';
    const link = document.createElement('a');
    link.download = `${nowRecord.name}.csv`;
    link.target = '_blank';
    link.href= `data:attachment/csv; charset=utf-8,${_utf}${encodeURI(csvString)}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteRequire = () => {
    if (selectedValue !== undefined) {
      axios.delete(`http://localhost:8080/api/requires?name=${selectedValue}`)
        .then((response) => {
          const { data, status } = response;
          if (status === 200 && data.status === 1) {
            message.success('删除成功');
            const newRequires = [...requires];
            newRequires.splice(newRequires.indexOf(selectedValue),1);

            setRequires(newRequires);
            setSelectedValue(undefined);
          }
        });
    }
  };


  const handleAddRequire = () => {
    axios.post('http://localhost:8080/api/requires',{
      name: inputValue
    })
      .then((response) => {
        const { data, status } = response;
        if (status === 200 && data.status === 1) {
          message.success('添加成功');
          setRequires(requires.concat([inputValue]));
        }
      });
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
            dataSource={meetingsData}
            rowKey="id"
          />
        </Card>
      </Row>
      {
        (localStorage.getItem('role') === 'admin')&&(
          <>
            <Row>
            要求管理
            </Row>
            <Row>
              <Select
                style={{ width: 200 }}
                placeholder="选择一个要求"
                open={dropdownOpen}
                value={selectedValue}
                onChange={(v:string) => setSelectedValue(v)}
                onDropdownVisibleChange={open => {
                  if (!onBlurDisable) {
                    setDropdownOpen(open);
                  }
                }}
                dropdownRender={menu => (
                  <div>
                    {menu}
                    <Divider style={{ margin: '4px 0' }} />
                    <div
                      style={{ padding: '4px 8px', cursor: 'pointer' }}
                      onMouseEnter={() => setOnBlurDisable(true)}
                      onMouseLeave={() => setOnBlurDisable(false)}
                    >
                      {isAdding && (
                        <div>
                          <Input
                            style={{ marginBottom: '10px' }}
                            autoFocus
                            onChange={(e) => setInputValue(e.target.value)}
                          />

                          <div>
                            <Button
                              size="small"
                              onClick={() => {
                                setIsAdding(false);
                                setOnBlurDisable(false);
                              }}
                            >
                    取消
                            </Button>

                            <Button
                              size="small"
                              type="primary"
                              style={{ marginLeft: '10px' }}
                              onClick={() => {
                                setIsAdding(false);
                                setOnBlurDisable(false);
                                handleAddRequire();
                              }}
                            >
                    保存
                            </Button>
                          </div>
                        </div>
                      )}

                      {!isAdding && (
                        <div onClick={() => setIsAdding(true)}>
                          <Icon type="plus" /> 添加要求
                        </div>
                      )}
                    </div>
                  </div>
                )}
              >
                {requires.map((require) => (
                  <Select.Option key={require} value={require} >{require}</Select.Option>
                ))}
              </Select>
              <Button type="danger" onClick={handleDeleteRequire}>删除</Button>
            </Row>
          </>)
      }
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
        onOk={handleExcel}
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
