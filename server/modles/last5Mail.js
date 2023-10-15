const mongoose = require('mongoose');

const LastFiveMailsSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    unique: true // This represents the primary recipient of the emails
  },
  mails: [
    {
      subject: String,
      body: String,
      dateReceived: Date,
      sender: String,
      recipients: [String], // Array of recipients' email addresses
    }
  ]
});

module.exports = mongoose.model('LastFiveMails', LastFiveMailsSchema);
