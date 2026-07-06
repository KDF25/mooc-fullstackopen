import {
  LocalHospital,
  Work,
  MonitorHeart,
} from '@mui/icons-material';
import { Typography } from '@mui/material';
import { Entry } from '../types';
import { assertNever } from '../utils';

interface Props {
  entry: Entry;
}

const EntryDetails = ({ entry }: Props) => {
  switch (entry.type) {
    case 'Hospital':
      return (
        <div>
          <Typography variant="body2">
            <LocalHospital /> {entry.type}
          </Typography>
          <Typography variant="body2">
            Discharged {entry.discharge.date}: {entry.discharge.criteria}
          </Typography>
        </div>
      );
    case 'OccupationalHealthcare':
      return (
        <div>
          <Typography variant="body2">
            <Work /> {entry.type} — {entry.employerName}
          </Typography>
          {entry.sickLeave && (
            <Typography variant="body2">
              Sick leave: {entry.sickLeave.startDate} to {entry.sickLeave.endDate}
            </Typography>
          )}
        </div>
      );
    case 'HealthCheck':
      return (
        <div>
          <Typography variant="body2">
            <MonitorHeart /> {entry.type} — rating: {entry.healthCheckRating}
          </Typography>
        </div>
      );
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
