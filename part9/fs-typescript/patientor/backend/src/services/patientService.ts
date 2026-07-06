import { v1 as uuid } from 'uuid';
import patientsData from '../../data/patients.ts';
import type { NewPatient, Patient, PublicPatient } from '../types.ts';

const patients: Patient[] = [...patientsData];

const getPublicPatients = (): PublicPatient[] => {
  return patients.map(({ ssn: _ssn, ...publicPatient }) => publicPatient);
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getPublicPatients,
  addPatient,
};
