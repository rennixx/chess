CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 1200,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  white_id UUID REFERENCES users(id),
  black_id UUID REFERENCES users(id),
  fen TEXT NOT NULL,
  pgn TEXT,
  moves_json JSONB DEFAULT '[]',
  mode TEXT NOT NULL DEFAULT 'async',
  status TEXT NOT NULL DEFAULT 'playing',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE puzzles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fen TEXT NOT NULL,
  solution_json JSONB NOT NULL,
  theme TEXT,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_games_white ON games(white_id);
CREATE INDEX idx_games_black ON games(black_id);
CREATE INDEX idx_puzzles_difficulty ON puzzles(difficulty);
