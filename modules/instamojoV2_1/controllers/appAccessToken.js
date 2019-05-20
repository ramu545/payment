const { asyncMongoose } = require('../../utils');
const { InstaCredModel } = require('../models');
const utils = require('../utils');

async function checkAppAccessToken() {
  const instamojoSpecs = global.services('instamojo');
  const { loginTime, expiresIn, accessToken } = await asyncMongoose.findOneDoc(
    {
      clientId: instamojoSpecs.CLIENTID,
    },
    InstaCredModel,
    { loginTime: 1, expiresIn: 1, accessToken: 1 },
  );
  const tokenValid = utils.checkTokenTimeValidty(new Date(loginTime), expiresIn);
  return Promise.resolve({ tokenValid, accessToken });
}

module.exports = { checkAppAccessToken };
