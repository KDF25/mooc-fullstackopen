import { useState, useEffect, type SyntheticEvent } from 'react';
import axios from 'axios';
import diaryService from './services/diaryService';
import {
  NonSensitiveDiaryEntry,
  NewDiaryEntry,
  Weather,
  Visibility,
} from './types';

const weatherOptions: Weather[] = [
  Weather.Sunny,
  Weather.Rainy,
  Weather.Cloudy,
  Weather.Windy,
  Weather.Stormy,
];

const visibilityOptions: Visibility[] = [
  Visibility.Great,
  Visibility.Good,
  Visibility.Ok,
  Visibility.Poor,
];

const App = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [newDiary, setNewDiary] = useState<NewDiaryEntry>({
    date: '',
    weather: Weather.Sunny,
    visibility: Visibility.Great,
    comment: '',
  });

  useEffect(() => {
    const fetchDiaries = async () => {
      const entries = await diaryService.getAll();
      setDiaries(entries);
    };

    void fetchDiaries();
  }, []);

  const addDiary = async (event: SyntheticEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const addedEntry = await diaryService.create(newDiary);
      setDiaries(diaries.concat(addedEntry));
      setNewDiary({
        date: '',
        weather: Weather.Sunny,
        visibility: Visibility.Great,
        comment: '',
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message;
        setErrorMessage(message);
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    }
  };

  return (
    <div>
      <h1>Flight diaries</h1>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <form onSubmit={(event) => void addDiary(event)}>
        <div>
          <label htmlFor="date">date:</label>
          <input
            id="date"
            type="date"
            value={newDiary.date}
            onChange={(event) =>
              setNewDiary({ ...newDiary, date: event.target.value })
            }
          />
        </div>

        <div>
          weather:
          {weatherOptions.map((weather) => (
            <label key={weather}>
              <input
                type="radio"
                name="weather"
                value={weather}
                checked={newDiary.weather === weather}
                onChange={() => setNewDiary({ ...newDiary, weather })}
              />
              {weather}
            </label>
          ))}
        </div>

        <div>
          visibility:
          {visibilityOptions.map((visibility) => (
            <label key={visibility}>
              <input
                type="radio"
                name="visibility"
                value={visibility}
                checked={newDiary.visibility === visibility}
                onChange={() => setNewDiary({ ...newDiary, visibility })}
              />
              {visibility}
            </label>
          ))}
        </div>

        <div>
          <label htmlFor="comment">comment:</label>
          <input
            id="comment"
            value={newDiary.comment}
            onChange={(event) =>
              setNewDiary({ ...newDiary, comment: event.target.value })
            }
          />
        </div>

        <button type="submit">add</button>
      </form>

      <ul>
        {diaries.map((diary) => (
          <li key={diary.id}>
            {diary.date} — {diary.weather} — {diary.visibility}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
