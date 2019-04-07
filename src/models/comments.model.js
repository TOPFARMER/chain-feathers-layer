// comments-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const comments = new mongooseClient.Schema({
    metadata: {
      signatory: { type: String, required: true },
      commitAddr: { type: String, required: true },
      signature: {
        r: { type: String, required: true },
        s: { type: String, required: true },
        recoveryParam: { type: Number, required: true }
      }
    },
    accessments: [{ _id: false, accessment: String, commitAddr: String, receiveAddr: String }], // 为JSON/TEXT格式，可直接hash
  }, {
    timestamps: true
  });

  return mongooseClient.model('comments', comments);
};
