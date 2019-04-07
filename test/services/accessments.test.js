const app = require('../../src/app');

describe('\'accessments\' service', () => {
  it('registered the service', () => {
    const service = app.service('accessments');
    expect(service).toBeTruthy();
  });
});
