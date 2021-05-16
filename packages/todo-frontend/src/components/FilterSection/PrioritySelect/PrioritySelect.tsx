import { Select } from 'antd';
import React from 'react';
import { TaskPriority } from '@todo-list/common';

interface Props {
  value: TaskPriority | undefined
  onChange: (e: any) => void
}

export const PrioritySelect = (props: Props) => {
  const { value, onChange } = props;
  return (
    <Select
      defaultValue={value ?? -1}
      onChange={(val) => {
        if (val === -1) {
          return onChange(undefined);
        }
        return onChange(val);
      }}
      value={value ?? -1}
      style={{ width: '120px' }}
    >
      <Select.Option key="all" value={-1}>All Priorities</Select.Option>
      <Select.Option key="0" value={TaskPriority.Low}>Low</Select.Option>
      <Select.Option key="1" value={TaskPriority.Medium}>Medium</Select.Option>
      <Select.Option key="2" value={TaskPriority.High}>High</Select.Option>
    </Select>
  );
};
