# PRD.md — Kurdish Chess Application

## 1. Overview

A mobile-first chess platform built with Expo (React Native), targeting Kurdish-speaking users with strong localization, offline capability, and low-bandwidth operation.

## 2. Objectives

* Deliver a fully localized chess experience (Sorani, Kurmanji)
* Ensure functionality under unstable connectivity
* Build a regional player network
* Minimize time-to-market via cross-platform stack

## 3. Target Users

* Mobile-first users (Android dominant)
* Students and casual players
* Low-to-mid bandwidth environments
* Regional clubs and institutions

## 4. Core Features

### 4.1 MVP

* Offline AI gameplay (client-side engine)
* Puzzle system (local + remote sync)
* Authentication (JWT-based)
* Async gameplay (turn-based HTTP)
* Ratings (Glicko-2)
* Localization (dynamic language switching)

### 4.2 Post-MVP

* Real-time multiplayer (WebSockets)
* Tournaments and clubs
* Social graph (friends, invites)
* Anti-cheat system

## 5. Functional Requirements

* Offline-first interaction model
* Deterministic game state sync
* Client renders board; server validates moves
* Seamless resume across sessions/devices
* Low payload network operations

## 6. Non-Functional Requirements

* Mobile performance (≤60fps UI)
* Memory footprint optimized for low-end devices
* Network resilience (retry, idempotency)
* Scalable backend (100k+ DAU)

## 7. Success Metrics

* DAU / MAU ratio
* Async game completion rate
* Crash-free sessions
* Retention (D7, D30)

## 8. Risks

* Expo limitations for native performance
* Engine performance on low-end devices
* Network fragmentation
