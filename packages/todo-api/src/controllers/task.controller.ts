import { NextFunction, Request, Response, Router } from 'express';
import { CreateTaskDto } from '../dto/CreateTask.dto';
import { TaskService } from '../services/Task.service';
import { fakeDelay } from '../middlewares/fakeDelay';
import { TaskQueryParamsDto } from '../dto/TaskQueryParams.dto';
import { BadRequestError } from '../errors/BadRequestError';

export class TaskController {

  public readonly path: string = '/tasks';

  public constructor(
    public router: Router,
    private service: TaskService
  ) {
    this.router.put(`${this.path}/:id`, fakeDelay, this.validate.bind(this), this.updateTask.bind(this));
    this.router.delete(`${this.path}/:id`, fakeDelay, this.removeTask.bind(this));
    this.router.get(this.path, this.validate.bind(this), this.getAllTasks.bind(this));
    this.router.post(this.path, this.validate.bind(this), this.createTask.bind(this));
  }

  private async validate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let errors: string[] = [];
      if (req.method === 'GET') {
        errors = TaskQueryParamsDto.validate(req.query);
      } else if (req.method === 'PUT' || req.method === 'POST') {
        errors = CreateTaskDto.validate(req.body);
      }
      if (errors.length) {
        const err = new BadRequestError(
          'Task resource request validation error',
          errors
        );
        return next(err);
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  public async getAllTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query: Partial<TaskQueryParamsDto> = TaskQueryParamsDto.from(req.query);
      const tasks = this.service.getTasks(query);
      const body = {
        count: tasks.length,
        data: tasks
      };
      res.json(body);
    } catch (err) {
      next(err);
    }
  }

  public async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createTaskDto: CreateTaskDto = CreateTaskDto.from(req.body);
      const taskDto = this.service.createTask(createTaskDto);
      const body = {
        data: taskDto
      };
      res.json(body);
    } catch (err) {
      next(err);
    }
  }

  public async removeTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = this.service.removeTask(req.params.id);
      if (result) {
        res.status(204);
      } else {
        res.status(400);
      }
      res.send();
    } catch (err) {
      next(err);
    }
  }

  public async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createTaskDto: CreateTaskDto = CreateTaskDto.from(req.body);
      const taskDto = this.service.updateTask(req.params.id, createTaskDto);
      const body = {
        data: taskDto
      };
      res.json(body);
    } catch (err) {
      next(err);
    }
  }

}
