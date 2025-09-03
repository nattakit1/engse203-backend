// server.js

// 1️⃣ Import dependencies
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const helmet = require('helmet');
const Joi = require('joi');
require('dotenv').config();

// 2️⃣ Setup Express + HTTP + WebSocket
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // Allow any origin (for dev, adjust in production)
});

const PORT = process.env.PORT || 3001;
const APP_NAME = process.env.APP_NAME || 'ENGSE203 Express Server';

// 3️⃣ Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// 4️⃣ REST API routes
app.get('/', (req, res) => {
  res.send(`<h1>Hello from ${APP_NAME} (with WebSocket)!</h1>`);
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'This data is open for everyone!' });
});

// Joi schema
const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  birth_year: Joi.number().integer().min(1900).max(new Date().getFullYear())
});

app.post('/api/users', (req, res) => {
  const { error, value } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: 'Invalid data', details: error.details });
  }

  console.log('Validated data:', value);
  res.status(201).json({ message: 'User created successfully!', data: value });
});

// 5️⃣ WebSocket events
io.on('connection', (socket) => {
  console.log('🔌 A user connected:', socket.id);

  socket.on('chat message', (msg) => {
    console.log('💬 message: ' + msg);
    io.emit('chat message', `[${socket.id} says]: ${msg}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// 6️⃣ Start server
server.listen(PORT, () => {
  console.log(`🚀 ${APP_NAME} with WebSocket running on http://localhost:${PORT}`);
});
