import { TaskPriority } from '@todo-list/common';
import { TaskStatus } from '@todo-list/common';

export interface TaskDto {
  id: string
  title: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: Date | null
}
