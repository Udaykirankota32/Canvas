# Collaborative Canvas Application

A real-time collaborative whiteboard application built using **React**, **HTML5 Canvas**, **Node.js**, and **Socket.IO**.

This project focuses on understanding **imperative canvas rendering**, **real-time multi-user synchronization**, and **system design challenges** involved in collaborative applications.

---

## Features

- Freehand drawing on canvas
- Brush tool with adjustable color and size
- Eraser tool (true eraser using pixel compositing)
- Clear canvas functionality (synchronized)
- Responsive canvas sizing
- Multi-user real-time drawing
- Late joiner canvas state recovery
- Room-based collaboration (Room ID + password)
- Canvas optimized to avoid unnecessary React re-renders

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

## Installation & Running the Project

### Prerequisites
- Node.js (v18+ recommended)
- npm

---

### Backend (Server)

 bash
cd server
npm install
npm start




## Tech Stack

- React
- JavaScript (ES6+)
- HTML5 Canvas
- CSS

## Testing the App with Multiple Users

- You can test real-time collaboration using multiple browser sessions.
-Steps
- Start both server and client
- Open the app in one browser window
- Open the same URL in:
- another browser, or
- an incognito window, or
- a different device on the same network

# Draw on the canvas in one window

Verify that:
- drawings appear in real time on other windows
- clearing the canvas syncs across users
- late joiners see existing drawings

## Room Testing

- Create a room using a Room ID and password

- Join the same room from another browser

- Confirm that drawings are isolated per room

- Late joiners receive the existing room canvas state

## Real-Time Collaboration Overview

- Each client establishes a persistent Socket.IO connection

- Drawing actions are emitted as stroke commands

- The server broadcasts drawing data to other users

- Clients replay received strokes locally

- Canvas rendering is handled imperatively using the Canvas 2D API

## Late Joiner Synchronization

- To prevent new users from seeing a blank canvas:

- The server stores drawing commands as canvas history

- New users explicitly request canvas history after connecting

- The client replays stored commands to reconstruct the canvas

- This avoids race conditions where events are emitted before listeners attach

## Global Canvas Clear

- Clicking Clear emits a clear-canvas event

- The server broadcasts the event to all connected clients

- Each client clears its own canvas imperatively

- Ensures destructive actions stay consistent across users

## Key Learnings

- Using useRef to manage canvas context and mutable values

- Handling mouse events (mousedown, mousemove, mouseup)

- Fixing canvas scaling issues with getBoundingClientRect

- Applying brush color and width at stroke start

- Treating canvas as an imperative, non-reactive surface

- Avoiding React re-renders during drawing for performance

- Designing real-time systems with explicit synchronization

## Technical Notes

- Canvas drawing logic is handled imperatively using the Canvas 2D API
- Toolbar controls update drawing behavior without triggering canvas re-renders
- Eraser is implemented using `globalCompositeOperation = "destination-out"`

## Undo / Redo Status

- Undo and redo were designed and partially implemented using a stroke history replay model, but are not fully functional in the current version.

- Intended Design

- Each stroke stored as an immutable command

- Undo removes the most recent stroke by a user

- Redo restores the removed stroke from a per-user stack

- Canvas is cleared and fully replayed after undo/redo

- Current Limitations

- Correct ordering under multi-user interleaving is complex

- Concurrent undo/redo requires timeline-based modeling

- Feature is documented but intentionally left incomplete

## Known Issues & Limitations

- Canvas data is stored in server memory only

- All data is lost on server restart

- No database-backed persistence

-- Undo/redo is incomplete

- Cursor/pointer indicators are planned but not implemented

- Limited mobile and touch input support

- Canvas resolution depends on client viewport size

## Total Time Spent on the Project

- Approximate total time: 45–53 hours

# Breakdown
- Canvas fundamentals & React integration: ~10 hours
- Real-time synchronization (Socket.IO): ~12 hours
- Late joiner handling & state replay: ~8 hours
- Room-based collaboration: ~7 hours
- Debugging, refactoring & documentation: ~10 hours

Time includes learning, experimentation, debugging race conditions, and architectural design decisions.

## Future Improvements

- Persistent storage using a database

- Cursor and pointer indicators

- Robust undo/redo with timeline or snapshots

- Performance tuning for large canvases

- Authentication and access control

- Mobile and touch support

## Setup Instructions

```bash
git clone https://github.com/Udaykirankota32/Canvas.git
cd Canvas
npm install
npm start
```
