import { useState, type SyntheticEvent } from 'react';
import axios from 'axios';
import {
  TextField,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Button,
  SelectChangeEvent,
  FormControl,
  Chip,
  Box,
  OutlinedInput,
} from '@mui/material';

import {
  Diagnosis,
  EntryWithoutId,
  HealthCheckRating,
} from '../../types';

type EntryType = EntryWithoutId['type'];

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryWithoutId) => Promise<void>;
  diagnoses: Diagnosis[];
}

const entryTypes: EntryType[] = [
  'HealthCheck',
  'Hospital',
  'OccupationalHealthcare',
];

const healthRatingOptions = [
  { value: HealthCheckRating.Healthy, label: 'Healthy' },
  { value: HealthCheckRating.LowRisk, label: 'Low risk' },
  { value: HealthCheckRating.HighRisk, label: 'High risk' },
  { value: HealthCheckRating.CriticalRisk, label: 'Critical risk' },
];

const AddEntryForm = ({ onCancel, onSubmit, diagnoses }: Props) => {
  const [entryType, setEntryType] = useState<EntryType>('HealthCheck');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(
    HealthCheckRating.Healthy
  );
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [error, setError] = useState<string>();

  const onDiagnosisChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setDiagnosisCodes(typeof value === 'string' ? value.split(',') : value);
  };

  const buildEntry = (): EntryWithoutId => {
    const base = {
      date,
      description,
      specialist,
      ...(diagnosisCodes.length > 0 ? { diagnosisCodes } : {}),
    };

    if (entryType === 'HealthCheck') {
      return {
        ...base,
        type: 'HealthCheck',
        healthCheckRating,
      };
    }

    if (entryType === 'Hospital') {
      return {
        ...base,
        type: 'Hospital',
        discharge: {
          date: dischargeDate,
          criteria: dischargeCriteria,
        },
      };
    }

    return {
      ...base,
      type: 'OccupationalHealthcare',
      employerName,
      ...(sickLeaveStart && sickLeaveEnd
        ? { sickLeave: { startDate: sickLeaveStart, endDate: sickLeaveEnd } }
        : {}),
    };
  };

  const addEntry = async (event: SyntheticEvent) => {
    event.preventDefault();
    setError(undefined);

    try {
      await onSubmit(buildEntry());
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const message = e.response?.data
          ? JSON.stringify(e.response.data)
          : e.message;
        setError(message);
      } else {
        setError('Unknown error');
      }
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={(event) => void addEntry(event)}>
        <FormControl fullWidth sx={{ marginY: 1 }}>
          <InputLabel id="entry-type-label">Entry type</InputLabel>
          <Select
            labelId="entry-type-label"
            label="Entry type"
            value={entryType}
            onChange={(event) => setEntryType(event.target.value as EntryType)}
          >
            {entryTypes.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Date"
          type="date"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          value={date}
          onChange={({ target }) => setDate(target.value)}
          sx={{ marginY: 1 }}
        />
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
          sx={{ marginY: 1 }}
        />
        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
          sx={{ marginY: 1 }}
        />

        <FormControl fullWidth sx={{ marginY: 1 }}>
          <InputLabel id="diagnosis-codes-label">Diagnosis codes</InputLabel>
          <Select
            labelId="diagnosis-codes-label"
            label="Diagnosis codes"
            multiple
            value={diagnosisCodes}
            onChange={onDiagnosisChange}
            input={<OutlinedInput label="Diagnosis codes" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map(value => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {diagnoses.map(diagnosis => (
              <MenuItem key={diagnosis.code} value={diagnosis.code}>
                {diagnosis.code} — {diagnosis.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {entryType === 'HealthCheck' && (
          <FormControl fullWidth sx={{ marginY: 1 }}>
            <InputLabel id="health-rating-label">Health rating</InputLabel>
            <Select
              labelId="health-rating-label"
              label="Health rating"
              value={healthCheckRating}
              onChange={(event) =>
                setHealthCheckRating(Number(event.target.value) as HealthCheckRating)
              }
            >
              {healthRatingOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {entryType === 'Hospital' && (
          <>
            <TextField
              label="Discharge date"
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
              sx={{ marginY: 1 }}
            />
            <TextField
              label="Discharge criteria"
              fullWidth
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
              sx={{ marginY: 1 }}
            />
          </>
        )}

        {entryType === 'OccupationalHealthcare' && (
          <>
            <TextField
              label="Employer name"
              fullWidth
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
              sx={{ marginY: 1 }}
            />
            <TextField
              label="Sick leave start"
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={sickLeaveStart}
              onChange={({ target }) => setSickLeaveStart(target.value)}
              sx={{ marginY: 1 }}
            />
            <TextField
              label="Sick leave end"
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={sickLeaveEnd}
              onChange={({ target }) => setSickLeaveEnd(target.value)}
              sx={{ marginY: 1 }}
            />
          </>
        )}

        <Grid container justifyContent="space-between" sx={{ marginTop: 2 }}>
          <Grid size="auto">
            <Button
              color="secondary"
              variant="contained"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid size="auto">
            <Button type="submit" variant="contained">
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddEntryForm;
