import express, { type Request, type Response } from 'express';
import patientService from '../services/patientService.ts';
import { newPatientParser, errorMiddleware } from '../middleware.ts';
import type { NewPatient, Patient, PublicPatient } from '../types.ts';

const router = express.Router();

router.get('/', (_req, res: Response<PublicPatient[]>) => {
  res.send(patientService.getPublicPatients());
});

router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
  const addedPatient = patientService.addPatient(req.body);
  res.json(addedPatient);
});

router.use(errorMiddleware);

export default router;
