import Icon, { DownOutlined } from '@ant-design/icons';
import { TodoTaskData } from '../../App';
import { Dropdown, Menu } from 'antd';
import { TaskPriority } from '@todo-list/common';
import { TaskStatus } from '@todo-list/common';
import React from 'react';
import { ChangePriorityHandler } from './columns';

const LowPrioritySvg = () => (
  <svg viewBox="0 0 48 48" width="1em" height="1em">
    <path fill="#4CAF50"
          d="M21.2,44.8l-18-18c-1.6-1.6-1.6-4.1,0-5.7l18-18c1.6-1.6,4.1-1.6,5.7,0l18,18c1.6,1.6,1.6,4.1,0,5.7l-18,18 C25.3,46.4,22.7,46.4,21.2,44.8z"/>
    <g fill="#FFEB3B">
      <polygon points="24,33.4 17,25 31,25"/>
      <rect x="22" y="14.8" width="4" height="12.3"/>
    </g>
  </svg>
);

const MediumPrioritySvg = () => (
  <svg viewBox="0 0 48 48" width="1em" height="1em">
    <path fill="#FFC107"
          d="M21.2,44.8l-18-18c-1.6-1.6-1.6-4.1,0-5.7l18-18c1.6-1.6,4.1-1.6,5.7,0l18,18c1.6,1.6,1.6,4.1,0,5.7l-18,18 C25.3,46.4,22.7,46.4,21.2,44.8z"/>
    <g fill="#37474F">
      <circle cx="24" cy="24" r="2"/>
      <circle cx="32" cy="24" r="2"/>
      <circle cx="16" cy="24" r="2"/>
    </g>
  </svg>
);

const HighPrioritySvg = () => (
  <svg viewBox="0 0 48 48" width="1em" height="1em">
    <path fill="#F44336"
          d="M21.2,44.8l-18-18c-1.6-1.6-1.6-4.1,0-5.7l18-18c1.6-1.6,4.1-1.6,5.7,0l18,18c1.6,1.6,1.6,4.1,0,5.7l-18,18 C25.3,46.4,22.7,46.4,21.2,44.8z"/>
    <path fill="#fff"
          d="M21.6,32.7c0-0.3,0.1-0.6,0.2-0.9c0.1-0.3,0.3-0.5,0.5-0.7c0.2-0.2,0.5-0.4,0.8-0.5s0.6-0.2,1-0.2 s0.7,0.1,1,0.2c0.3,0.1,0.6,0.3,0.8,0.5c0.2,0.2,0.4,0.4,0.5,0.7c0.1,0.3,0.2,0.6,0.2,0.9s-0.1,0.6-0.2,0.9s-0.3,0.5-0.5,0.7 c-0.2,0.2-0.5,0.4-0.8,0.5c-0.3,0.1-0.6,0.2-1,0.2s-0.7-0.1-1-0.2s-0.5-0.3-0.8-0.5c-0.2-0.2-0.4-0.4-0.5-0.7S21.6,33.1,21.6,32.7z M25.8,28.1h-3.6L21.7,13h4.6L25.8,28.1z"/>
  </svg>
);

const LowPriorityIcon = (props: any) => <Icon component={LowPrioritySvg} {...props} />;
const MediumPriorityIcon = (props: any) => <Icon component={MediumPrioritySvg} {...props} />;
const HighPriorityIcon = (props: any) => <Icon component={HighPrioritySvg} {...props} />;

export const PriorityDropdown = (props: {
  record: TodoTaskData
  changePriorityHandler: ChangePriorityHandler
}) => {
  const { record, changePriorityHandler } = props;
  const prioritiesMenu = (
    <Menu onClick={e => changePriorityHandler(
      record.id,
      TaskPriority[TaskPriority[e.key as number] as keyof typeof TaskPriority]
    )}>
      <Menu.Item key="0"><LowPriorityIcon/>Low</Menu.Item>
      <Menu.Item key="1"><MediumPriorityIcon/>Medium</Menu.Item>
      <Menu.Item key="2"><HighPriorityIcon/>High</Menu.Item>
    </Menu>
  );
  const PriorityIcon = (props: {
    priority: TaskPriority
  }) => {
    switch (props.priority) {
      case TaskPriority.Medium:
        return <MediumPriorityIcon/>;
      case TaskPriority.High:
        return <HighPriorityIcon/>;
      default:
        return <LowPriorityIcon/>;
    }
  };
  return (
    <Dropdown
      overlay={prioritiesMenu}
      trigger={['click']}
      disabled={record.status === TaskStatus.Completed}
    >
      <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
        <PriorityIcon priority={record.priority}/> <DownOutlined/>
      </a>
    </Dropdown>
  );
};
