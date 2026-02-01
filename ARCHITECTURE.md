# Architecture Overview

This document describes the architecture of the **Collaborative Canvas Application**.
The system is documented incrementally, reflecting how features were designed, implemented,
and refined during development.

The application follows a **client–server real-time architecture**.

- The **client** is responsible for rendering the canvas and capturing user input.
- The **server** acts as the synchronization authority.
- **Socket.IO** enables bidirectional real-time communication.

---

## High-Level Architecture

- Clients render canvas locally using the HTML Canvas API
- Clients emit drawing commands to the server
- The server relays commands to other connected clients
- Clients replay received commands imperatively

The system uses **command-based synchronization**, not shared state replication.

---

## Data Flow Diagram (Conceptual)

### Drawing Data Flow

1. User draws on the canvas (mouse movement)
2. Client captures a stroke segment:
   - tool
   - color
   - brush size
   - start coordinates
   - end coordinates
3. Client emits the stroke event to the server
4. Server receives the stroke and:
   - stores it in memory
   - broadcasts it to other users
5. Other clients receive the stroke
6. Each client renders the stroke locally on its own canvas

> The canvas itself never syncs state — only **drawing commands** are synchronized.

---

## WebSocket Communication Model

### Protocol Choice
- Socket.IO is used instead of raw WebSockets for:
  - automatic reconnection
  - event-based messaging
  - transport fallback (polling → WebSocket)
  - simpler client/server lifecycle management

---

### Message Formats

#### Drawing Command
json
{
  "userId": "socket-id",
  "tool": "brush | eraser",
  "color": "#000000",
  "brushSize": 5,
  "fromx": 120,
  "fromy": 200,
  "toX": 140,
  "toY": 210
}


---
## Events Sent and Received
Client → Server

canvas-data

clear-canvas

request-for-history

Create-Room

Join-Room

exit-Room

undo-canvas

redo-canvas

Server → Client

canvas-data

usersCanvasHistory

clear-canvas

users-update

Join-Room-Status

Exit-Room-Status
------------------------------------------------------------------

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

--------------------------------------------------------------------------------

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

-------------------------------------------------------------------------------------


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

-------------------------------------------------------------------------------------------------

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

-----------------------------------------------------------------------------------------------

## Phase 5: Room-Based Collaboration

### Goal
Isolate canvas collaboration into secure, independent rooms.

### Design
- Rooms are server-authoritative entities.
- Each room maintains its own:
  - Authorized users
  - Canvas history
- Socket.IO rooms are used for efficient event routing.

### Flow
1. Client requests to create or join a room.
2. Server validates credentials.
3. Socket joins the corresponding Socket.IO room.
4. Drawing and clear events are scoped to the room.
5. Late joiners request and replay room canvas history.

### Key Decisions
- Room access is validated exclusively on the server.
- Canvas history is stored per room.
- Clients never trust local state for authorization.


--------------------------------------------------------------------------------------------

## ## Phase 6: Performance Optimization (Throttled Real-Time Drawing)

### Status
Planned (Not Implemented)

### Goal
Reduce network overhead and improve scalability during real-time collaborative drawing.

### Problem
Continuous mouse movement generates a very high number of drawing events.
Emitting every mouse movement event leads to:
- Excessive socket traffic
- Increased server load
- Reduced scalability with multiple concurrent users

### Proposed Solution
Introduce throttling on client-side draw event emission.

- Local canvas rendering remains unthrottled for smooth user experience
- Network emissions are throttled to a fixed interval
- Only essential drawing segments are transmitted

### Design Considerations
- Throttling is applied only to socket emissions, not canvas rendering
- Throttle interval must balance smoothness and network efficiency
- This optimization is critical for large rooms and high concurrency

### Rationale for Deferral
This optimization was intentionally deferred to prioritize correctness,
room-based isolation, and late-joiner consistency before performance tuning.



-----------------------------------------------------------------------------------------------
 
