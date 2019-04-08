const { authenticate } = require("@feathersjs/authentication").hooks;

const verifyassessments = require("../../hooks/verify-assessments");

const assessmentCantBePatched = require("../../hooks/assessment-cant-be-patched");

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [verifyassessments()],
    update: [verifyassessments()],
    patch: [assessmentCantBePatched()],
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
