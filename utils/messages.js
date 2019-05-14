function getMessage() {
  const successMessages = {
    PROFILE_CREATED: {
      data: { message: 'Profile created.', type: 'success', data: {} },
      status: 200,
    },
    PROFILE_UPDATED: {
      data: { message: 'Profile information updated.', type: 'success', data: {} },
      status: 200,
    },
    DATA_UPDATED: {
      data: { message: 'Information updated.', type: 'success', data: {} },
      status: 200,
    },
    FETCHED: {
      data: { message: 'Fetched', type: 'success', data: {} },
      status: 200,
    },
  };

  const errorMessages = {
    UNKNOWN: {
      status: 500,
      data: { message: 'Something happened, please contact customer care.', type: 'error' },
    },
    UPDATE_FAILED: {
      status: 500,
      data: { message: 'Update failed. Please contact customer care.', type: 'error' },
    },
    'Not Found': {
      data: { message: 'Endpoint not found.', type: 'error' },
      status: 404,
    },
    USER_ACCOUNT_CREATION_FAILED: {
      data: { message: 'User account creation failed.', type: 'error' },
      status: 400,
    },
    USER_ID_IN_USE: {
      data: { message: 'User id already in use.', type: 'error', code: 'user_exist' },
      status: 200,
    },
    AUTH_HEADER_NOT_FOUND: {
      data: { message: 'Auth header not found.', type: 'error' },
      status: 403,
    },
  };
  function error(key) {
    if (Object.prototype.hasOwnProperty.call(errorMessages, key)) {
      return errorMessages[key];
    }
    return errorMessages.UNKNOWN;
  }
  function success(key, extraText = '', data = {}) {
    let msg;
    if (Object.prototype.hasOwnProperty.call(successMessages, key)) {
      msg = successMessages[key].data.message + extraText;
    } else {
      msg = successMessages.UNKNOWN.data.message + extraText;
    }
    const obj = Object.assign({}, JSON.parse(JSON.stringify(successMessages[key])));
    obj.data.data = data;
    obj.data.message = msg;
    return obj;
  }
  return {
    error,
    success,
  };
}

module.exports = getMessage();
