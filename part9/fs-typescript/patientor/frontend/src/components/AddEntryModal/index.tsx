import { Dialog, DialogTitle, DialogContent, Divider } from '@mui/material';

import AddEntryForm from './AddEntryForm';
import { Diagnosis, EntryWithoutId } from '../../types';

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EntryWithoutId) => Promise<void>;
  diagnoses: Diagnosis[];
}

const AddEntryModal = ({ modalOpen, onClose, onSubmit, diagnoses }: Props) => (
  <Dialog fullWidth open={modalOpen} onClose={onClose}>
    <DialogTitle>Add a new entry</DialogTitle>
    <Divider />
    <DialogContent>
      <AddEntryForm onSubmit={onSubmit} onCancel={onClose} diagnoses={diagnoses} />
    </DialogContent>
  </Dialog>
);

export default AddEntryModal;
