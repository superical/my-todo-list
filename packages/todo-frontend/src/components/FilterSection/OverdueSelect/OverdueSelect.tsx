import { Select } from 'antd';
import React from 'react';

interface Props {
  value: 0 | 1 | undefined
  onChange: (e: any) => void
}

export const OverdueSelect = (props: Props) => {
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
      style={{ width: '160px' }}
    >
      <Select.Option key="all" value={-1}>All Due Dates</Select.Option>
      <Select.Option key="1" value={1}>Overdue Tasks Only</Select.Option>
      <Select.Option key="0" value={0}>Undue Tasks Only</Select.Option>
    </Select>
  );
};
