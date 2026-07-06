import { type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { NewPatientSchema } from './types.ts';

export const newPatientParser = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction): void => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};
