const { addBookHandler } = require('./handlers');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: () => 'Hello World!!',
  },
];

module.exports = routes;
