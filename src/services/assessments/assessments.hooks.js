const { authenticate } = require("@feathersjs/authentication").hooks;

const verifyAssessments = require("../../hooks/verify-assessments");

const blockEndpoint = require("../../hooks/block-endpoint");

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [authenticate("jwt"), verifyAssessments()],
    update: [authenticate("jwt"), verifyAssessments()],
    patch: [blockEndpoint()],
    remove: [authenticate("jwt"), verifyAssessments()]
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
