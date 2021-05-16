import React from 'react';
import { Button, Space, Switch, Typography } from 'antd';
import { CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table/interface';
import { TodoTaskData } from '../../App';

const { Paragraph } = Typography;

export type MarkAsDoneHandler = (taskId: string, checkedVal: boolean) => void
export type DeletionHandler = (taskId: string) => void

interface ColumnsProps {
  markAsDoneHandler: MarkAsDoneHandler
  deletionHandler: DeletionHandler
}

export const todoListColumns = ({ markAsDoneHandler, deletionHandler }: ColumnsProps): ColumnsType<TodoTaskData> => {
  return [
    {
      title: 'Task',
      key: 'title',
      render: (record: TodoTaskData) => <Paragraph
        style={{ textDecoration: record.isCompleted ? 'line-through' : undefined }}>{record.title}</Paragraph>
    },
    {
      title: 'Done',
      key: 'isCompleted',
      render: (record: TodoTaskData) => (
        <Space size="middle">
          <Switch
            checkedChildren={<CheckOutlined/>}
            unCheckedChildren={<CloseOutlined/>}
            defaultChecked={record.isCompleted}
            loading={record.loading.markAsDone}
            onChange={(checked) => markAsDoneHandler(record.id, checked)}
          />
        </Space>
      )
    },
    {
      title: 'Delete',
      key: 'action',
      render: (
        text: any,
        record: TodoTaskData
      ) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<DeleteOutlined/>}
            loading={record.loading.deletion}
            onClick={() => deletionHandler(record.id)}
          />
        </Space>
      )
    }
  ];
};
