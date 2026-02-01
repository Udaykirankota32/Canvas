# Collaborative Canvas Application

A real-time collaborative whiteboard application built using **React**, **HTML Canvas**, **Node.js**, and **Socket.IO**.  
Multiple users can draw simultaneously on a shared canvas with real-time synchronization.

This project focuses on understanding **real-time systems**, **imperative canvas rendering**, and **multi-user synchronization challenges**.

---

## Features

### Core Canvas Features
- Freehand drawing on canvas
- Brush tool with adjustable color and size
- True eraser implemented using canvas pixel compositing
- Clear canvas functionality
- Responsive canvas sizing
- Canvas optimized to avoid unnecessary React re-renders

### Real-Time Collaboration
- Multi-user real-time drawing synchronization
- Late joiner canvas state recovery
- Global canvas clear synchronized across all users
- Room-based collaboration with room ID and password

---

## Tech Stack

### Frontend
- React
- JavaScript (ES6+)
- HTML5 Canvas
- CSS

### Backend
- Node.js
- Express
- Socket.IO
- In-memory data storage

---

## Key Learnings

- Managing canvas rendering using `useRef`
- Handling mouse events (`mousedown`, `mousemove`, `mouseup`)
- Fixing canvas scaling issues using `getBoundingClientRect`
- Applying brush styles at stroke start instead of during render
- Integrating imperative Canvas APIs within a React application
- Designing real-time synchronization using event-based communication

---

## Technical Notes

- Canvas drawing is handled imperatively using the Canvas 2D API
- Toolbar controls update drawing behavior without triggering React re-renders
- Eraser uses `globalCompositeOperation = "destination-out"`
- Server acts as the authoritative source of truth

---

## Real-Time Drawing Synchronization

This project uses **Socket.IO** to enable real-time collaboration.

### Synchronization Flow
1. User draws on the canvas
2. Client captures stroke data (tool, color, brush size, coordinates)
3. Stroke data is emitted to the server
4. Server broadcasts the stroke to other connected users
5. Remote clients render the stroke locally

Drawing actions are transmitted as lightweight **stroke commands**, not canvas state.

---

## Late Joiner Synchronization

When a new user joins an ongoing session, they receive the existing canvas content instead of a blank screen.

This is implemented by:
- Storing stroke commands on the server
- Explicit client-side requests for canvas history
- Replaying stored commands on the canvas after connection

This avoids race conditions where events are emitted before listeners attach.

---

## Canvas Persistence

- Canvas state persists across page refreshes **while the server is running**
- On refresh, clients reconnect and request the current canvas history
- No client-side persistence is implemented

---

## Global Canvas Clear

- Clicking **Clear** emits a `clear-canvas` event
- Server broadcasts the event to all connected clients
- Each client clears its own canvas imperatively
- Ensures destructive actions remain synchronized and consistent

---

## Canvas Rooms

### Features
- Users can create or join rooms using a Room ID and password
- Drawing events are isolated per room
- Late joiners receive room-specific canvas history

### Security Model
- Room validation is handled on the server
- Server maintains room membership and canvas state
- Clients cannot access rooms without valid credentials

---

## Performance Considerations

- Continuous mouse movement generates high-frequency events
- Local drawing occurs on every mouse movement
- Socket emissions are throttled to reduce network traffic
- This improves scalability while maintaining smooth drawing

> Performance optimizations were intentionally deferred until correctness, room isolation, and late joiner consistency were achieved.

---

## Undo / Redo Status (Incomplete)

Undo and redo were **designed and partially implemented** using a **stroke history replay model**, but are **not fully functional** in the current version.

### Intended Design
- Each stroke is stored as an immutable command on the server
- Undo removes the latest stroke created by a specific user
- Redo restores the removed stroke from a per-user redo stack
- Canvas is cleared and fully replayed after each action

### Challenges
- Canvas is non-reversible and requires full replay
- Maintaining correct stroke order with multiple users is complex
- Concurrent undo/redo requires a more advanced timeline-based model

Undo/redo is documented as incomplete to avoid unstable behavior.

---

## Limitations

- Canvas data is stored in server memory only
- Data is lost on server restart
- No database-backed persistence
- Undo/redo incomplete
- Cursor indicators not implemented
- Limited mobile and touch support
- Canvas resolution depends on client viewport size

---

## Future Improvements

- Database-backed persistence
- Cursor and pointer indicators
- Robust undo/redo using snapshots or timelines
- Performance optimizations for large canvases
- Authentication and access control
- Mobile and touch support

---

## Running the Project

### Server
```bash
cd server
npm install
node server.js
