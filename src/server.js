const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.Server({
    port: 9000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route([{
    method: 'GET',
    path: '/books',
    handler: () => 'Hello World!!',
  }]);

  await server.start();

  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
