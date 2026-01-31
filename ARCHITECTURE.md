# Architecture Overview

This document describes the evolving architecture of canvas collaboration system.
The architecture is documented incrementally as new system capabilites are introduced



## Phase 1: Transport Layer (Real-Time Foundation)

### Goal
Establish a persistent, real-time communication channel between multiple clients.

### Components
- Client (React application)
- Server (Node.js + Express)
- Socket.IO for real-time communication

### Responsibilities
- Server accepts client connections
- Server tracks connected users
- Clients maintain a persistent socket connection
- No drawing data synchronization at this stage

### Communication Model
- Bi-directional event-based communication using Socket.IO
- Connection lifecycle: connect → disconnect
