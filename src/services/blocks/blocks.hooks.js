const { authenticate } = require('@feathersjs/authentication').hooks;
const blockEndpoint = require("../../hooks/block-endpoint");
const consensus = require('../../hooks/consensus');
const verifySupervisorConfirm = require('../../hooks/verify-supervisor-confirm.js');
const signedBySupervisor = require('../../hooks/signed-by-supervisor');
module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    // 不管有无登陆，只检查审查员的数字签名
    create: [verifySupervisorConfirm(), consensus()],
    update: [blockEndpoint()],
    patch: [blockEndpoint()],
    remove: [blockEndpoint()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [signedBySupervisor()],
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
