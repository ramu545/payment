const request = require('request');

module.exports = function handleServiceCall(options) {
  return new Promise((resolve, reject) => {
    request(options, (err, httpResp, body) => {
      if (err) {
        console.log(err);
        // eslint-disable-next-line no-undef
        logger.error(err);
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({ message: 'UNKNOWN' });
      } else {
        console.log('responce from service');
        // console.log('responce from service call    ====== >>>>',body);
        // resolve({});
        // body = JSON.parse(body);
        if (Math.floor(httpResp.statusCode / 100) === 2) {
          resolve(body);
        }else if(body.success == true){
          resolve(body);
        } 
        else {
          // resolve(body);
          reject(Object.assign(body, { action: 'processed', status: httpResp.statusCode }));
        }
      }
    });
  });
};
