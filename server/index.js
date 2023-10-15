const express = require('express');
const mongoose = require('mongoose');
const User = require('./modles/users');
const VerifyHistory = require('./modles/verifyHistory');
const app = express();
const customCors = require('./cors');
const bodyParser = require('body-parser');
const { Buffer } = require('buffer');
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

// const { spawn } = require('child_process'); // Import the spawn function of the child_process module
const fetch = require('node-fetch'); 

app.post('/auth', async (req, res) => {
  try {
    if (!req.body.token) {
      return res.status(400).send('Token missing in the request');
    }

    const decodedToken = Buffer.from(req.body.token, 'base64').toString('ascii');

    // Prepare headers for the Google API request
    const apiHeaders = {
      'Authorization': `Bearer ${decodedToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    // Fetch user's email
    const apiResponse = await fetch('https://www.googleapis.com/gmail/v1/users/me/profile', { headers: apiHeaders });

    if (!apiResponse.ok) {
      const errorDetails = await apiResponse.json();
      console.error('API responded with an error: ', errorDetails);
      throw new Error(`Google API responded with status code ${apiResponse.status}`);
    }

    const userData = await apiResponse.json();
    const userEmail = userData.emailAddress;
    console.log(`User email is: ${userEmail}`);

    // Check if tempId is provided in the request
    if (!req.body.tempId) {
      console.error('tempId not provided in the request');
      return res.status(400).send('tempId not provided in the request');
    }
    
    const { tempId } = req.body;

    if (!tempId || typeof tempId !== 'string') {
      console.error('Invalid tempId provided in the request');
      return res.status(400).send('Invalid tempId provided in the request');
    }

    // Find the VerifyHistory document for this tempId with the latest history entry
    const latestDocument = await VerifyHistory.findOne({ tempId: tempId }).sort({ 'history.date': -1 });

    if (!latestDocument) {
      console.log(`No verification history found for tempId: ${tempId}`);
      return res.status(404).send(`No verification history found for tempId: ${tempId}`);
    }

    // If the document doesn't have an email or if you wish to update it, you can do it here
    if (!latestDocument.userEmail) {
        latestDocument.userEmail = userEmail;
        await latestDocument.save();
    }

    // Update user email and remove tempId - assuming this function is defined elsewhere
    const updatedRecord = await updateUserEmailAndRemoveTempId(tempId, userEmail);
    console.log('User email updated successfully, temporary ID removed!', updatedRecord);

    // Prepare the Python script execution
    // const pythonProcess = spawn('python3', ['script.py', decodedToken]); // Replace 'script.py' with your actual Python script's name

    // Handle script's stdout
    // pythonProcess.stdout.on('data', (data) => {
    //   console.log(`stdout: ${data}`);
    // });

    // // Handle script's stderr
    // pythonProcess.stderr.on('data', (data) => {
    //   console.error(`stderr: ${data}`);
    // });

    // pythonProcess.on('close', (code) => {
    //   console.log(`child process exited with code ${code}`);
    // });

    // Send back a response to the client
    res.json({ 
      message: 'Token received, user email fetched, and verification history updated!', 
      token: decodedToken, 
      email: userEmail,
      updatedRecord: updatedRecord 
    });

  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).send(error.message);
  }
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

// Method to toggle the record based on the user's email
async function toggleRecordForUser(userEmail) {
  if (!userEmail) {
    throw new Error('User Email is missing');
  }

  // Find the verifyHistory for the user
  let verifyHistory = await VerifyHistory.findOne({ userEmail: userEmail });

  if (!verifyHistory) {
    throw new Error('No history record found for the provided user email');
  }

  // Toggle the canRecord value
  verifyHistory.canRecord = !verifyHistory.canRecord;

  // Save the record
  await verifyHistory.save();

  // Return the new state
  return verifyHistory.canRecord;
}

// Your existing route, refactored to use the new method
app.post('/toggleRecord', async (req, res) => {
  try {
    const { userEmail } = req.body; // extract user email from the request body
    const newRecordState = await toggleRecordForUser(userEmail); // use the new method here

    // Send back a success response
    res.json({ message: `Recording toggled successfully! New state: ${newRecordState}` });
  } catch (error) {
    console.error('Error while toggling recording:', error.message);
    res.status(500).send(error.message);
  }
});


// Method to update user's email and remove tempId
async function updateUserEmailAndRemoveTempId(tempId, userEmail) {
  if (!tempId || !userEmail) {
    throw new Error('History ID or User Email is missing');
  }

  // Find the verifyHistory by tempId
  const verifyHistory = await VerifyHistory.findOne({ tempId: tempId });

  if (!verifyHistory) {
    // Handle the case when no verifyHistory is found
    throw new Error(`No history record found with the provided ID: ${tempId}`);
  }

  // Update the user's email
  verifyHistory.userEmail = userEmail;

  // Remove the tempId
  verifyHistory.tempId = undefined;  // Set to undefined so it can be removed

  // Save the changes
  await verifyHistory.save();

  return verifyHistory;
}




app.put('/updateUserEmail', async (req, res) => {
  try {
    const { tempId, userEmail } = req.body;

    // Use the new method here
    const updatedRecord = await updateUserEmailAndRemoveTempId(tempId, userEmail);

    res.json({ message: 'User email updated successfully, temporary ID removed!', record: updatedRecord });
  } catch (error) {
    console.error('Error while updating user email:', error.message);
    res.status(500).send(error.message);
  }
});


app.post('/', async (req, res) => {
  try {
    const { title, url, tempId } = req.body; // Use tempId, generated by the client or your internal logic

    if (!title || !url || !tempId) {
      return res.status(400).send('Title, URL, or temporary ID is missing in the request');
    }

    // Check if a history record for this temporary ID already exists
    let verifyHistory = await VerifyHistory.findOne({ tempId: tempId });

    if (!verifyHistory) {
      // If not, create a new instance with the tempId
      verifyHistory = new VerifyHistory({
        tempId,
        canRecord: false,
        history: [{ websiteTitle: title, url }]
      });
    } else if (verifyHistory.canRecord) {
      // If a record does exist and canRecord is true, add a new history item
      verifyHistory.history.push({ websiteTitle: title, url });
    } else {
      // If canRecord is false, log the attempt
      console.log('Attempt to record information, but recording is disabled for this session.');
    }

    await verifyHistory.save();
    res.json({ message: 'Tab information received and saved successfully!' });
  } catch (error) {
    console.error('Error while receiving or saving tab information:', error.message);
    res.status(500).send(error.message);
  }
});

app.get('/get-user-data', async (req, res) => {
  try {
      // Fetch all VerifyHistory records
      const histories = await VerifyHistory.find({});

      // Prepare an object to hold the response
      const responseData = {};

      // Iterate over the histories
      histories.forEach(history => {
          // For each history record, prepare the data
          const userEmail = history.userEmail;
          const records = history.history.map(entry => {
              return {
                  title: entry.websiteTitle, // Note that we're using 'websiteTitle' here from the database, but renaming it to 'title' for the frontend
                  url: entry.url
              };
          });

          // If this user's email already exists in the responseData, append the new records. Otherwise, create a new array.
          if (responseData[userEmail]) {
              responseData[userEmail].push(...records);
          } else {
              responseData[userEmail] = records;
          }
      });

      // Send the prepared data to the frontend
      res.json(responseData);
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
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
