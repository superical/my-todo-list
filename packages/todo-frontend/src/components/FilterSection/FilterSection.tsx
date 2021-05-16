import { Space, Typography } from 'antd';
import { PrioritySelect } from './PrioritySelect/PrioritySelect';
import { StatusSelect } from './StatusSelect/StatusSelect';
import React from 'react';
import { TaskStatus } from '@todo-list/common';
import { TaskPriority } from '@todo-list/common';
import { OverdueSelect } from './OverdueSelect/OverdueSelect';

export interface FilterParameters {
  priority?: TaskPriority
  status?: TaskStatus
  overdue?: 0 | 1 | undefined
}

interface FilterSectionProps {
  parameters: FilterParameters
  onFiltersChange: (parameters: FilterParameters) => void
}

export const FilterSection = (props: FilterSectionProps) => {
  const { parameters: { priority, status, overdue }, onFiltersChange } = props;
  const onPriorityChange = (val: TaskPriority | undefined) => {
    const filters: FilterParameters = {
      ...props.parameters,
      priority: val
    };
    onFiltersChange(filters);
  };
  const onStatusChange = (val: TaskStatus | undefined) => {
    const filters: FilterParameters = {
      ...props.parameters,
      status: val
    };
    onFiltersChange(filters);
  };
  const onOverDueChange = (val: 0 | 1 | undefined) => {
    const filters: FilterParameters = {
      ...props.parameters,
      overdue: val
    };
    onFiltersChange(filters);
  };
  return (
    <Space align="baseline" direction="horizontal" size="middle">
      <Typography.Paragraph style={{ 'fontWeight': 'bold', 'fontSize': '1em' }}>Filters:</Typography.Paragraph>
      <Space align="center" size="middle">
        <PrioritySelect onChange={onPriorityChange} value={priority}/>
        <StatusSelect onChange={onStatusChange} value={status}/>
        <OverdueSelect onChange={onOverDueChange} value={overdue}/>
      </Space>
    </Space>
  );
};
