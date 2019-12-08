import * as React from 'react';
import { Form, Table, Button, Popconfirm, Card, Row, message } from 'antd';
import { ColumnProps } from 'antd/es/table';
import moment from 'moment';
import axios from 'axios';

const { useState, useEffect } = React;

interface MeetingProp {
  id: number;
  name: string;
  time: number;
  position: string;
  requires: string[];
  data: {};
}

const ManageMeeting: React.FC = () => {

  const [ data,setData ] = useState([]);

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

  const handleEdit = () => {

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
            <Button onClick={handleEdit}>编辑</Button>
            <Button onClick={handleEdit}>查看与会人员信息</Button>
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
    </div>
  );
};

export default ManageMeeting;
