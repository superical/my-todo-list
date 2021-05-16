import React from 'react';
import { TodoTaskData } from '../../App';
import { Table } from 'antd';
import {
  ChangeDueDateHandler, ChangePriorityHandler,
  ChangeStatusHandler,
  DeletionHandler,
  MarkAsDoneHandler,
  todoListColumns
} from './columns';


interface TodoListTableProps {
  dataSource: TodoTaskData[]
  loading: boolean
  markAsDoneHandler: MarkAsDoneHandler
  deletionHandler: DeletionHandler
  changeStatusHandler: ChangeStatusHandler
  changeDueDateHandler: ChangeDueDateHandler
  changePriorityHandler: ChangePriorityHandler
}

export class TodoListTable extends React.Component<TodoListTableProps, any> {

  public constructor(props: TodoListTableProps) {
    super(props);
  }

  public render() {
    const {
      dataSource,
      loading,
      deletionHandler,
      markAsDoneHandler,
      changeStatusHandler,
      changeDueDateHandler,
      changePriorityHandler
    } = this.props;
    const columns = todoListColumns({
      deletionHandler,
      markAsDoneHandler,
      changeStatusHandler,
      changeDueDateHandler,
      changePriorityHandler
    });

    return (
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        loading={loading}
      />
    );
  }

}
