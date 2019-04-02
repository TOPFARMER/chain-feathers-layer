// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const Verify = require('../utils/verify')

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    context.params.user.id

    return context;
  };
};
