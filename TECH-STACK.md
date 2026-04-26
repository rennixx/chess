# TECH-STACK.md — Technology Stack

## 1. Overview

This document defines the technology stack optimized for performance, scalability, and low-latency mobile-first environments. The stack prioritizes rapid development, cross-platform compatibility, and efficient resource utilization under constrained network conditions.

---

## 2. Frontend

### Mobile (Primary Client)

* Framework: Expo (React Native)
* Language: TypeScript
* State Management: Zustand (lightweight, performant)
* Navigation: React Navigation
* Networking: Axios / Fetch API
* Local Storage:

  * AsyncStorage (lightweight persistence)
  * SQLite (game state, offline caching)

### Chess Engine Integration

* Engine: Stockfish (WASM build or native bridge if required)
* Execution:

  * WebAssembly (preferred for Expo compatibility)
  * Fallback: server-side evaluation if device constraints exist

### UI/UX

* Styling: NativeWind (Tailwind for React Native)
* Localization: i18n (Sorani/Kurmanji support)

---

## 3. Backend

### Core API

* Language: Go
* Framework: Chi (lightweight, high-performance HTTP router)
* Authentication: JWT (stateless, scalable)

### Real-Time Layer

* Protocol: WebSockets
* Implementation: Gorilla WebSocket / nhooyr
* Scaling: Stateless services behind load balancer

---

## 4. Data Layer

### Primary Database

* PostgreSQL

  * Strong consistency
  * Relational modeling for users, games, ratings

### Cache / Queue

* Redis

  * Matchmaking queues
  * Session caching
  * Rate limiting

### Storage

* Object storage (S3-compatible)

  * Game archives
  * Puzzle datasets
  * Static assets

---

## 5. Infrastructure

### Deployment

* Containerization: Docker
* Orchestration: Kubernetes

### Hosting

* Region: Middle East (latency optimization for Kurdistan users)

### CDN

* Edge delivery for static assets and updates

---

## 6. Observability

* Metrics: Prometheus
* Logging: Structured JSON logs
* Tracing: OpenTelemetry

---

## 7. Security

* TLS encryption (end-to-end)
* JWT validation (short-lived tokens + refresh strategy)
* Rate limiting (Redis-backed)
* Input validation and sanitization
* Server-authoritative game validation (zero trust client)

---

## 8. AI / Engine Strategy

### Client-Side

* Stockfish (WASM) for:

  * Offline play
  * Puzzle evaluation
* Depth capped for performance and battery efficiency

### Server-Side (Optional / Anti-Cheat)

* Engine-assisted validation
* Move correlation analysis for cheat detection

---

## 9. Performance Considerations

* Minimized payload sizes (compressed JSON)
* Efficient state synchronization (delta updates)
* Offline-first architecture
* Graceful degradation under poor connectivity

---

## 10. Tradeoffs

* Expo simplifies development but:

  * Limits low-level native control
  * Requires WASM or bridging for engine performance
* WebAssembly may introduce:

  * Increased memory usage on low-end devices
  * Execution constraints on older Android versions

Mitigation:

* Provide server-side fallback
* Optimize engine depth dynamically
* Use async gameplay as default mode
