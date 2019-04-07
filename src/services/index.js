const users = require('./users/users.service.js');
const comments = require('./comments/comments.service.js');
const connectToPool = require('./connect-to-pool/connect-to-pool.service.js');
const assessments = require('./assessments/assessments.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(comments);
  app.configure(connectToPool);
  app.configure(assessments);
};
