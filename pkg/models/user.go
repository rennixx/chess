package models

import "time"

type User struct {
	ID           string    `json:"id"`
	Username     string    `json:"username"`
	PasswordHash string    `json:"-"`
	Rating       int       `json:"rating"`
	CreatedAt    time.Time `json:"created_at"`
}

type Game struct {
	ID        string    `json:"id"`
	WhiteID   *string   `json:"white_id"`
	BlackID   *string   `json:"black_id"`
	FEN       string    `json:"fen"`
	PGN       string    `json:"pgn"`
	MovesJSON string    `json:"moves_json"`
	Mode      string    `json:"mode"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Puzzle struct {
	ID           string `json:"id"`
	FEN          string `json:"fen"`
	SolutionJSON string `json:"solution_json"`
	Theme        string `json:"theme"`
	Difficulty   string `json:"difficulty"`
}
