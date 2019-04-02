// Initializes the `connectToPool` service on path `/connect-to-pool`
const createService = require('./connect-to-pool.class.js');
const hooks = require('./connect-to-pool.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/connect-to-pool', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('connect-to-pool');

  service.hooks(hooks);
};
