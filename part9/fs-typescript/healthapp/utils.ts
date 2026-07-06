export const isNotNumber = (argument: unknown): boolean =>
  isNaN(Number(argument));

interface BmiValues {
  height: number;
  weight: number;
}

interface ExerciseValues {
  target: number;
  dailyHours: number[];
}

export const parseBmiArgs = (args: string[]): BmiValues => {
  if (args.length < 2) {
    throw new Error('Not enough arguments');
  }
  if (args.length > 2) {
    throw new Error('Too many arguments');
  }

  if (!isNotNumber(args[0]) && !isNotNumber(args[1])) {
    return {
      height: Number(args[0]),
      weight: Number(args[1]),
    };
  }

  throw new Error('Provided values were not numbers!');
};

export const parseExerciseArgs = (args: string[]): ExerciseValues => {
  if (args.length < 2) {
    throw new Error('Not enough arguments');
  }

  if (isNotNumber(args[0])) {
    throw new Error('Provided values were not numbers!');
  }

  const target = Number(args[0]);
  const dailyHours = args.slice(1).map((arg) => {
    if (isNotNumber(arg)) {
      throw new Error('Provided values were not numbers!');
    }
    return Number(arg);
  });

  return { target, dailyHours };
};
