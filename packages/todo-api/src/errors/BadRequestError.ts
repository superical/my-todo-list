export class BadRequestError extends Error {

  public readonly statusCode: number = 400;

  constructor(message: string, public errors: string[] = []) {
    super(message);
    this.name = 'BadRequestError';
  }
}
