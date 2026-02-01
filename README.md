# Canvas

Canvas is a React-based drawing application built using the HTML5 Canvas API. It allows users to draw freely on the screen using different tools while focusing on correct canvas sizing, event handling, and state synchronization in React.

## Features
- Freehand drawing on canvas
- Brush tool with adjustable color and size
- Eraser tool
- Clear canvas functionality
- Responsive canvas sizing
- True eraser implemented using canvas pixel compositing
- Canvas optimized to avoid unnecessary React re-renders

## Tech Stack
- React
- JavaScript (ES6+)
- HTML5 Canvas
- CSS

## Key Learnings
- Using `useRef` to manage canvas and drawing context
- Handling mouse events (`mousedown`, `mousemove`, `mouseup`)
- Fixing canvas scaling issues using `getBoundingClientRect`
- Applying current brush color and width at the start of each stroke
- Managing imperative canvas APIs inside a React app

## Technical Notes

- Canvas drawing logic is handled imperatively using the Canvas 2D API
- Toolbar controls update drawing behavior without triggering canvas re-renders
- Eraser is implemented using `globalCompositeOperation = "destination-out"`


## Real-Time Collaboration

This project uses Socket.IO to enable real-time collaboration between multiple users.

- Each client establishes a persistent socket connection with the server
- Drawing actions are emitted as lightweight stroke events
- The server relays drawing events to all connected clients except the sender
- Remote clients replay received stroke events on their local canvas

## Drawing Synchronization Flow

1. User draws on the canvas
2. Client captures stroke data (tool, color, width, coordinates)
3. Stroke data is emitted to the server via Socket.IO
4. Server broadcasts stroke data to other connected clients
5. Remote clients render the stroke locally on their canvas

## Real-time Collaboration

This project supports multiple users drawing on the same canvas in real time using Socket.IO.

- Each drawing action is sent as a drawing command (tool, color, brush size, coordinates).
- The server broadcasts drawing data to all connected users except the sender.
- Canvas rendering is handled imperatively using the HTML Canvas API.

## Late Joiner Synchronization

When a new user joins an ongoing session, they receive the existing canvas content instead of a blank screen.

This is implemented by:
- Storing drawing commands on the server as canvas history.
- Replaying the stored commands on the client when a new user connects.
- Using an explicit client request for canvas history to avoid race conditions where events are emitted before listeners are attached.

This ensures consistent canvas state for all users.

### Canvas Persistence
- Late joiners receive existing drawings via server-side history replay
- Canvas state persists across refreshes while server is running
- Persistent canvas screen is maintained even after the refresh 

## Current Features

- Single-user canvas drawing
- Multi-user real-time drawing synchronization
- Late joiner canvas state recovery
- Global canvas clear (synchronized across all users)

## Global Canvas Clear

The application supports a global canvas clear operation.

- When a user clicks the **Clear** button, a `clear-canvas` event is emitted.
- The server broadcasts this event to all connected clients.
- Each client imperatively clears its own canvas upon receiving the event.
- Canvas clearing is handled via server synchronization to maintain consistency.

This ensures that destructive actions remain authoritative and consistent across clients.

## Canvas Rooms

The application supports room-based collaboration.

### Features
- Users can create or join a room using a Room ID and password.
- Only users in the same room receive drawing events.
- Canvas state is isolated per room.
- Late joiners receive the existing canvas history of the room.

### Security
- Room authorization is handled on the server.
- Clients cannot access rooms without valid credentials.
- The server acts as the single source of truth for room membership.

### Performance Optimizations

- To improve real-time performance and scalability, the application includes the following optimization:
- Throttled Drawing Events
- Local canvas drawing is rendered on every mouse movement.
- Socket emissions for drawing events are throttled to reduce network traffic.
- This approach ensures smooth drawing while minimizing unnecessary socket messages.

## Benefits

-Lower network overhead
-Reduced server load
-Better scalability for multiple simultaneous users



## Limitations

- Canvas state is stored in server memory and persists only while the server is running.
- Refreshing the page causes the client to reconnect and request canvas history from the server; no client-side persistence is implemented.
- Long-term persistence using a database or file storage is not implemented.
- High-frequency drawing events are not yet throttled or batched, which may affect      performance under heavy load.
- Room data (canvas history, users, passwords) exists only in memory and is lost on server restart.
- No role-based permissions (e.g., room owner, moderator) are implemented.
- Undo/redo functionality is not implemented.
- Mobile and touch input support is limited.
- Canvas resolution is dependent on client viewport size and may differ across devices.


## Project Status

- Transport layer: Completed
- Real-time drawing sync: Completed
- Late joiner support: completed
- Undo/Redo: pending


# NOTE

Your server Responsibility:

Receive drawing data from one socket
Broadcast it to all other sockets



## Project Status
- Real-time multi-user collaboration (in progress)

## Setup Instructions
```bash
git clone https://github.com/Udaykirankota32/Canvas.git
cd Canvas
npm install
npm start
