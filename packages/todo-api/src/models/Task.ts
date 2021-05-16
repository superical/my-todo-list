import { v4 as uuid } from 'uuid';
import { TaskStatus } from '@todo-list/common';
import { TaskPriority } from '@todo-list/common';

export class Task {

  public id: string;

  public constructor(
    public title: string,
    public priority: TaskPriority = TaskPriority.Low,
    public status: TaskStatus = TaskStatus.ToDo,
    public dueDate: Date | null = null
  ) {
    this.id = uuid();
  }
}
