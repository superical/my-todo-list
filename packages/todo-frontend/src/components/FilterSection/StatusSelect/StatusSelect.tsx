import { Select } from 'antd';
import React from 'react';
import { TaskStatus } from '@todo-list/common';

interface Props {
  value: TaskStatus | undefined
  onChange: (e: any) => void
}

export const StatusSelect = (props: Props) => {
  const { value, onChange } = props;
  return (
    <Select
      defaultValue={-1}
      onChange={(val) => {
        if (val === -1) {
          return onChange(undefined);
        }
        return onChange(val);
      }}
      value={value ?? -1}
      style={{ width: '120px' }}
    >
      <Select.Option key="all" value={-1}>All Statuses</Select.Option>
      <Select.Option key="0" value={TaskStatus.ToDo}>To Do</Select.Option>
      <Select.Option key="1" value={TaskStatus.InProgress}>In-Progress</Select.Option>
      <Select.Option key="2" value={TaskStatus.Blocked}>Blocked</Select.Option>
      <Select.Option key="3" value={TaskStatus.Completed}>Completed</Select.Option>
    </Select>
  );
};
