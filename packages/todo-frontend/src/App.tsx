import React from 'react';
import { Col, Input, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TaskPriority } from '@todo-list/common';
import { TaskStatus } from '@todo-list/common';
import axios from 'axios';
import 'antd/dist/antd.css';
import './App.css';
import { TodoListTable } from './components/TodoListTable/TodoListTable';
import { FilterParameters, FilterSection } from './components/FilterSection/FilterSection';

type LoadingTypes = {
  deletion: boolean
  changeStatus: boolean
  changeDueDate: boolean
  changePriority: boolean
}

export interface TodoTaskData {
  key: number
  id: string
  title: string
  loading: LoadingTypes
  status: TaskStatus
  priority: TaskPriority
  dueDate: Date | null
}

export interface CreateUpdateTaskDto {
  title: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: string | null
}

interface AppProps {
  apiBaseUrl: string
}

interface AppState {
  todoData: TodoTaskData[]
  addTaskInput: string
  filters: FilterParameters
  reloadingData: boolean
}

export class App extends React.Component<AppProps, AppState> {

  public state: AppState = {
    todoData: [],
    addTaskInput: '',
    reloadingData: false,
    filters: {
      overdue: undefined,
      status: undefined,
      priority: undefined
    }
  };

  public constructor(props: AppProps) {
    super(props);
  }

  private handlerError(err: any) {
    if (err.response) {
      alert(`Error: ${err.response.data.message}`);
    } else {
      alert('Unable to load data from API. Has the API server been started? Refresh page to try again.');
    }
  }

  private async loadData() {
    const { apiBaseUrl } = this.props;
    try {
      this.setState({ reloadingData: true });
      const { filters } = this.state;
      let query = undefined;
      if (filters) {
        const joinedQuery = Object
          .keys(filters)
          .reduce((res: string[], key) => {
            const val = filters[key as keyof FilterParameters];
            if (val === undefined) return res;
            return [...res, key];
          }, [])
          .map(key => `${key}=${filters[key as keyof FilterParameters]}`)
          .join('&');
        if (joinedQuery !== '') {
          query = `?${joinedQuery}`;
        }
      }
      const res = await axios.get(`${apiBaseUrl}/tasks${query ?? ''}`);
      const { data } = res.data;
      const todoData: TodoTaskData[] = data.map((task: any, idx: any) => this.mapTaskDataToState(task, idx));
      this.setState({ todoData });
    } catch (e) {
      this.handlerError(e);
    } finally {
      this.setState({ reloadingData: false });
    }
  }

  public async componentDidMount() {
    await this.loadData();
  }

  public async componentDidUpdate(prevProps: Readonly<AppProps>, prevState: Readonly<AppState>, snapshot?: any) {
    if (JSON.stringify(prevState.filters) !== JSON.stringify(this.state.filters)) {
      await this.loadData();
    }
  }

  private mapTaskDataToState(taskDataResponse: any, idx?: number): TodoTaskData {
    return {
      ...taskDataResponse,
      dueDate: (taskDataResponse.dueDate && new Date(taskDataResponse.dueDate)) ?? null,
      key: idx ?? this.state.todoData.length,
      loading: {
        deletion: false,
        changeStatus: false,
        changePriority: false,
        changeDueDate: false
      }
    };
  }

  private getTodoDataIdx = (taskId: string): number => {
    const idx = this.state.todoData.findIndex(taskData => taskData.id === taskId);
    if (idx === -1) {
      throw new Error(`Task ID ${taskId} has not been added!`);
    }
    return idx;
  };

  private getUpdatedLoadingTodoTaskDataState = (
    taskId: string,
    keyName: keyof LoadingTypes,
    value: boolean
  ): TodoTaskData[] => {
    const todoDataIdx = this.getTodoDataIdx(taskId);
    const updateLoadingTodoData = [...this.state.todoData];
    updateLoadingTodoData[todoDataIdx] = {
      ...updateLoadingTodoData[todoDataIdx],
      loading: {
        ...updateLoadingTodoData[todoDataIdx].loading,
        [keyName]: value
      }
    };
    return updateLoadingTodoData;
  };

  private markAsDoneHandler = async (taskId: string, checkedVal: boolean): Promise<void> => {
    const { apiBaseUrl } = this.props;
    try {
      const todoDataIdx = this.getTodoDataIdx(taskId);
      const startLoadingTodoData = this.getUpdatedLoadingTodoTaskDataState(taskId, 'changeStatus', true);
      this.setState({
        todoData: startLoadingTodoData
      });
      const data: CreateUpdateTaskDto = {
        title: startLoadingTodoData[todoDataIdx].title,
        priority: startLoadingTodoData[todoDataIdx].priority,
        status: checkedVal ? TaskStatus.Completed : TaskStatus.ToDo,
        dueDate: startLoadingTodoData[todoDataIdx].dueDate?.toISOString() ?? null
      };
      await axios.put(`${apiBaseUrl}/tasks/${taskId}`, data);

      const finalTodoData = this.getUpdatedLoadingTodoTaskDataState(taskId, 'changeStatus', false);
      finalTodoData[todoDataIdx] = {
        ...finalTodoData[todoDataIdx],
        status: checkedVal ? TaskStatus.Completed : TaskStatus.ToDo
      };
      this.setState({
        todoData: finalTodoData
      });
    } catch (e) {
      this.handlerError(e);
    }
  };

