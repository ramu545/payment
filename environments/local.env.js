const instamojoUrls = require('../modules/instamojo/utils/requestUrls');

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
  payment: {
    name: 'payment',
    user: 'admin',
    password: 'admin123',
    url: '159.65.150.175:27017',
    dbName: 'payments',
    options: mongooseOptions,
  },
  instamojo: {
    CLIENTID: 'test_jb2RrNnSc6hkFBldAXTz0DyRqOCNYIsfGDp',
    CLIENTSECRET: 'test_Mvs5RxIijunJ2W8vsGPIjnUkLk0P6SXlCM1twQdpRIqB0hymT4hrJOL7LKqlScb4uKIZXxPoijfI86r2cG54B5Hq9HSqEmKrzp6m7V6PLW8O9arzuzUPRSmJQ7L',
    REFERRER: 'test_laalsa',
    GRANT_CLIENT_CREDENTIALS: 'client_credentials',
    GRANT_PASSWORD: 'password',
    GRANT_REFRESH_TOKEN: 'refresh_token',
    BASE_URL: 'https://test.instamojo.com',
    ...instamojoUrls(),
  },
};

module.exports = function getConfig(serviceName) {
  return services[serviceName];
};
