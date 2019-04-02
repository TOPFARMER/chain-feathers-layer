const { authenticate } = require('@feathersjs/authentication').hooks;

const verifySignature = require('../../hooks/verify-signature');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [verifySignature()],
    update: [verifySignature()],
    patch: [verifySignature()],
    remove: []
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
