import { v4 as uuid } from 'uuid';
import { TaskStatus } from '@todo-list/common';
import { TaskPriority } from '@todo-list/common';
import { User } from './User';

export class Task {

  public id: string;

  public constructor(
    public title: string,
    public priority: TaskPriority = TaskPriority.Low,
    public status: TaskStatus = TaskStatus.ToDo,
    public author: User,
    public dueDate: Date | null = null,
    public isPrivate: boolean = false
  ) {
    this.id = uuid();
  }
}
