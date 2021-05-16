import React from 'react';
import {
  Row, Col, Input
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import 'antd/dist/antd.css';
import './App.css';
import { TodoListTable } from './components/TodoListTable/TodoListTable';

const API_BASE_URL = 'http://localhost:3001';

type LoadingTypes = {
  deletion: boolean
  markAsDone: boolean
}

export interface TodoTaskData {
  key: number
  id: string
  title: string
  isCompleted: boolean
  loading: LoadingTypes
}

interface AppProps {

}

interface AppState {
  todoData: TodoTaskData[],
  addTaskInput: string
}

export class App extends React.Component<AppProps, AppState> {

  public state: AppState = {
    todoData: [],
    addTaskInput: ''
  };

  public constructor(props: AppProps) {
    super(props);
  }

  public async componentDidMount() {
    const res = await axios.get(`${API_BASE_URL}/tasks`);
    const { data } = res.data;
    const todoData: TodoTaskData[] = data.map((task: any, idx: any) => this.mapTaskDataToState(task, idx));
    this.setState({ todoData });
  }

  private mapTaskDataToState(taskDataResponse: any, idx?: number): TodoTaskData {
    return {
      ...taskDataResponse,
      key: idx ?? this.state.todoData.length,
      loading: {
        deletion: false,
        markAsDone: false
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
    try {
      const todoDataIdx = this.getTodoDataIdx(taskId);
      const startLoadingTodoData = this.getUpdatedLoadingTodoTaskDataState(taskId, 'markAsDone', true);
      this.setState({
        todoData: startLoadingTodoData
      });

      await axios.put(`${API_BASE_URL}/tasks/${taskId}`, {
        title: startLoadingTodoData[todoDataIdx].title,
        isCompleted: checkedVal
      });

      const finalTodoData = this.getUpdatedLoadingTodoTaskDataState(taskId, 'markAsDone', false);
      finalTodoData[todoDataIdx] = {
        ...finalTodoData[todoDataIdx],
        isCompleted: checkedVal
      };
      this.setState({
        todoData: finalTodoData
      });
    } catch (e) {
      alert(`Error: ${e.response.data.error}`);
    }
  };

  private async deletionHandler(taskId: string): Promise<void> {
    try {
      const startLoadingTodoData = this.getUpdatedLoadingTodoTaskDataState(taskId, 'deletion', true);
      this.setState({
        todoData: startLoadingTodoData
      });

      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);

      const todoDataIdx = this.getTodoDataIdx(taskId);
      const finalTodoData = [...this.state.todoData];
      finalTodoData.splice(todoDataIdx, 1);
      this.setState({
        todoData: finalTodoData
      });
    } catch (e) {
      alert(`Error: ${e.response.data.error}`);
    }
  }

  private async createTaskHandler(e: React.KeyboardEvent<HTMLInputElement>): Promise<void> {
    try {
      const res = await axios.post(`${API_BASE_URL}/tasks`, {
        title: e.currentTarget.value,
        isCompleted: false
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
      alert(`Error: ${e.response.data.error}`);
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
              <TodoListTable
                dataSource={this.state.todoData}
                markAsDoneHandler={this.markAsDoneHandler.bind(this)}
                deletionHandler={this.deletionHandler.bind(this)}
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
