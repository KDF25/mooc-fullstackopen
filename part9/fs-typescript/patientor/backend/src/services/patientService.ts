import { v1 as uuid } from 'uuid';
import patientsData from '../../data/patients.ts';
import type {
  Entry,
  EntryWithoutId,
  NewPatient,
  NonSensitivePatient,
  Patient,
} from '../types.ts';

const patients: Patient[] = [...patientsData];

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ ssn: _ssn, entries: _entries, ...publicPatient }) => publicPatient);
};

const findById = (id: string): Patient | undefined => {
  return patients.find(patient => patient.id === id);
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    entries: [],
    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, entry: EntryWithoutId): Entry | undefined => {
  const patient = findById(patientId);

  if (!patient) {
    return undefined;
  }

  const newEntry: Entry = {
    id: uuid(),
    ...entry,
  };

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getNonSensitivePatients,
  findById,
  addPatient,
  addEntry,
};
