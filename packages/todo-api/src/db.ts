import { Task } from './models/Task';
import { TaskPriority } from '@todo-list/common';
import { TaskStatus } from '@todo-list/common';
import { User } from './models/User';

export interface Database {
  tasks: Task[]
  users: User[]
}

/**
 * Dummy database
 */
const userBatman = new User(
  'batman',
  'e9cee71ab932fde863338d08be4de9dfe39ea049bdafb342ce659ec5450b69ae',
  [],
  'batman123'
);
const userSuperman = new User(
  'superman',
  '3f6f9a677482e4ff1435773d6e9d599a40f99f8eeabe68b45060c7143470e865',
  [userBatman],
  'superman123'
);
export const database: Database = {
  users: [userBatman, userSuperman],
  tasks: [
    new Task('Buy bubble tea', TaskPriority.Low, TaskStatus.Completed, userBatman),
    new Task('Complete todo exercise', TaskPriority.Medium, TaskStatus.InProgress, userSuperman, new Date()),
    new Task('Buy doge', TaskPriority.High, TaskStatus.Blocked, userSuperman, new Date(Date.now() - 1000 * 3600 * 24)),
    new Task('Ready for retirement', TaskPriority.High, TaskStatus.ToDo, userSuperman, new Date(Date.now() + 1000 * 3600 * 24 * 365))
  ]
};
