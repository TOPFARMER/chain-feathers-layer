const { authenticate } = require("@feathersjs/authentication").hooks;

const verifyassessments = require("../../hooks/verify-assessments");

function forbiddenPatch() {     // 禁止部分更新内部状态
  throw new Error("assessment can not be patched！");
}

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [verifyassessments()],
    update: [verifyassessments()],
    patch: [forbiddenPatch()],
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
