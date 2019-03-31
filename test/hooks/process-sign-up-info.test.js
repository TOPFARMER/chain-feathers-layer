const feathers = require('@feathersjs/feathers');
const processSignUpInfo = require('../../src/hooks/process-sign-up-info');

describe('\'process-sign-up-info\' hook', () => {
  let app, validData;

  beforeEach(() => {
    app = feathers();
    validData = {
      email: 'test0@example.com',
      password: 'secret',
      role: 'student',
      publicKey: 'foo_address',
      info: {
        name: '小明',
        sex: 'male',
        tel: '13888888888',
        institution: '广州大学',
        faculty: '计算机科学与技术',
        grade: 2018,
        class: 3,
        resume: '市优秀三好学生',
      }
    };

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
    validData.additional = 'whatever';
    validData.info.additional = 'whatever';
    const result = await app.service('users').create(validData);
    expect(result.additional).toBeUndefined();
    expect(result.info.additional).toBeUndefined();
  });

  describe('handle blank data fields as expected', () => {
    let data;
    beforeEach(() => {
      data = validData;
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
