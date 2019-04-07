const feathers = require('@feathersjs/feathers');
const processSignUpInfo = require('../../src/hooks/process-sign-up-info');
const { validUserData } = require('../data');
describe('\'process-sign-up-info\' hook', () => {
  let app, validUserData;

  beforeEach(() => {
    app = feathers();
    app.use('/users', {
      async create(data) {
        return data;
      }
    });

    app.service('users').hooks({
      before: {
        create: processSignUpInfo()
      }
    });
  });

  it('clean the additional sign up info as expected', async () => {
    expect.assertions(2);
    validUserData.additional = 'whatever';
    validUserData.additional = 'whatever';
    const result = await app.service('users').create(validUserData);
    expect(result.additional).toBeUndefined();
    expect(result.additional).toBeUndefined();
  });

  describe('handle blank data fields as expected', () => {
    let data;
    beforeEach(() => {
      data = validUserData;
    });

    it('case: email is blank', async () => {
      expect.assertions(1);
      data.email = null;
      await app.service('users').create(data).catch(err => {
        expect(err.message).toEqual('You must input your email.');
      });
    });

    it('case: password is blank', async () => {
      expect.assertions(1);
      data.password = null;
      await app.service('users').create(data).catch(err => {
        expect(err.message).toEqual('You must input your password.');
      });
    });
  });
});
