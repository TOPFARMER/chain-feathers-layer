const { authenticate } = require('@feathersjs/authentication').hooks;

const verifySignature = require('../../hooks/verify-signature');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [authenticate('jwt'), verifySignature()],
    update: [authenticate('jwt'), verifySignature()],
    patch: [authenticate('jwt'), verifySignature()],
    remove: [ authenticate('jwt') ]
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