  private changeStatusHandler = async (taskId: string, statusVal: TaskStatus): Promise<void> => {
    const { apiBaseUrl } = this.props;
    try {
      const todoDataIdx = this.getTodoDataIdx(taskId);
      const startLoadingTodoData = this.getUpdatedLoadingTodoTaskDataState(taskId, 'changeStatus', true);
      this.setState({
        todoData: startLoadingTodoData
      });

      const data: CreateUpdateTaskDto = {
        title: startLoadingTodoData[todoDataIdx].title,
        priority: startLoadingTodoData[todoDataIdx].priority,
        status: statusVal,
        dueDate: startLoadingTodoData[todoDataIdx].dueDate?.toISOString() ?? null
      };
      await axios.put(`${apiBaseUrl}/tasks/${taskId}`, data);

      const finalTodoData = this.getUpdatedLoadingTodoTaskDataState(taskId, 'changeStatus', false);
      finalTodoData[todoDataIdx] = {
        ...finalTodoData[todoDataIdx],
        status: statusVal
      };
      this.setState({
        todoData: finalTodoData
      });
    } catch (e) {
      this.handlerError(e);
    }
  };

  private changeDueDateHandler = async (taskId: string, dueDate: Date | null): Promise<void> => {
    const { apiBaseUrl } = this.props;
    try {
      const todoDataIdx = this.getTodoDataIdx(taskId);
      const startLoadingTodoData = this.getUpdatedLoadingTodoTaskDataState(taskId, 'changeDueDate', true);
      this.setState({
        todoData: startLoadingTodoData
      });

      const data: CreateUpdateTaskDto = {
        title: startLoadingTodoData[todoDataIdx].title,
        priority: startLoadingTodoData[todoDataIdx].priority,
        status: startLoadingTodoData[todoDataIdx].status,
        dueDate: dueDate?.toISOString() ?? null
      };
      await axios.put(`${apiBaseUrl}/tasks/${taskId}`, data);

      const finalTodoData = this.getUpdatedLoadingTodoTaskDataState(taskId, 'changeDueDate', false);
      finalTodoData[todoDataIdx] = {
        ...finalTodoData[todoDataIdx],
        dueDate: dueDate ?? null
      };
      this.setState({
        todoData: finalTodoData
      });
    } catch (e) {
      this.handlerError(e);
    }
  };

  private changePriorityHandler = async (taskId: string, priority: TaskPriority): Promise<void> => {
    const { apiBaseUrl } = this.props;
    try {
      const todoDataIdx = this.getTodoDataIdx(taskId);
      const startLoadingTodoData = this.getUpdatedLoadingTodoTaskDataState(taskId, 'changePriority', true);
      this.setState({
        todoData: startLoadingTodoData
      });

      const data: CreateUpdateTaskDto = {
        title: startLoadingTodoData[todoDataIdx].title,
        priority,
        status: startLoadingTodoData[todoDataIdx].status,
        dueDate: startLoadingTodoData[todoDataIdx].dueDate?.toISOString() ?? null
      };
      await axios.put(`${apiBaseUrl}/tasks/${taskId}`, data);

      const finalTodoData = this.getUpdatedLoadingTodoTaskDataState(taskId, 'changePriority', false);
      finalTodoData[todoDataIdx] = {
        ...finalTodoData[todoDataIdx],
        priority
      };
      this.setState({
        todoData: finalTodoData
      });
    } catch (e) {
      this.handlerError(e);
    }
  };

  private async deletionHandler(taskId: string): Promise<void> {
    const { apiBaseUrl } = this.props;
    try {
      const startLoadingTodoData = this.getUpdatedLoadingTodoTaskDataState(taskId, 'deletion', true);
      this.setState({
        todoData: startLoadingTodoData
      });

      await axios.delete(`${apiBaseUrl}/tasks/${taskId}`);

      const todoDataIdx = this.getTodoDataIdx(taskId);
      const finalTodoData = [...this.state.todoData];
      finalTodoData.splice(todoDataIdx, 1);
      this.setState({
        todoData: finalTodoData
      });
    } catch (e) {
      this.handlerError(e);
    }
  }

  private async createTaskHandler(e: React.KeyboardEvent<HTMLInputElement>): Promise<void> {
    const { apiBaseUrl } = this.props;
    try {
      const res = await axios.post(`${apiBaseUrl}/tasks`, {
        title: e.currentTarget.value,
        status: TaskStatus.ToDo,
        priority: 0,
        dueDate: null
      });
      const { data } = res.data;
      const task = this.mapTaskDataToState(data);
      const todoData = [...this.state.todoData];
      todoData.push(task);
      this.setState({
        todoData,
        addTaskInput: ''
      });
    } catch (e) {
      this.handlerError(e);
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-wrapper">
          <Row>
            <Col span={24}>
              <h1>My Todo List</h1>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FilterSection
                parameters={this.state.filters}
                onFiltersChange={(filterParameters) => {
                  this.setState({
                    filters: filterParameters
                  });
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <TodoListTable
                dataSource={this.state.todoData}
                loading={this.state.reloadingData}
                markAsDoneHandler={this.markAsDoneHandler.bind(this)}
                deletionHandler={this.deletionHandler.bind(this)}
                changeStatusHandler={this.changeStatusHandler.bind(this)}
                changeDueDateHandler={this.changeDueDateHandler.bind(this)}
                changePriorityHandler={this.changePriorityHandler.bind(this)}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Input
                size="large"
                placeholder="Add a new Todo item"
                prefix={<PlusOutlined/>}
                value={this.state.addTaskInput}
                onChange={(e) => this.setState({ addTaskInput: e.currentTarget.value })}
                onPressEnter={this.createTaskHandler.bind(this)}/>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
