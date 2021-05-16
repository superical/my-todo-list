import React from 'react';
import { Button, DatePicker, Select, Space, Switch, Typography, Spin } from 'antd';
import { CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { ColumnsType } from 'antd/lib/table/interface';
import { TodoTaskData } from '../../App';
import { TaskPriority } from '@todo-list/common';
import { TaskStatus } from '@todo-list/common';
import { PriorityDropdown } from './PriorityDropdown';

const { Paragraph } = Typography;

export type MarkAsDoneHandler = (taskId: string, checkedVal: boolean) => void
export type DeletionHandler = (taskId: string) => void
export type ChangeStatusHandler = (taskId: string, status: TaskStatus) => void
export type ChangeDueDateHandler = (taskId: string, date: Date | null) => void
export type ChangePriorityHandler = (taskId: string, priority: TaskPriority) => void

interface ColumnsProps {
  markAsDoneHandler: MarkAsDoneHandler
  deletionHandler: DeletionHandler
  changeStatusHandler: ChangeStatusHandler
  changeDueDateHandler: ChangeDueDateHandler
  changePriorityHandler: ChangePriorityHandler
}

export const todoListColumns = ({
  markAsDoneHandler,
  deletionHandler,
  changeStatusHandler,
  changeDueDateHandler,
  changePriorityHandler
}: ColumnsProps): ColumnsType<TodoTaskData> => {
  return [
    {
      title: 'Task',
      key: 'title',
      render: (record: TodoTaskData) => {
        return (
          <div>
            <Paragraph
              style={{
                textDecoration: record.status === TaskStatus.Completed
                  ? 'line-through'
                  : undefined
              }}>{record.title}</Paragraph>
            <Space size="middle">
              <PriorityDropdown record={record} changePriorityHandler={changePriorityHandler}/>
              <DatePicker
                size="small"
                placeholder="Due Date"
                value={record.dueDate && moment(record.dueDate)}
                onChange={(date) => changeDueDateHandler(record.id, date?.toDate() ?? null)}
                disabled={record.status === TaskStatus.Completed}
              />
              <Spin size="small" spinning={record.loading.changeDueDate || record.loading.changePriority}/>
            </Space>
          </div>
        );
      }
    },
    {
      title: 'Done',
      key: 'isCompleted',
      render: (record: TodoTaskData) => (
        <Space size="middle">
          <Switch
            checkedChildren={<CheckOutlined/>}
            unCheckedChildren={<CloseOutlined/>}
            defaultChecked={record.status === TaskStatus.Completed}
            checked={record.status === TaskStatus.Completed}
            loading={record.loading.changeStatus}
            onChange={(checked) => markAsDoneHandler(record.id, checked)}
          />
        </Space>
      )
    },
    {
      title: 'Status',
      key: 'status',
      render: (record: TodoTaskData) => (
        <Select
          defaultValue={record.status}
          onChange={(statusVal: TaskStatus) => changeStatusHandler(record.id, statusVal)}
          style={{ width: '120px' }}
          disabled={record.status === TaskStatus.Completed}
          value={record.status}
          loading={record.loading.changeStatus}
        >
          <Select.Option key="0" value={TaskStatus.ToDo}>To Do</Select.Option>
          <Select.Option key="1" value={TaskStatus.InProgress}>In-Progress</Select.Option>
          <Select.Option key="2" value={TaskStatus.Blocked}>Blocked</Select.Option>
          <Select.Option key="3" value={TaskStatus.Completed}>Completed</Select.Option>
        </Select>
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
