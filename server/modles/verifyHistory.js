const mongoose = require('mongoose');

const VerifyHistorySchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: false,
    // Remove the unique constraint if duplicates for userEmail are allowed
  },
  canRecord: {
    type: Boolean,
    default: true,
  },
  tempId: {
    type: String,
    required: false,
    // Remove unique: false since it's not necessary; by default, fields are not unique
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
