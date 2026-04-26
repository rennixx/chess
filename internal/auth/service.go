package auth

import (
	"database/sql"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	db     *sql.DB
	secret string
}

func NewService(db *sql.DB, secret string) *Service {
	return &Service{db: db, secret: secret}
}

type Claims struct {
	UserID   string `json:"user_id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func (s *Service) Register(username, password string) (string, string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", "", err
	}
	var id string
	err = s.db.QueryRow("INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id", username, string(hash)).Scan(&id)
	if err != nil {
		return "", "", errors.New("username taken")
	}
	return s.generateTokens(id, username)
}

func (s *Service) Login(username, password string) (string, string, error) {
	var id, hash string
	err := s.db.QueryRow("SELECT id, password_hash FROM users WHERE username = $1", username).Scan(&id, &hash)
	if err != nil {
		return "", "", errors.New("invalid credentials")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)); err != nil {
		return "", "", errors.New("invalid credentials")
	}
	return s.generateTokens(id, username)
}

func (s *Service) ValidateToken(tokenStr string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(s.secret), nil
	})
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token")
	}
	return claims, nil
}

func (s *Service) generateTokens(userID, username string) (string, string, error) {
	now := time.Now()
	claims := &Claims{
		UserID:   userID,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(now),
		},
	}
	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(s.secret))
	if err != nil {
		return "", "", err
	}
	refreshClaims := &Claims{
		UserID:   userID,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(7 * 24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(now),
		},
	}
	refresh, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims).SignedString([]byte(s.secret))
	return token, refresh, err
}
