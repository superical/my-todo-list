import { Task } from '../models/Task';
import { TaskDto } from '../dto/Task.dto';
import { CreateTaskDto } from '../dto/CreateTask.dto';
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError';

export class TaskService {

  private tasks: Task[] = [
    new Task('Buy doge', false)
  ];

  public constructor() {
  }

  public getTasks(): TaskDto[];

  public getTasks(): TaskDto[] {
    let tasks = this.tasks;

    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      isCompleted: task.isCompleted
    }));
  }

  public createTask(createTaskDto: CreateTaskDto): TaskDto {
    const task = new Task(createTaskDto.title, createTaskDto.isCompleted);
    this.tasks.push(task);
    return {
      id: task.id,
      title: task.title,
      isCompleted: task.isCompleted
    };
  }

  public removeTask(taskId: string): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }

  public updateTask(taskId: string, taskDto: CreateTaskDto): TaskDto {
    const task = this.tasks.find(task => task.id === taskId);
    if (!task) {
      throw new ResourceNotFoundError(`Cannot find task ID ${taskId}`);
    }
    task.title = taskDto.title ?? task.title;
    task.isCompleted = taskDto.isCompleted ?? task.isCompleted;
    return {
      id: task.id,
      title: task.title,
      isCompleted: task.isCompleted
    };
  }
}
