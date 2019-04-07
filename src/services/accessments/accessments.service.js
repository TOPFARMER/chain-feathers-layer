// Initializes the `accessments` service on path `/accessments`
const createService = require('feathers-mongoose');
const createModel = require('../../models/accessments.model');
const hooks = require('./accessments.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/accessments', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('accessments');

  service.hooks(hooks);
};
