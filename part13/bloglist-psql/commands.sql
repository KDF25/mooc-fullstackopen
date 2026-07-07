CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes)
VALUES (
  'Dan Abramov',
  'https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889',
  'On let vs const',
  0
);

INSERT INTO blogs (author, url, title, likes)
VALUES (
  'Matti Luukkainen',
  'https://mattiluukkainen.fi/haastattelu-2017/',
  'Kun MOOCit Helsingin yliopistoon tulivat',
  0
);
