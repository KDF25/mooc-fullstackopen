import { CoursePart } from '../types';
import { assertNever } from '../utils';

interface PartProps {
  part: CoursePart;
}

const Part = ({ part }: PartProps) => {
  switch (part.kind) {
    case 'basic':
      return (
        <p>
          {part.name} {part.exerciseCount} — {part.description}
        </p>
      );
    case 'group':
      return (
        <p>
          {part.name} {part.exerciseCount} — project exercises: {part.groupProjectCount}
        </p>
      );
    case 'background':
      return (
        <p>
          {part.name} {part.exerciseCount} — {part.description} —{' '}
          <a href={part.backgroundMaterial}>{part.backgroundMaterial}</a>
        </p>
      );
    case 'special':
      return (
        <p>
          {part.name} {part.exerciseCount} — {part.description} — required skills:{' '}
          {part.requirements.join(', ')}
        </p>
      );
    default:
      return assertNever(part);
  }
};

export default Part;
