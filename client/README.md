# Canvas

Canvas is a React-based drawing application built using the HTML5 Canvas API. It allows users to draw freely on the screen using different tools while focusing on correct canvas sizing, event handling, and state synchronization in React.

## Features
- Freehand drawing on canvas
- Brush tool with adjustable color and size
- Eraser tool
- Clear canvas functionality
- Responsive canvas sizing

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

## Project Status
🚧 In progress — features and improvements are added incrementally with meaningful Git commits.

## Setup Instructions
```bash
git clone https://github.com/Udaykirankota32/Canvas.git
cd Canvas
npm install
npm start
