const express = require('express');
const mongoose = require('mongoose');
const User = require('./modles/users'); // Correct the path if necessary

const app = express();
app.use(express.json()); // for parsing application/json

// Replace with your MongoDB URI
const mongoURI = 'mongodb+srv://dbUser:1ky8HUgvPijXiClT@emailhack.w6fwyqe.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected…');
  })
  .catch(err => console.log(err))

app.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send('User created');
  } catch (error) {
    res.status(400).send(error);
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
    res.status(500).send(error);
  }
});

const port = 3000; // or whatever port you want
app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`));