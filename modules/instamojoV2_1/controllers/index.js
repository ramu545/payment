const instaApp = require('./insta-app');
const instaUser = require('./user');
const instaUserAccess = require('./userAccessToken');
const instaAppAccess = require('./appAccessToken');
const instaPayment = require('./payment');

module.exports = {
  instaApp, instaUser, instaPayment, instaAppAccess, instaUserAccess,
};
