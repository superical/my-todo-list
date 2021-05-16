import clone from 'lodash.clonedeep';
import { Task } from '../models/Task';
import { Database } from '../db';
import { TaskQueryParamsDto } from '../dto/TaskQueryParams.dto';

export interface ITaskRepository {
  save(task: Task): Task

  removeById(id: string): boolean

  getAll(): Task[]

  getById(id: string): Task | undefined

  filterBy(predicate: (task: Task) => boolean): Task[]

  filterByParameters(params: TaskQueryParamsDto): Task[];
}

export class TaskRepository implements ITaskRepository {

  public constructor(private db: Database) {
  }

  public filterBy(predicate: (task: Task) => boolean): Task[] {
    const res = this.db.tasks.filter(predicate);
    return clone(res);
  }

  public filterByParameters(params: TaskQueryParamsDto): Task[] {
    return this.filterBy(task => {
      const priorityPredicate = () => params.priority === undefined ? true : task.priority === params.priority;
      const statusPredicate = () => params.status === undefined ? true : task.status === params.status;
      const overduePredicate = () => {
        if (params.overdue === undefined) return true;
        if (task.dueDate) {
          if (params.overdue) {
            return new Date(task.dueDate.toDateString()) < new Date(new Date().toDateString());
          } else {
            return new Date(task.dueDate.toDateString()) >= new Date(new Date().toDateString());
          }
        } else {
          return !params.overdue;
        }
      };

      return ![
        priorityPredicate,
        statusPredicate,
        overduePredicate
      ].some(predicate => !predicate());
    });
  }

  public getAll(): Task[] {
    return clone(this.db.tasks);
  }

  public getById(id: string): Task | undefined {
    const task = this.db.tasks.find(task => task.id === id);
    if (task) {
      return clone(task);
    }
    return undefined;
  }

  public removeById(id: string): boolean {
    const updatedDb = this.db.tasks.filter(task => task.id !== id);
    const res = updatedDb.length !== this.db.tasks.length;
    this.db.tasks = updatedDb;
    return res;
  }

  public save(task: Task): Task {
    const existingTask = this.db.tasks.find(dbTask => dbTask.id === task.id);
    if (existingTask) {
      // Update an existing task
      existingTask.title = task.title;
      existingTask.status = task.status;
      existingTask.priority = Number(task.priority);
      existingTask.dueDate = task.dueDate;
      return existingTask;
    } else {
      // Create a new task
      const newTask = clone(task);
      this.db.tasks.push(newTask);
      return newTask;
    }
  }
}
