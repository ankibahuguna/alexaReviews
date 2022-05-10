const Pack = require('./package');

module.exports = {
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    routes: { cors: { origin: ['*'] } },
  },
  register: {
    plugins: [
      {
        plugin: 'hapi-pino',
        options: {
          redact: ['req.headers.authorization'],
        },
      },
      {
        plugin: '@hapi/good',
        options: {
          ops: {
            interval: 1000,
          },
          reporters: {
            myConsoleReporter: [
              {
                module: '@hapi/good-squeeze',
                name: 'Squeeze',
                args: [{ log: '*', response: '*' }],
              },
              {
                module: '@hapi/good-console',
              },
              'stdout',
            ],
          },
        },
      },
      {
        plugin: './src/routes',
      },
      {
        plugin: './src/services',
      },
      {
        plugin: '@hapi/inert',
      },
      {
        plugin: '@hapi/vision',
      },
      {
        plugin: 'hapi-swagger',
        options: {
          info: {
            title: 'Alexa API Documentation',
            version: Pack.version,
          },
        },
      },
    ],
  },
};
