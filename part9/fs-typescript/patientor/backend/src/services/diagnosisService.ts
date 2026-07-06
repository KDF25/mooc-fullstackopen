import diagnosesData from '../../data/diagnoses.ts';
import type { Diagnosis } from '../types.ts';

const getAll = (): Diagnosis[] => {
  return diagnosesData;
};

export default {
  getAll,
};
