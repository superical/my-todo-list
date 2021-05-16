import { Router, Request, Response } from 'express';
import { CreateTaskDto } from '../dto/CreateTask.dto';
import { TaskService } from '../services/Task.service';
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError';
import { fakeDelay } from '../middlewares/fakeDelay';

export class TaskController {

  public readonly path: string = '/tasks';

  public constructor(
    public router: Router,
    private service: TaskService
  ) {
    this.router.put(`${this.path}/:id`, fakeDelay, this.updateTask.bind(this));
    this.router.delete(`${this.path}/:id`, fakeDelay, this.removeTask.bind(this));
    this.router.get(this.path, this.getAllTasks.bind(this));
    this.router.post(this.path, this.createTask.bind(this));
  }

  public async getAllTasks(req: Request, res: Response): Promise<void> {
    const tasks = this.service.getTasks();
    const body = {
      count: tasks.length,
      data: tasks
    };
    res.send(body);
  }

  public async createTask(req: Request, res: Response): Promise<void> {
    const createTaskDto: CreateTaskDto = req.body;
    const taskDto = this.service.createTask(createTaskDto);
    const body = {
      data: taskDto
    }
    res.send(body);
  }

  public async removeTask(req: Request, res: Response): Promise<void> {
    this.service.removeTask(req.params.id);
    res.status(204);
    res.send();
  }

  public async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const createTaskDto: CreateTaskDto = req.body;
      const taskDto = this.service.updateTask(req.params.id, createTaskDto);
      const body = {
        data: taskDto
      }
      res.send(body);
    } catch (e) {
      const body = {
        error: e.message
      }
      if (e instanceof ResourceNotFoundError) {
        res.status(404);
      } else {
        res.status(500);
      }
      res.send(body)
    }
  }

}
