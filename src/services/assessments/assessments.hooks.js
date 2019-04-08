const { authenticate } = require("@feathersjs/authentication").hooks;

const verifyAssessments = require("../../hooks/verify-assessments");

const blockEndpoint = require("../../hooks/block-endpoint");

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [verifyAssessments()],
    update: [verifyAssessments()],
    patch: [blockEndpoint()],
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
