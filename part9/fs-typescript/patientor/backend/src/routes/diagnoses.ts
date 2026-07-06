import express, { type Response } from 'express';
import diagnosisService from '../services/diagnosisService.ts';
import type { Diagnosis } from '../types.ts';

const router = express.Router();

router.get('/', (_req, res: Response<Diagnosis[]>) => {
  res.send(diagnosisService.getAll());
});

export default router;
