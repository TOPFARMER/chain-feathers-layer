const users = require('./users/users.service.js');
const assessments = require('./assessments/assessments.service.js');
const blocks = require('./blocks/blocks.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(assessments);
  app.configure(blocks);
};
