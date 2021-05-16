import { Task } from './models/Task';
import { TaskPriority } from '@todo-list/common';
import { TaskStatus } from '@todo-list/common';

export interface Database {
  tasks: Task[]
}

/**
 * Dummy database
 */
export const database: Database = {
  tasks: [
    new Task('Buy bubble tea', TaskPriority.Low, TaskStatus.Completed),
    new Task('Complete todo exercise', TaskPriority.Medium, TaskStatus.InProgress, new Date()),
    new Task('Buy doge', TaskPriority.High, TaskStatus.Blocked, new Date(Date.now() - 1000 * 3600 * 24)),
    new Task('Ready for retirement', TaskPriority.High, TaskStatus.ToDo, new Date(Date.now() + 1000 * 3600 * 24 * 365))
  ]
}
