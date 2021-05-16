import { TaskPriority } from '@todo-list/common';
import { TaskStatus } from '@todo-list/common';
import validator from 'validator';

export class CreateTaskDto {

  public constructor(
    public title: string,
    public priority: TaskPriority,
    public status: TaskStatus,
    public dueDate: Date | null = null
  ) {
  }

  public static validate(obj: Record<string, any>): string[] {
    const { title, priority, status, dueDate } = obj;
    const errors: string[] = [];
    if (!title || validator.isEmpty(title)) {
      errors.push('Task title cannot be empty');
    }

    if (!status || validator.isEmpty(status)) {
      errors.push('Property status cannot be empty');
    } else {
      const statusEnum = TaskStatus[TaskStatus[status as TaskStatus] as keyof typeof TaskStatus];
      if (!statusEnum) {
        errors.push('Property status is not a valid value');
      }
    }

    if (priority === undefined || validator.isEmpty(String(priority))) {
      errors.push('Property priority cannot be empty');
    } else {
      const priorityNumber = validator.isNumeric(String(priority));
      if (!priorityNumber) {
        errors.push('Property priority should be a number');
      }
      const priorityEnum = TaskPriority[TaskPriority[priority as number] as keyof typeof TaskPriority];
      if (priorityEnum === undefined) {
        errors.push('Property priority is not a valid value');
      }
    }

    if (dueDate === undefined || validator.isEmpty(String(dueDate))) {
      errors.push('Property dueDate cannot be empty');
    } else {
      // @ts-ignore
      if (dueDate !== null && !validator.isISO8601(dueDate, { strict: true, strictSeparator: true })) {
        errors.push('Due date must be in ISO-8601 format');
      }
    }

    return errors;
  }

  public static from(obj: Record<string, any>): CreateTaskDto {
    const props: CreateTaskDto = {
      title: obj.title ?? 'Untitled Task',
      status: TaskStatus[TaskStatus[obj.status as TaskStatus] as keyof typeof TaskStatus] ?? TaskStatus.ToDo,
      priority: TaskPriority[TaskPriority[obj.priority as number] as keyof typeof TaskPriority] ?? TaskPriority.Low,
      dueDate: (obj.dueDate && new Date(obj.dueDate)) ?? null
    };
    return new CreateTaskDto(
      props.title,
      props.priority,
      props.status,
      props.dueDate
    );
  }
}
