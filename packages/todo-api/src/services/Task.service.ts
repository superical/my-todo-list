import { Task } from '../models/Task';
import { TaskDto } from '../dto/Task.dto';
import { CreateTaskDto } from '../dto/CreateTask.dto';
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError';
import { ITaskRepository } from '../repositories/Task.repository';
import { TaskQueryParamsDto } from '../dto/TaskQueryParams.dto';
import { IUserRepository } from '../repositories/User.repository';

export class TaskService {

  public constructor(
    private taskRepository: ITaskRepository,
    private userRepository: IUserRepository
  ) {
  }

  public getTasks(query?: TaskQueryParamsDto): TaskDto[] {
    let tasks;
    if (!query || !Object.keys(query).length) {
      tasks = this.taskRepository.getAll();
    } else {
      tasks = this.taskRepository.filterByParameters(query);
    }

    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate
    }));
  }

  public createTask(createTaskDto: CreateTaskDto): TaskDto {
    const authorUser = this.userRepository.getById(createTaskDto.userId);
    if (!authorUser) throw new ResourceNotFoundError(`User ID ${createTaskDto.userId} cannot be found`);
    const task = new Task(
      createTaskDto.title,
      createTaskDto.priority,
      createTaskDto.status,
      authorUser,
      createTaskDto.dueDate
    );
    this.taskRepository.save(task);
    return {
      id: task.id,
      title: task.title,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate
    };
  }

  public removeTask(taskId: string): boolean {
    return this.taskRepository.removeById(taskId);
  }

  public updateTask(taskId: string, taskDto: CreateTaskDto): TaskDto {
    const task = this.taskRepository.getById(taskId);
    if (!task) {
      throw new ResourceNotFoundError(`Cannot find task ID ${taskId}`);
    }
    task.title = taskDto.title ?? task.title;
    task.priority = taskDto.priority ?? task.priority;
    task.status = taskDto.status ?? task.status;
    task.dueDate = taskDto.dueDate ?? (taskDto.dueDate === null ? null : task.dueDate);
    const updatedTask = this.taskRepository.save(task);
    return {
      id: updatedTask.id,
      title: updatedTask.title,
      priority: updatedTask.priority,
      status: updatedTask.status,
      dueDate: updatedTask.dueDate
    };
  }
}
