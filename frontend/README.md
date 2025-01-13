# Frontend README for the Chat Application

## Overview
The frontend is a React application built using Vite for fast development and TailwindCSS for styling. It provides a clean and responsive user interface for chatting in real time.

## Features
- Real-time messaging UI
- Room-based chat support
- Responsive design with TailwindCSS

## Configuration
If the backend URL changes, update the Socket.IO client configuration in `src/socket.js`:
```javascript
const socket = io('http://localhost:3000');
```

## Styling
All styles are managed with TailwindCSS. Modify `tailwind.config.js` for customizations.