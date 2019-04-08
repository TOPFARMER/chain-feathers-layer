const { authenticate } = require('@feathersjs/authentication').hooks;

const verifySupervisorConfirm = require('../../hooks/verify-supervisor-confirm');

const blockEndpoint = require('../../hooks/block-endpoint');

module.exports = {
  before: {
    all: [],
    find: [blockEndpoint()],
    get: [blockEndpoint()],
    create: [authenticate('jwt'), verifySupervisorConfirm()],
    update: [authenticate('jwt'),verifySupervisorConfirm()],
    patch: [authenticate('jwt'), verifySupervisorConfirm()],
    remove: [blockEndpoint()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
