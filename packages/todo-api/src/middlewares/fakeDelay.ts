import { NextFunction, Request, Response } from 'express';
import { sleep } from '../utils/sleep';

/**
 * A middleware to have a fake delay in the request.
 * Just for fun so to simulate loading in the frontend for some of the parts.
 */
export const fakeDelay = async (req: Request, res: Response, next: NextFunction) => {
  const ms = Math.floor(Math.random() * 1000) + 200;
  await sleep(ms);
  next();
};