## Phase 7: User Management and Presence 

### Implemented: User Management

### Purpose
Maintain awareness of connected users and associate identity metadata with real-time interactions.

### Design
- The server maintains a registry of currently connected users.
- Each user is assigned:
  - A unique identifier (socket ID)
  - A unique visual color upon connection

### Responsibilities
- Server acts as the **source of truth** for user presence.
- User presence updates are broadcast to all connected clients in real time.
- Clients use user metadata for:
  - Cursor indicators
  - Online user lists
  - Visual differentiation between collaborators

### Key Decisions
- User identity is server-assigned to prevent conflicts.
- User data is ephemeral and exists only for the duration of the session.
- No authentication or long-term user persistence is implemented at this stage.

### Planned: User Indicators (Cursor Presence)

User indicators will display real-time cursor positions of other active users.

- Cursor positions will be transmitted as transient real-time events.
- Indicator data will not be persisted or included in canvas history.
- Cursor updates will be throttled to minimize network overhead.

This feature is intentionally deferred to maintain system stability and focus on core collaboration functionality.


------------------------------------------------------------------------------------------

##  Phase-8  Undo / Redo Architecture (Attempted – Incomplete)

### Goal
Provide undo and redo functionality in a collaborative, multi-user canvas environment.

### Intended Design

Undo and redo were designed using a **command history replay model**, based on the following principles:

- Each drawing action is stored as an immutable stroke command on the server.
- Each stroke contains metadata such as:
  - User ID
  - Tool type
  - Brush size
  - Color
  - Start and end coordinates
- The server maintains:
  - A global stroke history (authoritative state)
  - A per-user redo stack

### Intended Undo Flow
1. A client emits an `undo` request with its user ID.
2. The server locates the most recent stroke created by that user.
3. The stroke is removed from the global history and stored in the user’s redo stack.
4. The server broadcasts the updated stroke history to all clients.
5. Clients clear the canvas and replay the full history.

### Intended Redo Flow
1. A client emits a `redo` request with its user ID.
2. The server restores the most recent undone stroke from the user’s redo stack.
3. The stroke is reinserted into the global history.
4. The updated history is broadcast to all clients.
5. Clients replay the canvas state.

### Current Status
 **Undo and redo are not fully functional in the current implementation.**

### Challenges Encountered
- HTML Canvas is **imperative and non-reversible**, requiring full history replay.
- Maintaining correct stroke ordering under multi-user interleaving proved complex.
- Handling concurrent undo/redo actions across users introduced consistency issues.
- Ensuring deterministic replay across all clients without visual artifacts was non-trivial.

### Lessons Learned
- Undo/redo in collaborative systems must be designed as **state reconstruction**, not state mutation.
- Stroke history ordering is more critical than per-user grouping.
- A timeline-based or versioned state model may be more appropriate for future iterations.

### Planned Improvements
- Refactor stroke history into a time-ordered command log.
- Introduce versioned snapshots for efficient replay.
- Scope undo/redo per room rather than globally.
- Add conflict resolution for simultaneous undo/redo actions.

Undo/redo functionality is intentionally documented as incomplete to reflect real-world engineering constraints and learning outcomes.

--------------------------------------------------------------------------------------
## Key Architectural Principles

- Canvas is an imperative, non-reactive surface

- React manages UI, not drawing state

- Server is the single source of truth

- Clients are stateless renderers

- Synchronization is event-driven

- Late joiners explicitly request history

- Reliability is prioritized over optimization


--------------------------------------------------------------------------------

| Feature                | Status          |
| ---------------------- | --------------- |
| Real-time drawing      | Implemented     |
| Late joiner recovery   | Implemented     |
| Room isolation         | Implemented     |
| Global clear           | Implemented     |
| Undo / redo            | Partial / WIP   |
| Performance throttling | Planned         |
| Cursor indicators      | Planned         |
| Persistent storage     | Not implemented |

-----------------------------------------------------------------------------

