const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/ws',
    createProxyMiddleware({
      target: 'http://158.160.109.57:8080',
      changeOrigin: true,
      ws: true,
      logLevel: 'debug'
    })
  );
};