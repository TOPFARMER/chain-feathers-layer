const mongoose = require('mongoose');

module.exports = function (app) {
  mongoose.connect(
    app.get('mongodb'),
    { useCreateIndex: true, useNewUrlParser: true }
  ).then(() => {console.log('Connection is successful!')});
  mongoose.Promise = global.Promise;

  app.set('mongooseClient', mongoose);
};
