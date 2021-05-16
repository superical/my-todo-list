import React from 'react';
import { TodoTaskData } from '../../App';
import { Table } from 'antd';
import { DeletionHandler, MarkAsDoneHandler, todoListColumns } from './columns';


interface TodoListTableProps {
  dataSource: TodoTaskData[]
  markAsDoneHandler: MarkAsDoneHandler
  deletionHandler: DeletionHandler
}

export class TodoListTable extends React.Component<TodoListTableProps, any> {

  public constructor(props: TodoListTableProps) {
    super(props);
  }

  public render() {
    const { dataSource, deletionHandler, markAsDoneHandler } = this.props;
    const columns = todoListColumns({
      deletionHandler,
      markAsDoneHandler
    });

    return (
      <Table dataSource={dataSource}
             columns={columns}
             pagination={false}/>
    );
  }

}
