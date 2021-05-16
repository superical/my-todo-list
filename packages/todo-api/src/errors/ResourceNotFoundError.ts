export class ResourceNotFoundError extends Error {

  public readonly statusCode: number = 404;

  constructor(message: string, public errors: string[] = []) {
    super(message);
    this.name = 'ResourceNotFoundError';
  }
}
