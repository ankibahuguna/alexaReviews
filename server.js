const Glue = require('@hapi/glue');
const manifest = require('./manifest');

// const server = () => mongoose
//   .connect('mongodb://localhost/todos', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => Glue.compose(manifest, { relativeTo: __dirname }));

const server = Glue.compose(manifest, { relativeTo: __dirname});

server.then(app =>   app.start()
  .catch(console.error))

process
  .on('unhandledRejection', (reason, p) => {
    // eslint-disable-next-line no-console
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', (err) => {
    // eslint-disable-next-line no-console
    console.error(err, 'Uncaught Exception thrown');
  });
