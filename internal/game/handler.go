package game

import (
	"encoding/json"
	"net/http"

	"chesskrd/internal/auth"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

type createRequest struct {
	Mode string `json:"mode"`
}

type moveRequest struct {
	SAN string `json:"san"`
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(auth.UserIDKey).(string)
	var req createRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		req.Mode = "async"
	}
	g, err := h.service.Create(userID, req.Mode)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(g)
}

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(auth.UserIDKey).(string)
	games, err := h.service.ListByUser(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(games)
}

func (h *Handler) Get(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Path[len("/api/games/"):]
	g, err := h.service.GetByID(id)
	if err != nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(g)
}

func (h *Handler) Move(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Path[len("/api/games/") : len(r.URL.Path)-len("/move")]
	var req moveRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}
	g, err := h.service.MakeMove(id, req.SAN)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(g)
}
