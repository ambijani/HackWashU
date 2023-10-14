const express = require('express');
const mongoose = require('mongoose');
const User = require('./modles/users');
const app = express();
const customCors = require('./cors');

app.use(express.json()); // for parsing application/json

// Enable custom CORS middleware for all requests
app.use(customCors); // Use the custom CORS middleware directly

// Replace with your MongoDB URI
const mongoURI = 'mongodb+srv://dbUser:1ky8HUgvPijXiClT@emailhack.w6fwyqe.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected…');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message); // More descriptive error message
  });

app.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send('User created');
  } catch (error) {
    console.error('Error during user registration:', error.message); // Log the error message
    res.status(500).send('Internal server error');
  }
});

app.post('/', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send('Cannot find user');
    }
    if (!(await user.comparePassword(req.body.password))) {
      return res.status(400).send('Invalid password');
    }
    res.send('Logged in');
  } catch (error) {
    console.error('Error during user login:', error.message); // Log the error message
    res.status(500).send(error.message); // Send back only the error message, not the whole error object
  }
});

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).send('404 Not Found');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.message);
  res.status(500).send('Internal Server Error');
});

const port = 3000; // or whatever port you want
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
