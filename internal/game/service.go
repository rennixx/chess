package game

import (
	"database/sql"
	"encoding/json"
	"time"

	"chesskrd/pkg/models"
)

type Service struct {
	db *sql.DB
}

func NewService(db *sql.DB) *Service {
	return &Service{db: db}
}

func (s *Service) Create(userID, mode string) (*models.Game, error) {
	g := &models.Game{
		FEN:    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
		Mode:   mode,
		Status: "playing",
	}
	err := s.db.QueryRow(
		"INSERT INTO games (white_id, fen, mode, status) VALUES ($1, $2, $3, $4) RETURNING id, created_at, updated_at",
		userID, g.FEN, g.Mode, g.Status,
	).Scan(&g.ID, &g.CreatedAt, &g.UpdatedAt)
	return g, err
}

func (s *Service) GetByID(id string) (*models.Game, error) {
	g := &models.Game{}
	err := s.db.QueryRow(
		"SELECT id, COALESCE(white_id::text,''), COALESCE(black_id::text,''), fen, COALESCE(pgn,''), COALESCE(moves_json::text,'[]'), mode, status, created_at, updated_at FROM games WHERE id = $1",
		id,
	).Scan(&g.ID, &g.WhiteID, &g.BlackID, &g.FEN, &g.PGN, &g.MovesJSON, &g.Mode, &g.Status, &g.CreatedAt, &g.UpdatedAt)
	return g, err
}

func (s *Service) ListByUser(userID string) ([]models.Game, error) {
	rows, err := s.db.Query(
		"SELECT id, COALESCE(white_id::text,''), COALESCE(black_id::text,''), fen, COALESCE(pgn,''), COALESCE(moves_json::text,'[]'), mode, status, created_at, updated_at FROM games WHERE white_id = $1 OR black_id = $1 ORDER BY updated_at DESC",
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var games []models.Game
	for rows.Next() {
		var g models.Game
		rows.Scan(&g.ID, &g.WhiteID, &g.BlackID, &g.FEN, &g.PGN, &g.MovesJSON, &g.Mode, &g.Status, &g.CreatedAt, &g.UpdatedAt)
		games = append(games, g)
	}
	return games, nil
}

func (s *Service) MakeMove(gameID, moveSAN string) (*models.Game, error) {
	g, err := s.GetByID(gameID)
	if err != nil {
		return nil, err
	}
	var moves []string
	json.Unmarshal([]byte(g.MovesJSON), &moves)
	moves = append(moves, moveSAN)
	movesJSON, _ := json.Marshal(moves)
	_, err = s.db.Exec("UPDATE games SET moves_json = $1, updated_at = $2 WHERE id = $3", movesJSON, time.Now(), gameID)
	if err != nil {
		return nil, err
	}
	return s.GetByID(gameID)
}
