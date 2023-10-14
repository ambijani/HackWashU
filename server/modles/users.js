const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true // ensure unique emails
  },

  password: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now // default to current date
  }
});

// Hash password before saving the user
userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password') || user.isNew) {
    try {
      const salt = await bcrypt.genSalt(); // generate salt
      const hash = await bcrypt.hash(user.password, salt); // generate hash
      user.password = hash; // assign the hash as the user's password
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// This method compares the entered password with the stored hashed password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);
