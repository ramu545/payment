const instamojoUrls = require('../modules/instamojoV2_1/utils/requestUrls');
const instamojoUrlsV1 = require('../modules/instamojoV1/utils/requestUrls');
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
  instamojoV1: {
    API_KEY: 'test_d0d20f1f501723e824c1732f385',
    AUTH_TOKEN: 'test_3f29d0e77d041470f496db629b1',
    REFERRER: 'test_laalsa',
    // PRIVATE_SALT : '739abbce38fa433bbeb74be882c17d37',
    BASE_URL: 'https://test.instamojo.com/api/1.1',
    ...instamojoUrlsV1(),
  },
};

module.exports = function getConfig(serviceName) {
  return services[serviceName];
};
