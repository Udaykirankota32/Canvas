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


## Project Status
Current version implements the core drawing tools.
Real-time collaboration and persistence will be added next.

## Setup Instructions
```bash
git clone https://github.com/Udaykirankota32/Canvas.git
cd Canvas
npm install
npm start
