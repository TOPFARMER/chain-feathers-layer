const app = require('../../src/app');

describe('\'connectToPool\' service', () => {
  it('registered the service', () => {
    const service = app.service('connect-to-pool');
    expect(service).toBeTruthy();
  });
});
