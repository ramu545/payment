const localConfig = require('../environments/local.env');
const devConfig = require('../environments/dev.env');
const prodConfig = require('../environments/prod.env');
const testConfig = require('../environments/test.env');

const config = {
  local: {
    server: {
      port: 3004,
      hostname: '0.0.0.0',
    },
    services: localConfig,
  },
  dev: {
    server: {
      port: 3004,
      hostname: '0.0.0.0',
    },
    services: devConfig,
  },
  prod: {
    server: {
      port: 3004,
      hostname: '0.0.0.0',
    },
    services: prodConfig,
  },
  test: {
    server: {
      port: 3004,
      hostname: '0.0.0.0',
    },
    services: testConfig,
  },
};

function getConfig(env) {
  return config[env];
}

module.exports = getConfig;
