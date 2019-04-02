const request = require('request-promise');

// A request instance that talks to the API
const makeRequest = request.defaults({
  baseUrl: 'https://todo-backend-rails.herokuapp.com',
  json: true
});

/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  async find(params) {
    return makeRequest(`/`);
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    return makeRequest({
      uri: `/`,
      method: 'POST',
      body: data
    });
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
