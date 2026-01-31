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
Synchronize canvas drawing actions across multiple users in real time.

### Approach
- Clients emit stroke events containing:
  - Tool type
  - Brush color
  - Brush width
  - Start and end coordinates
- Server relays stroke events to all connected clients except the sender
- Each client renders remote strokes locally on its own canvas

### Design Decisions
- Canvas remains stateless
- Server acts as a relay and does not render or store canvas state
- Drawing logic is imperative and independent of React rendering

# Data storing 
  {
    Tool,
    Color,
    BrushWidth,
    fromX,fromY,
    ToX,ToY,
  }

# server Responsibility
  Receive drawing data from one socket
  Broadcast it to all other sockets

## Key Architectural Principles

- Separation of concerns between UI, canvas rendering, and networking
- Event-driven synchronization instead of state replication
- Avoidance of React re-renders during drawing for performance
