const feathers = require('@feathersjs/feathers');
const userManipulatePermission = require('../../src/hooks/user-manipulate-permission');
const { validUserData } = require('../data');
describe('\'user-manipulate-permission\' hook', () => {
  let app, userList, data, currentId, params;

  beforeEach(() => {
    app = feathers();
    currentId = 0;
    userList = [];
    data = validUserData;
    params = {
      user: Object.assign({
        id: 0,
      }, data)
    };

    app.use('/users', {
      // eslint-disable-next-line no-unused-vars
      async get(id, params) {
        return userList[id];
      },
      // eslint-disable-next-line no-unused-vars
      async find() {
        return userList;
      },
      // eslint-disable-next-line no-unused-vars
      async create(data, params) {
        const user = Object.assign({
          id: currentId++
        }, data);
        userList.push(user);
      },
      // eslint-disable-next-line no-unused-vars
      async update(id, data, params) {
        const user = Object.assign(id, data);
        userList[id] = user;
        return userList[id];
      },
      // eslint-disable-next-line no-unused-vars
      async patch(id, data, params) {
        const user = Object.assign(id, data);
        userList[id] = user;
        return userList[id];
      },
      // eslint-disable-next-line no-unused-vars
      async remove(id, data, params) {
        userList.splice(id, 1);
        return userList;
      }
    });

    app.service('users').hooks({
      before: {
        all: [],
        find: [userManipulatePermission()],
        get: [userManipulatePermission()],
        create: [],
        update: [userManipulatePermission()],
        patch: [userManipulatePermission()],
        remove: [userManipulatePermission()]
      }
    });

  });

  it('runs the hook', async () => {
    expect.assertions(1);
    for(let i=0; i<5; i++) {
      await app.service('users').create(data, params);
    }
    const result = await app.service('users').get(0, params);
    expect(result.publicKey).toEqual('foo_address');
  });


});
