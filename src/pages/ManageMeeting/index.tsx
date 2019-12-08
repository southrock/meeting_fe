import * as React from 'react';
import { Form, Table, Button, Popconfirm } from 'antd';
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

  const handleDelete = () => {

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
              onConfirm={handleDelete}
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
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
    />
  );
};

export default ManageMeeting;
