# Architecture Overview

This document describes the evolving architecture of the Collaborative Canvas System.  
The architecture is documented incrementally as new system capabilities are introduced.

The application follows a client–server real-time architecture.

- The client is responsible for rendering the canvas and capturing user input.
- The server acts as the source of truth for synchronization.
- Socket.IO is used for real-time bidirectional communication.



## High-Level System Architecture

### Components
- Client: React application (Canvas UI + Tooling)
- Server: Node.js + Express
- Transport Layer: Socket.IO

### Responsibilities
- Clients capture drawing intent and render strokes locally.
- Server coordinates real-time data flow between clients.
- Canvas rendering is handled independently on each client.



## Phase 1: Transport Layer (Real-Time Foundation)

### Goal
Establish a persistent real-time communication channel between multiple users.

### Responsibilities
- Server accepts and tracks socket connections.
- Clients maintain persistent socket connections.
- Connection lifecycle is managed (connect / disconnect).
- No drawing synchronization at this stage.

### Communication Model
- Event-based, bi-directional communication using Socket.IO  
- Lifecycle: connect → active session → disconnect



## Phase 2: Drawing Event Synchronization

### Goal
Synchronize canvas drawing actions across multiple users in real time.

### Approach
- Each drawing action is emitted as a stroke command containing:
  - Tool type
  - Brush color
  - Brush width
  - Start and end coordinates
- Server relays stroke events to all connected clients except the sender.
- Each client renders remote strokes locally on its own canvas.

### Data Model

{
  tool,
  color,
  brushWidth,
  fromX,
  fromY,
  toX,
  toY
}


# server Responsibility
  Receive drawing data from one socket
  Broadcast it to all other sockets

## Key Architectural Principles

- Separation of concerns between UI, canvas rendering, and networking
- Event-driven synchronization instead of state replication
- Avoidance of React re-renders during drawing for performance


## Canvas Rendering Model

The HTML Canvas is treated as an imperative and stateless rendering surface.

- Canvas does not automatically react to state changes.
- Drawing styles (color, brush size, tool) are applied at the moment of drawing.
- React state is not used for canvas rendering to avoid unnecessary re-renders.
- Mutable values are managed using refs.



## Phase 3: Late Joiner Synchronization

# Problem

  New users joining an active session initially saw a blank canvas.

# Solution

- Server stores drawing commands in memory as canvas history.
- Newly connected clients explicitly request this history.
- Server responds with stored commands.
- Clients replay the commands to reconstruct the canvas state.

# Important Design Detail

Late joiners request canvas history only after socket listeners are attached, avoiding race conditions where events could be missed.


## Real-time Synchronization

Each drawing action is represented as a command containing:
- Tool type
- Color
- Brush size
- Start and end coordinates

The server:
- Receives drawing commands from clients
- Broadcasts them to other connected clients
- Stores commands in memory as canvas history

Late joiners explicitly request canvas history after initializing socket listeners to avoid race conditions.



## Key Engineering Decisions

- Socket.IO was chosen over raw WebSockets for reliability, reconnection handling, and simpler event-based communication.
- Socket initialization is handled explicitly during app mount to avoid unreliable module side effects.
- Clients request canvas history instead of relying on server-emitted events during connection.


### Mistake: Late joiners seeing a blank canvas
- Cause: Canvas state was not persisted on the server.
- Fix: Stored drawing commands on the server and replayed them for new users.

### Mistake: Missing Socket.IO events
- Cause: Server emitted events before client listeners were attached.
- Fix: Introduced explicit client-side requests for canvas history after initialization.

### Mistake: Assuming canvas reacts to value changes
- Cause: Treated canvas like a declarative UI.
- Fix: Applied drawing styles imperatively at stroke start.


## Phase 4: Global Destructive Actions Synchronization

### Goal
Ensure destructive canvas actions (such as clearing the canvas) are consistently applied across all connected clients.

### Design
- Destructive actions are treated as first-class real-time events.
- Clients do not perform local-only canvas mutations for shared actions.
- All clear operations are synchronized through the server.

### Flow
1. Client emits a `clear-canvas` event.
2. Server receives the event.
3. Server broadcasts `clear-canvas` to all connected clients.
4. Clients imperatively clear their canvas upon receiving the event.

### Key Decisions
- Canvas clearing is server-authoritative.
- Clients react to events instead of mutating canvas optimistically.
- Avoids inconsistent canvas state across users.

### Engineering Insight
Emit-only actions are insufficient in real-time systems.  
Each emitted event must have a corresponding listener to produce visible behavior.

### Mistake: Global clear only affected local canvas

- Cause: The client emitted a `clear-canvas` event but no other clients were listening for it.
- Fix: Implemented client-side listeners for `clear-canvas` and server-side broadcasting.
- Learning: Emitting an event has no effect unless all intended recipients have active listeners.
