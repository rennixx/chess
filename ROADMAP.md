# ROADMAP.md — Development Roadmap

## Phase 0 — Research (2 weeks)

* Validate demand in Kurdish regions
* Define localization scope (Sorani/Kurmanji)
* Benchmark against Chess.com and Lichess

---

## Phase 1 — MVP (6 weeks)

* Expo app setup
* Board UI + local engine (WASM)
* Puzzle system (offline-first)
* Auth system (JWT)
* Async gameplay endpoints
* SQLite caching

---

## Phase 2 — Beta Launch (4 weeks)

* Backend deployment (Go + Postgres + Redis)
* Leaderboards
* Initial user onboarding
* Performance tuning (low-end Android focus)

---

## Phase 3 — Real-Time Multiplayer (6 weeks)

* WebSocket layer
* Matchmaking queues
* Blitz/rapid modes
* Latency optimization

---

## Phase 4 — Community Features (4 weeks)

* Tournaments
* Clubs/schools integration
* Social layer (friends, invites)

---

## Phase 5 — Anti-Cheat & Scaling (ongoing)

* Engine correlation detection
* Behavior anomaly detection
* Horizontal scaling

---

## Phase 6 — Expansion

* Monetization (optional)
* Advanced training tools
* Multi-region deployment

---

## Milestones

* Month 2: MVP shipped
* Month 3: 1k users
* Month 6: Real-time stable
* Month 12: 50k users

---

## Risks & Mitigation

* Low concurrency → async-first gameplay
* Device limitations → adaptive engine depth
* Expo constraints → WASM + server fallback
* Cost scaling → gradual feature rollout
