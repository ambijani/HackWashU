const mongoose = require('mongoose');

const VerifyHistorySchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    unique: true
  },
  history: [
    {
      url: String,
      websiteTitle: String,
      emailSubject: String,
      date: {
        type: Date,
        default: Date.now
      }
    }
    // any other fields you need
  ]
});

module.exports = mongoose.model('VerifyHistory', VerifyHistorySchema);
