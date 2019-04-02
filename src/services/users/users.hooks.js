const { authenticate } = require('@feathersjs/authentication').hooks;

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

const processSignUpInfo = require('../../hooks/process-sign-up-info');

const userManipulatePermission = require('../../hooks/user-manipulate-permission');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      hashPassword(),
      processSignUpInfo()
    ],
    update: [
      hashPassword(),
      authenticate('jwt'),
      userManipulatePermission(),
      processSignUpInfo()
    ],
    patch: [
      hashPassword(),
      authenticate('jwt'),
      userManipulatePermission(),
      processSignUpInfo()
    ],
    remove: [
      authenticate('jwt'),
      userManipulatePermission()
    ]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
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
