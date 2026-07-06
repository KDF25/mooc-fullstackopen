import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Female,
  Male,
  Transgender,
} from '@mui/icons-material';

import { Diagnosis, Gender, Patient } from '../../types';
import patientService from '../../services/patients';
import EntryDetails from '../EntryDetails';
import AddEntryModal from '../AddEntryModal';

interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient>();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const data = await patientService.getById(id);
        setPatient(data);
      }
    };

    void fetchPatient();
  }, [id]);

  const getDiagnosisName = (code: string): string => {
    const diagnosis = diagnoses.find(d => d.code === code);
    return diagnosis ? diagnosis.name : code;
  };

  const submitNewEntry = async (values: Parameters<typeof patientService.addEntry>[1]) => {
    if (!patient) {
      return;
    }

    try {
      const addedEntry = await patientService.addEntry(patient.id, values);
      setPatient({
        ...patient,
        entries: patient.entries.concat(addedEntry),
      });
      setModalOpen(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error;
      }
      throw new Error('Unknown error');
    }
  };

  if (!patient) {
    return null;
  }

  const genderIcon = () => {
    switch (patient.gender) {
      case Gender.Male:
        return <Male />;
      case Gender.Female:
        return <Female />;
      default:
        return <Transgender />;
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1">
        {patient.name} {genderIcon()}
      </Typography>
      <Typography variant="body1">ssn: {patient.ssn}</Typography>
      <Typography variant="body1">occupation: {patient.occupation}</Typography>

      <Typography variant="h5" sx={{ marginTop: 2 }}>
        Entries
      </Typography>

      <List>
        {patient.entries.map(entry => (
          <ListItem key={entry.id} alignItems="flex-start">
            <ListItemText
              primary={`${entry.date} — ${entry.description}`}
              secondary={
                <>
                  {entry.diagnosisCodes && (
                    <Typography variant="body2" component="span">
                      {entry.diagnosisCodes
                        .map(code => `${code} ${getDiagnosisName(code)}`)
                        .join(', ')}
                    </Typography>
                  )}
                  <EntryDetails entry={entry} />
                </>
              }
            />
          </ListItem>
        ))}
      </List>

      <Button variant="contained" onClick={() => setModalOpen(true)}>
        Add New Entry
      </Button>

      <AddEntryModal
        modalOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={submitNewEntry}
        diagnoses={diagnoses}
      />
    </Box>
  );
};

export default PatientPage;
