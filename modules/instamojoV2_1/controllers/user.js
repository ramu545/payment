const { serviceCaller, serviceOptions, asyncMongoose } = require('../../utils');
const { InstaUserModel } = require('../models');

//  here user id is the restaurant id
async function login(userId) {
  const { username, password } = await asyncMongoose.findOneDoc(
    { userId },
    InstaUserModel, { username: 1, password: 1 },
  );
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

/**
 *
 * @param {phone | first_name | last_name | location} data
 */
async function updateUserDetails(data, accessToken) {
  const { gatewayId } = await asyncMongoose
    .findOneDoc(
      { userId: data.userId },
      InstaUserModel, { gatewayId: 1 },
    );
  const userUpdateOptions = serviceOptions('instamojo', 'UPDATE_USER', data.instaUpdate, '', [{ id: gatewayId }], 'body', { Authorization: `Bearer ${accessToken}` });
  const updateInfo = await serviceCaller(userUpdateOptions);
  const {
    first_name: firstName,
    last_name: lastName,
    location,
    phone,
  } = updateInfo;
  const dbUpdateInfo = await asyncMongoose.updateOne(InstaUserModel, { userId: data.userId },
    {
      firstName, lastName, location, phone,
    });
  console.log(dbUpdateInfo);
  return Promise.resovle(global.messages.success('DATA_UPDATED'));
}

module.exports = {
  login,
  signup,
  updateUserDetails,
};
