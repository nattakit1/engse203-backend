// server.js - Organized Express Server

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const Joi = require('joi');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || 'ENGSE203 Express Server';

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send(`<h1>Hello from ${APP_NAME}!</h1>`);
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'This data is open for everyone!' });
});

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

app.listen(PORT, () => {
  console.log(`🚀 ${APP_NAME} is running on http://localhost:${PORT}`);
});
