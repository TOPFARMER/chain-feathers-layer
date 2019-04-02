// comments-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const comments = new Schema({
    metadata: {
      accountAddr: { type: String, required: true },
      signature: {
        r: { type: String, required: true },
        s: { type: String, required: true },
        recoveryParam: { type: Number, required: true },
        required: true
      },
      required: true
    },
    accessment: { type: String, required: true }, // 为JSON/TEXT格式，可直接hash
  }, {
    timestamps: true
  });

  return mongooseClient.model('comments', comments);
};
