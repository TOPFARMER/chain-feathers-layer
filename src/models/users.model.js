// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const users = new mongooseClient.Schema({
    email: {type: String, unique: true, lowercase: true},
    password: { type: String },
    role: { type: String },
    publicKey: {type: String, unique: true, sparse:true},
    name: { type: String , required: true },
    sex: { type: String },
    tel: { type: String },
    institution: { type: String },
    faculty: { type: String },
    grade: { type: Number },
    class: { type: Number },
    intro: { type: String }
  }, {
    timestamps: true
  });

  return mongooseClient.model('users', users);
};
