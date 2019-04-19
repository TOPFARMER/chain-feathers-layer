// Initializes the `blocks` service on path `/blocks`
const createService = require('feathers-mongoose');
const createModel = require('../../models/blocks.model');
const hooks = require('./blocks.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/blocks', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('blocks');

  service.hooks(hooks);
};
