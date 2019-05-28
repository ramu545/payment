module.exports = function serviceOptions(service, api, payload = {}, queryParams = '', pathParams = [], attachPayloadTo = 'body', extraHeaders = {}) {
  const { BASE_URL, [api]: endpoint } = global.services(service);
  pathParams.forEach((param) => {
    console.log('params in service caller Key :::: ', param);
    console.log('params in service caller Value :::: ', param.value);
    endpoint.path = endpoint.path.replace(`:${param.key}`, param.value);
  });
  console.log('end point in service Call Option Path', endpoint.path);
  console.log('End Point Base Url', BASE_URL);
  console.log('End Point Method ', endpoint.method);
  // console.log('service call option PayLoad ', payload);
  console.log('extra Headers    ', extraHeaders);
  if (attachPayloadTo === 'body') {
    return {
      method: endpoint.method,
      uri: `${BASE_URL}${endpoint.path}${queryParams}`,
      body: payload,
      json: true,
      headers: {
        'content-type': 'application/json',
        ...extraHeaders,
      },
    };
  }
  // else if(attachPayloadTo != 'body'){
  //   return {
  //     method: endpoint.method,
  //     uri: `${BASE_URL}${endpoint.path}${queryParams}`,
  //     [attachPayloadTo]: payload,
  //     json: true,
  //     headers: {
  //       'content-type': 'application/json',
  //       ...extraHeaders,
  //     },
  
  //   };
  // } 
  else {
    return {
      method: endpoint.method,
      uri: `${BASE_URL}${endpoint.path}${queryParams}`,
      [attachPayloadTo]: payload,
      json: true,
      headers: {
        // 'content-type': 'application/x-www-form-urlencoded',
        'content-type': 'application/json',
        ...extraHeaders,
      },
    };
  }
};