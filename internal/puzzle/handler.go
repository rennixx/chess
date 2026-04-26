package puzzle

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"chesskrd/pkg/models"
)

type Handler struct {
	db *sql.DB
}

func NewHandler(db *sql.DB) *Handler {
	return &Handler{db: db}
}

func (h *Handler) Daily(w http.ResponseWriter, r *http.Request) {
	var p models.Puzzle
	err := h.db.QueryRow(
		"SELECT id, fen, solution_json, theme, difficulty FROM puzzles ORDER BY created_at DESC LIMIT 1",
	).Scan(&p.ID, &p.FEN, &p.SolutionJSON, &p.Theme, &p.Difficulty)
	if err != nil {
		http.Error(w, "no puzzles", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	difficulty := r.URL.Query().Get("difficulty")
	query := "SELECT id, fen, solution_json, theme, difficulty FROM puzzles"
	args := []interface{}{}
	if difficulty != "" {
		query += " WHERE difficulty = $1"
		args = append(args, difficulty)
	}
	query += " ORDER BY created_at DESC LIMIT 50"
	rows, err := h.db.Query(query, args...)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	var puzzles []models.Puzzle
	for rows.Next() {
		var p models.Puzzle
		rows.Scan(&p.ID, &p.FEN, &p.SolutionJSON, &p.Theme, &p.Difficulty)
		puzzles = append(puzzles, p)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(puzzles)
}
