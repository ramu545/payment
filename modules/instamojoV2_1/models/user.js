const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  userId: {
    type: String,
    unique: true,
  },
  gatewayId: String,
  username: String,
  password: String,
  name: String,
  firstName: String,
  lastName: String,
  phone: String,
  email: String,
  dateJoined: String,
  isEmailVerified: String,
  isPhoneVerified: String,
  bio: String,
  location: String,
  publicPhone: String,
  publicEmail: String,
  publicWebsite: String,
  profileImageUrl: String,
  tags: [],
  kyc: {
    status: String,
    resource_uri: String,
  },
  resourceUri: String,
  accessToken: { type: String, default: '' },
  expiresIn: { type: String, default: '' },
  tokenType: { type: String, default: '' },
  scope: { type: String, default: '' },
  refreshToken: { type: String, default: '' },
  loginTime: { type: Date, default: null },
});

module.exports = mongoose.model('instauser', userSchema);
