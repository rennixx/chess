import * as SQLite from "expo-sqlite";

const DB_NAME = "chesskrd.db";
let db: SQLite.SQLiteDatabase | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DB_NAME);
    await initTables(db);
  }
  return db;
}

async function initTables(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      fen TEXT NOT NULL,
      pgn TEXT,
      moves_json TEXT,
      mode TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'playing',
      created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
      updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
    );
    CREATE TABLE IF NOT EXISTS puzzles (
      id TEXT PRIMARY KEY,
      fen TEXT NOT NULL,
      solution_json TEXT NOT NULL,
      theme TEXT,
      difficulty TEXT,
      attempts INTEGER NOT NULL DEFAULT 0,
      solved INTEGER NOT NULL DEFAULT 0
    );
  `);
}

export async function saveGame(game: {
  id: string; fen: string; pgn?: string; movesJson?: string; mode: string; status: string;
}): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `INSERT OR REPLACE INTO games (id, fen, pgn, moves_json, mode, status, updated_at) VALUES (?, ?, ?, ?, ?, ?, strftime('%s','now'))`,
    [game.id, game.fen, game.pgn ?? "", game.movesJson ?? "[]", game.mode, game.status]
  );
}

export async function loadGame(id: string): Promise<any | null> {
  const database = await getDb();
  return database.getFirstAsync("SELECT * FROM games WHERE id = ?", [id]);
}

export async function loadAllGames(): Promise<any[]> {
  const database = await getDb();
  return database.getAllAsync("SELECT * FROM games ORDER BY updated_at DESC");
}

export async function deleteGame(id: string): Promise<void> {
  const database = await getDb();
  await database.runAsync("DELETE FROM games WHERE id = ?", [id]);
}

export async function savePuzzleAttempt(puzzle: {
  id: string; fen: string; solutionJson: string; theme: string; difficulty: string; attempts: number; solved: boolean;
}): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `INSERT OR REPLACE INTO puzzles (id, fen, solution_json, theme, difficulty, attempts, solved) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [puzzle.id, puzzle.fen, puzzle.solutionJson, puzzle.theme, puzzle.difficulty, puzzle.attempts, puzzle.solved ? 1 : 0]
  );
}
