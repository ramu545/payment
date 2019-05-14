const mongoose = require('mongoose');

const { Schema } = mongoose;

const instaCredSchema = new Schema({
  clientId: {
    type: String,
    unique: true,
  },
  clientSecret: String,
  accessToken: String,
  expiresIn: String,
  tokenType: String,
  scope: String,
  loginTime: Date,
  docType: String,
});

module.exports = mongoose.model('instacred', instaCredSchema);
