import { v4 as uuid } from 'uuid';

export class Task {

  private readonly taskId: string;

  public constructor(
    public title: string,
    public isCompleted: boolean = false
  ) {
    this.taskId = uuid();
  }

  public get id(): string {
    return this.taskId;
  }
}
