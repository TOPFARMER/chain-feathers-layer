const app = require('../../src/app');

describe('\'assessments\' service', () => {
  it('registered the service', () => {
    const service = app.service('assessments');
    expect(service).toBeTruthy();
  });
});
