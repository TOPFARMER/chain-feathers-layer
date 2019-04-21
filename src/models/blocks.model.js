// blocks-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const blocks = new Schema({
    timestamps: { type: String, required: true },
    lastHash: String,
    hash: String,
    assessments: String,
    height: { type: Number, unique: true }
  });

  return mongooseClient.model("blocks", blocks);
};
