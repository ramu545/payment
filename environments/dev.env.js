const mongooseOptions = {
  useNewUrlParser: true,
  reconnectTries: 30,
  autoReconnect: true,
  useFindAndModify: false,
  reconnectInterval: 500,
  poolSize: 100,
  keepAlive: true,
  connectTimeoutMS: 10000,
  useCreateIndex: true,
};

const services = {
  databases: {
    restPanel: {
      name: 'restPanel',
      user: 'admin',
      password: 'admin123',
      url: '159.65.150.175:27017',
      dbName: 'restaurant_panel',
      options: mongooseOptions,
    },
    ordering: {
      name: 'ordering',
      user: 'admin',
      password: 'admin123',
      url: '159.65.150.175:27017',
      dbName: 'ordering',
      options: mongooseOptions,
    },
  },
  auth: {
    url: 'http://139.59.92.1:5000',
    login: { path: '/login', method: 'post' },
    signup: { path: '/signup', method: 'post' },
    verifySession: { path: '/authorize/verifySession', method: 'post' },
    sessionInfo: '/views/sessionInfo',
    getSession: { path: '/views/session', method: 'post' },
    credLogin: { path: '/credLogin', method: 'post' },
    initiateSignup: { path: '/initiateSignup', method: 'post' },
    resetPassword: { path: '/account/resetPassword', method: 'post' },
    changePassword: { path: '/account/changePassword', method: 'post' },
    accountStatus: { path: '/account/accountStatus', method: 'post' },
  },
  messaging: {
    url: 'http://139.59.77.43:4000',
    sendOtp: { path: '/sms/sendotp', method: 'post' },
    verifyOtp: { path: '/sms/verifyotp', method: 'post' },
    resendOtp: { path: '/sms/resendotp', method: 'post' },
    firebaseSubscribeToTopic: '/firebase/subscribeToTopic',
    getNotifications: { path: '/firebase/getNotifications', method: 'get' },
  },
  spaces: {
    url: 'http://139.59.77.43:2200',
    uploadOne: { path: '/api/upload/uploadOne', method: 'post' },
    uploadMany: 'api/upload/uploadMultiple',
  },
  excelHandler: {
    url: 'http://139.59.77.43:2206',
    excelMenuToJson: { path: '/api/extract/excelMenuToJson', method: 'post' },
    excelAddonToJson: { path: '/api/extract/excelAddonToJson', method: 'post' },
  },
};

module.exports = function getConfig(serviceName) {
  return services[serviceName];
};
