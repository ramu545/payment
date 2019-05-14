module.exports = function serviceOptions(service, api, payload = {}, queryParams = '', pathParams = [], attachPayloadTo = 'body', extraHeaders = {}) {
  const { BASE_URL, [api]: endpoint } = global.services(service);
  pathParams.forEach((param) => {
    endpoint.path = endpoint.path.replace(`:${param.key}`, param.value);
  });
  console.log(endpoint);
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
  return {
    method: endpoint.method,
    uri: `${BASE_URL}${endpoint.path}${queryParams}`,
    [attachPayloadTo]: payload,
    json: true,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      ...extraHeaders,
    },
  };
};
