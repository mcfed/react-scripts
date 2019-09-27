'use strict';

const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/', { target: 'http://192.168.200.178:3000/mock/77/soc/' }));
};
