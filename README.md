# Polling System

**Checkout Here :** https://polling-system-frontend.vercel.app/

This is a polling system where teachers can create polls, students can participate in real-time, and both teachers and students can interact via chat. The system consists of two parts:

1. **Backend (Node.js, Express, Socket.io, MongoDB)** - Manages the server, polling logic, and data persistence.
2. **Frontend (React)** - The user interface for teachers and students to interact with the polling system.

## Project Structure

The project is divided into two directories:
- `polling-system-backend`: Contains the backend code.
- `polling-system-frontend`: Contains the frontend code.

### Prerequisites

- Node.js
- npm or yarn
- MongoDB (running locally or remotely)

## Backend Setup (polling-system-backend)

### 1. Install Dependencies

Navigate to the `polling-system-backend` directory and run:

```bash
npm install
This will install the required packages listed in package.json.

2. Environment Setup
Create a .env file in the polling-system-backend directory and add the following variables:

MONGO_URI=mongodb://localhost:27017/polling-system
PORT=5000

Adjust MONGO_URI if you are using a remote MongoDB instance.

3. Running the Backend
Start the backend server by running:

node server.js

The server will run on http://localhost:5000.

4. API Endpoints
GET /api/polls: Fetches the list of past polls.
Socket.io Events: Real-time communication between the server and clients is handled through socket events such as createPoll, submitAnswer, and pollResults.


Frontend Setup (polling-system-frontend)
1. Install Dependencies
Navigate to the polling-system-frontend directory and run:

npm install


This will install the required packages for the frontend.

2. Running the Frontend
To start the frontend application, run:

npm start
The frontend will be available at http://localhost:3000.

3. Application Features
Teacher Panel: Allows teachers to create new polls, view past polls, kick students, and view poll results in real-time.
Student Panel: Enables students to join the poll, submit answers, and view real-time poll results and feedback on their answers.
Chat: Both teachers and students can communicate via a real-time chat.
Directory Structure
Backend (polling-system-backend)

polling-system-backend/
├── models/
│   └── Poll.js        # Poll schema definition using Mongoose
├── server.js          # Main server file with Express and Socket.io setup
└── .env               # Environment variables
Frontend (polling-system-frontend)

polling-system-frontend/
├── src/
│   ├── components/
│   │   ├── Chat.js         # Chat component for real-time messaging
│   │   ├── Student.js      # Student view for participating in polls
│   │   └── Teacher.js      # Teacher view for creating polls and managing students
│   └── socket.js           # Socket.io client setup
└── public/

How to Use
Start MongoDB: Make sure your MongoDB server is running locally or remotely.
Run the Backend: From the polling-system-backend directory, start the backend server with node server.js.
Run the Frontend: From the polling-system-frontend directory, start the frontend application with npm start.
Access the App: Open http://localhost:3000 to use the polling system.
Technologies Used
Backend: Node.js, Express, Socket.io, MongoDB, Mongoose
Frontend: React, Socket.io-client, Tailwind CSS
Features
Real-Time Polling: Teachers can create polls, and students can participate in real-time.
Answer Feedback: Students receive immediate feedback on their answers after submitting.
Past Polls: Teachers can view past polls and their results.
Real-Time Chat: Teachers and students can communicate during the poll sessions.
Socket.io: Real-time updates for polling, results, and chat messages.
