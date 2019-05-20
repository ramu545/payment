const { serviceCaller, serviceOptions, asyncMongoose } = require('../../utils');
const { InstaUserModel } = require('../models');
const utils = require('../utils');

// userid is the restaurant id
async function refreshAccessToken(userId, refreshToken) {
  const instamojoSpecs = global.services('instamojo');
  const refreshTokenPayLoad = {
    grant_type: instamojoSpecs.GRANT_REFRESH_TOKEN,
    client_id: instamojoSpecs.CLIENTID,
    client_secret: instamojoSpecs.CLIENTSECRET,
    refresh_token: refreshToken,
  };
  const refreshTokenOpt = serviceOptions('intamojo', 'REFERSH_TOKEN', refreshTokenPayLoad);
  const refreshedAccess = await serviceCaller(refreshTokenOpt);
  const docUpdateInfo = await asyncMongoose.updateOne(InstaUserModel,
    { userId },
    {
      accessToken: refreshedAccess.access_token,
      expiresIn: refreshedAccess.expires_in,
      refreshToken: refreshedAccess.refresh_token,
      scope: refreshedAccess.scope,
    });
  console.log(docUpdateInfo);
  return Promise.resolve({ accessToken: refreshedAccess.accessToken });
}

async function checkUserAccessToken(userId) {
  const {
    loginTime, expiresIn, accessToken, refreshToken,
  } = await asyncMongoose.findOneDoc(
    {
      userId,
    },
    InstaUserModel,
    {
      loginTime: 1, expiresIn: 1, accessToken: 1, refreshToken: 1,
    },
  );
  let tokenValid = false;
  if (loginTime) {
    tokenValid = utils.checkTokenTimeValidty(new Date(loginTime), expiresIn);
  }
  return Promise.resolve({ tokenValid, accessToken, refreshToken });
}

module.exports = { refreshAccessToken, checkUserAccessToken };
