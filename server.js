const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const Poll = require('./models/Poll');

require('dotenv').config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Allow any origin or specific frontend URL
  methods: ['GET', 'POST'],
}));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
  },
});

let currentPoll = null;
let pollTimeout;
let pastPollsVisible = false;

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Poll creation by Teacher
  socket.on('createPoll', async (data) => {
    const { question, duration, options, correctAnswer } = data;

    currentPoll = {
      question,
      options,
      results: {},
      correctAnswer: correctAnswer || [],
    };

    // Emit the new poll to all connected clients
    io.emit('newPoll', { ...currentPoll, duration });

    // Poll timer logic
    pollTimeout = setTimeout(async () => {
      if (currentPoll) {
        const pollToSave = new Poll({
          question: currentPoll.question,
          options: currentPoll.options,
          correctAnswer: currentPoll.correctAnswer,
          results: currentPoll.results,
        });

        try {
          await pollToSave.save();
          console.log('Poll saved to database');
        } catch (err) {
          console.error('Error saving poll:', err);
        }

        io.emit('pollEnded', currentPoll);
        currentPoll = null;
      }
    }, duration * 1000);
  });

  // Answer submission by Student
  socket.on('submitAnswer', (data) => {
    const { answer } = data;
    if (currentPoll) {
      if (!currentPoll.results[answer]) {
        currentPoll.results[answer] = 1;
      } else {
        currentPoll.results[answer]++;
      }

      const isCorrect = currentPoll.correctAnswer.includes(answer);
      socket.emit('answerFeedback', {
        isCorrect,
        correctAnswer: currentPoll.correctAnswer,
      });
      io.emit('pollResults', currentPoll.results);
    }
  });

  // Handle poll expiration
  socket.on('pollTimeExpired', async () => {
    clearTimeout(pollTimeout);
    if (currentPoll) {
      const pollToSave = new Poll({
        question: 'Expired Poll',
        options: [],
        correctAnswer: [],
        results: currentPoll.results,
      });

      try {
        await pollToSave.save();
      } catch (err) {
        console.error('Error saving expired poll:', err);
      }

      io.emit('pollEnded', currentPoll);
      currentPoll = null;
    }
  });

  // Force end poll by teacher
  socket.on('endPoll', async () => {
    clearTimeout(pollTimeout);
    if (currentPoll) {
      const pollToSave = new Poll({
        question: 'No question provided',
        options: [],
        correctAnswer: [],
        results: currentPoll.results,
      });

      try {
        await pollToSave.save();
      } catch (err) {
        console.error('Error saving poll:', err);
      }

      io.emit('pollEnded', currentPoll);
      currentPoll = null;
    }
  });

  // Handle kicking a student
  socket.on('kickStudent', (studentId) => {
    const studentSocket = io.sockets.sockets.get(studentId);
    if (studentSocket) {
      studentSocket.emit('kicked');
      studentSocket.disconnect();
    }
  });

  // Get past polls
  socket.on('getPastPolls', async () => {
    try {
      const polls = await Poll.find();
      socket.emit('receivePastPolls', polls);
    } catch (err) {
      console.error('Error fetching past polls:', err);
    }
  });

  // Toggle past polls visibility
  socket.on('togglePastPollsVisibility', () => {
    pastPollsVisible = !pastPollsVisible;
    if (pastPollsVisible) {
      io.emit('receivePastPolls'); // Emit past polls when visibility is enabled
    } else {
      io.emit('clearPastPolls'); // Clear past polls display
    }
  });

  // Chat functionality
  socket.on('sendMessage', (data) => {
    io.emit('receiveMessage', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Fetch polls API
app.get('/api/polls', async (req, res) => {
  try {
    const polls = await Poll.find();
    res.json(polls);
  } catch (err) {
    console.error('Error fetching past polls:', err);
    res.status(500).json({ error: 'Failed to fetch past polls' });
  }
});

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
  
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
