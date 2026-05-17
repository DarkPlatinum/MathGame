# MindBattle Arena

A real-time multiplayer educational math RPG game built with React, Vite, Node.js, and Socket.IO.

## Running Locally

To run this project on your local machine, you need to start both the frontend and backend servers.

### 1. Start the Backend Server

Open a terminal window:
```bash
cd server
npm install
npm run dev
```
The server will run on `http://localhost:4000` (using nodemon to automatically restart on changes).

### 2. Start the Frontend Application

Open a **new** terminal window in the project root:
```bash
npm install
npm run dev
```
The frontend will run on `http://localhost:3000`.

### 3. Testing Multiplayer Locally

1. Open your web browser and go to `http://localhost:3000`.
2. Open an Incognito Window (or a different browser) and go to the same URL.
3. In Window 1: Click **Online Battle** -> **Create Room**. Copy the 6-character room code.
4. In Window 2: Click **Online Battle** -> Enter the code -> **Join**.
5. Both players click **I'm Ready!** to start the math battle.

---

## Deployment Guide

### Deploying the Backend (Render)

1. Create an account on [Render](https://render.com/).
2. Click **New** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following configuration:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Environment Variables**:
   - Add a new variable: `CLIENT_URL`
   - Value: `https://your-frontend-domain.vercel.app` (You will update this after deploying the frontend).
6. Click **Create Web Service**. 
7. Copy the generated Render URL (e.g., `https://mindbattle-server.onrender.com`).

### Deploying the Frontend (Vercel)

1. Create an account on [Vercel](https://vercel.com/).
2. Click **Add New** -> **Project**.
3. Import the same GitHub repository.
4. Set the **Framework Preset** to `Vite` (it should auto-detect).
5. **Environment Variables**:
   - Add a new variable: `VITE_SOCKET_URL`
   - Value: The Render backend URL you copied earlier (e.g., `https://mindbattle-server.onrender.com`).
6. Click **Deploy**.
7. Once finished, copy your final Vercel domain and put it inside the Render backend `CLIENT_URL` environment variable.

You can now play with your friends anywhere in the world!
