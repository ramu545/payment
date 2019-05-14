const { serviceCaller, serviceOptions, asyncMongoose } = require('../../utils');
const utils = require('../utils');
const { InstaCredModel } = require('../models');

async function login() {
  const instamojoSpecs = global.services('instamojo');
  const payload = {
    grant_type: instamojoSpecs.GRANT_CLIENT_CREDENTIALS,
    client_id: instamojoSpecs.CLIENTID,
    client_secret: instamojoSpecs.CLIENTSECRET,
  };
  const loginOptions = serviceOptions('instamojo', 'APP_BASED_LOGIN', payload, '', [], 'form');
  console.log(loginOptions);

  const loginResp = await serviceCaller(loginOptions);
  console.log(loginResp);
  const updateInfo = await asyncMongoose.updateOne(InstaCredModel, { clientId: instamojoSpecs.CLIENTID, docType: 'instamojo' }, { accessToken: loginResp.access_token, loginTime: new Date(), scope: loginResp.scope });
  console.log(updateInfo);
  return Promise.resolve(loginResp);
}

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

module.exports = { login, checkAppAccessToken };
