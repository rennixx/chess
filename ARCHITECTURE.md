# ARCHITECTURE.md — System Architecture

## 1. Overview

Hybrid client-heavy architecture leveraging Expo (React Native) for offline-first computation and Go backend for authoritative validation and synchronization.

---

## 2. High-Level Components

* Expo Mobile Client (TypeScript)
* API Layer (Go)
* Game Service
* Matchmaking Service
* Rating Service
* Anti-Cheat Service
* Data Layer (Postgres + Redis)

---

## 3. Client Responsibilities (Critical Shift)

* Board rendering
* Local move generation
* Engine execution (WASM Stockfish)
* Game state caching (SQLite)
* Optimistic UI updates

---

## 4. Server Responsibilities

* Move validation (authoritative)
* Game persistence
* Rating updates
* Matchmaking
* Anti-cheat analysis

---

## 5. Data Flow

### Async Game

1. Client generates move locally
2. Sends move + FEN to API
3. Server validates using engine
4. Server persists state
5. Response syncs client

### Real-Time Game

1. WebSocket connection established
2. Moves broadcast via server
3. Server enforces clock + legality

---

## 6. State Management Strategy

* Client: optimistic + eventual consistency
* Server: single source of truth
* Conflict resolution: server override

---

## 7. Matchmaking

* Redis-backed queue
* Skill-based pairing (Glicko-2)
* Fallback to async mode

---

## 8. Scaling

* Stateless Go services
* Horizontal scaling via Kubernetes
* CDN for static delivery

---

## 9. Fault Tolerance

* Retry with exponential backoff
* Idempotent move submission
* Offline queue sync on reconnect

---

## 10. Performance Optimizations

* Delta updates instead of full state sync
* Compression (gzip)
* Reduced payload schemas

---

## 11. Security

* Zero trust client
* Server-side validation mandatory
* JWT auth + refresh rotation
