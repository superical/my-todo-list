import validator from 'validator';
import { TaskPriority } from '@todo-list/common';
import { TaskStatus } from '@todo-list/common';
import { User } from '../models/User';

export class TaskQueryParamsDto {
  public priority?: TaskPriority;
  public status?: TaskStatus;
  public overdue?: boolean;
  public selfId?: string;
  public targetUserId?: string;

  public static validate(params: Record<string, any>): string[] {
    const { overdue, status, priority } = params;
    const errors: string[] = [];
    if (overdue) {
      if (!validator.isBoolean(String(overdue))) {
        errors.push('Parameter overdue should be a boolean');
      }
    }
    if (status) {
      const statusEnum = TaskStatus[TaskStatus[params.status as TaskStatus] as keyof typeof TaskStatus];
      if (!statusEnum) {
        errors.push('Parameter status is not a valid value');
      }
    }
    if (priority) {
      const priorityNumber = validator.isNumeric(String(priority));
      if (!priorityNumber) {
        errors.push('Parameter priority should be a number');
      }
      const priorityEnum = TaskPriority[TaskPriority[params.priority as number] as keyof typeof TaskPriority];
      if (priorityEnum === undefined) {
        errors.push('Parameter priority is not a valid value');
      }
    }
    return errors;
  }

  public static from(query: Record<string, any>): TaskQueryParamsDto {
    const params = new TaskQueryParamsDto();
    params.overdue = query.overdue !== undefined ? validator.toBoolean(query.overdue) : undefined;
    params.status = TaskStatus[TaskStatus[query.status as TaskStatus] as keyof typeof TaskStatus];
    params.priority = TaskPriority[TaskPriority[query.priority as number] as keyof typeof TaskPriority];
    params.selfId = query.selfId;
    params.targetUserId = query.targetUserId;
    return params;
  }
}
