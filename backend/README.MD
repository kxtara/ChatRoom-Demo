# Backend README for the Chat Application

## Overview
The backend is built with Node.js, Express, and Socket.IO to handle real-time communication and room-based chat functionality.

## Features
- WebSocket support via Socket.IO
- Room-based communication
- CORS configuration to allow connections from the frontend

## Prerequisites
- Node.js (>= 14.x)
- npm or yarn

## Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

The backend will be running on `http://localhost:3000`.

## Key Endpoints
- **Socket.IO connection**: Handles WebSocket connections for real-time messaging.

## Configuration
If needed, modify the `cors` configuration in `index.js` to allow connections from specific origins:
```javascript
cors: {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
}
```