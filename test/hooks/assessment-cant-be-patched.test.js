const feathers = require('@feathersjs/feathers');
const assessmentCantBePatched = require('../../src/hooks/assessment-cant-be-patched');

describe('\'assessmentCantBePatched\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      before: assessmentCantBePatched()
    });
  });

  it('runs the hook', async () => {
    expect.assertions(1);
    const result = await app.service('dummy').get('test');
    expect(result).toEqual({ id: 'test' });
  });
});
