// Initializes the `assessments` service on path `/assessments`
const createService = require('feathers-mongoose');
const createModel = require('../../models/assessments.model');
const hooks = require('./assessments.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/assessments', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('assessments');

  service.hooks(hooks);
};
