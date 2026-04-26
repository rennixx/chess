package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	_ "github.com/lib/pq"

	"chesskrd/config"
	"chesskrd/internal/auth"
	"chesskrd/internal/game"
	"chesskrd/internal/puzzle"
)

func main() {
	cfg := config.Load()
	db, err := sql.Open("postgres", cfg.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	authService := auth.NewService(db, cfg.JWTSecret)
	authHandler := auth.NewHandler(authService)
	gameService := game.NewService(db)
	gameHandler := game.NewHandler(gameService)
	puzzleHandler := puzzle.NewHandler(db)

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RequestID)

	r.Route("/auth", func(r chi.Router) {
		r.Post("/register", authHandler.Register)
		r.Post("/login", authHandler.Login)
	})

	r.Route("/api", func(r chi.Router) {
		r.Use(authHandler.AuthMiddleware)
		r.Post("/games", gameHandler.Create)
		r.Get("/games", gameHandler.List)
		r.Get("/games/{id}", gameHandler.Get)
		r.Post("/games/{id}/move", gameHandler.Move)
		r.Get("/puzzles/daily", puzzleHandler.Daily)
		r.Get("/puzzles", puzzleHandler.List)
	})

	log.Printf("Server starting on :%s", cfg.Port)
	log.Fatal(http.ListenAndServe(":"+cfg.Port, r))
}
