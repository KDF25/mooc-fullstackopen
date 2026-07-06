import { parseBmiArgs } from './utils.ts';

export const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / Math.pow(height / 100, 2);

  if (bmi < 18.5) {
    return 'Underweight';
  }
  if (bmi < 25) {
    return 'Normal range';
  }
  if (bmi < 30) {
    return 'Overweight';
  }
  return 'Obese';
};

if (process.argv[1] === import.meta.filename) {
  try {
    const { height, weight } = parseBmiArgs(process.argv.slice(2));
    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}
