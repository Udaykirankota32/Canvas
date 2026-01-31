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


## Phase 2: Drawing Event Synchronization

### Goal
Synchronize drawing actions across multiple connected clients in real time.

### Approach
- Clients emit stroke events containing drawing metadata
- Server broadcasts events to other clients
- Each client renders remote strokes locally on canvas

# Data storing 
  {
    Tool,
    Color,
    BrushWidth,
    {fromX,fromY},
    {ToX,ToY}
  }