const { serviceCaller, serviceOptions, asyncMongoose } = require('../../utils');
const utils = require('../utils');

const { InstaUserModel } = require('../models');

async function login(userId, username, password) {
  const instamojoSpecs = global.services('instamojo');
  const payload = {
    grant_type: instamojoSpecs.GRANT_PASSWORD,
    client_id: instamojoSpecs.CLIENTID,
    client_secret: instamojoSpecs.CLIENTSECRET,
    username,
    password,
  };
  const loginOptions = serviceOptions('instamojo', 'USER_BASED_LOGIN', payload, '', [], 'form');
  console.log(loginOptions);

  const loginResp = await serviceCaller(loginOptions);
  const updateInfo = await asyncMongoose.updateOne(InstaUserModel, { userId },
    {
      accessToken: loginResp.access_token,
      loginTime: new Date(),
      scope: loginResp.scope,
      refreshToken: loginResp.refresh_token,
      expiresIn: loginResp.expires_in,
      tokenType: loginResp.token_type,
    });
  console.log(updateInfo);
  return Promise.resolve(loginResp);
}

async function checkUserAccessToken(userId) {
  const { loginTime, expiresIn } = await asyncMongoose.findOneDoc(
    {
      userId,
    },
    InstaUserModel,
    { loginTime: 1, expiresIn: 1 },
  );
  return utils.checkTokenTimeValidty(new Date(loginTime), expiresIn);
}

async function signup(payload, appAccessToken) {
  const instamojoSpecs = global.services('instamojo');
  const signupPayload = {
    email: payload.email,
    password: payload.password,
    referrer: instamojoSpecs.REFERRER,
    phone: payload.phone,
  };
  const extraHeaders = { Authorization: `Bearer ${appAccessToken}` };
  const signupOptions = serviceOptions('instamojo', 'USER_SIGNUP', signupPayload, '', [], 'body', extraHeaders);
  const signupResp = await serviceCaller(signupOptions);
  const newUser = new InstaUserModel({
    userId: payload.userId,
    gatewayId: signupResp.id,
    username: signupResp.username,
    password: payload.password,
    name: signupResp.name,
    firstName: signupResp.first_name,
    lastName: signupResp.last_name,
    phone: signupResp.phone,
    email: signupResp.email,
    dateJoined: new Date(signupResp.date_joined),
    isEmailVerified: signupResp.is_email_verified,
    isPhoneVerified: signupResp.is_phone_verified,
    bio: signupResp.bio,
    location: signupResp.location,
    publicPhone: signupResp.public_phone,
    publicEmail: signupResp.public_email,
    publicWebsite: signupResp.public_website,
    profileImageUrl: signupResp.profile_image_url,
    tags: [],
    kyc: signupResp.kyc,
    resourceUri: signupResp.resource_uri,
  });
  await asyncMongoose.saveDoc(newUser);
  // console.log(newUserSaveInfo);
  console.log('document saved');
  return Promise.resolve(global.messages.success('PROFILE_CREATED'));
}

module.exports = { login, checkUserAccessToken, signup };
