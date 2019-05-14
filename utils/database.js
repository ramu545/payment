

const mongoose = require('mongoose');

let registered = false;
const checkRetries = 4;
// let newDb = new Database();

async function checkConnection() {
  return new Promise((resolve, reject) => {
    console.log('checking db connection');
    if (mongoose.connection.readyState !== 1) {
      mongoose.connect(`mongodb://${this.url}/${this.dbName}`, this.options).then(() => {
        logger.info('Database connection successful');
        resolve();
      }).catch((err) => {
        console.timeLog(err);
        logger.error('Database connection error : ', err);
        reject();
      });
    } else if (mongoose.connection.readyState !== 2) {
      let retried = 0;
      const retries = setInterval(() => {
        if (retried <= checkRetries) {
          if (mongoose.connection.readyState === 1) {
            resolve();
            clearInterval(retries);
          } else {
            retried += 1;
          }
        } else {
          clearInterval(retries);
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('cannot connect after max number of retries.');
        }
      }, 1000);
    } else {
      resolve();
    }
  });
}

class Database {
  constructor(config) {
    if (!registered) {
      console.log('process close event resistered.');
      process.on('SIGINT', () => {
        registered = true;
        mongoose.connection.close(() => {
          console.log('Mongoose default connection is disconnected due to application termination');
          process.exit(0);
        });
      });
    }
    checkConnection.call(config);
  }
}

module.exports = { Database };
