const Plugin = {
  name: 'Routes',
  version: '1.0.0',
  register(server) {
    // eslint-disable-next-line global-require
    const Reviews = require('./reviews')(server);
    server.route(Reviews);
  },
};

module.exports = Plugin;
