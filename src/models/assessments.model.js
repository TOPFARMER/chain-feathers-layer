// assessments-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const assessments = new Schema(
    {
      hash: { type: String, requierd: true },
      // 必须指出hash = SHA256({
      //   publicKey,
      //   teacherName,
      //   studentName,
      //   contents
      // })
      publicKey: { type: String, required: true },
      teacherName: { type: String, required: true },
      studentName: { type: String, requierd: true },
      contents: { type: String, required: true },
      signature: {
        // 不一定需要
        r: String,
        s: String,
        recoveryParam: Number
      }, // _id不删除，用以确认审查员签署了哪些assessment
      isSignedByTchr: { type: Boolean, default: false }, // 使用hook隔离，仅内部可见以及操作，初始为false，
      isSignedBySup: { type: Boolean, default: false } // 该两项在经过审查员签署后发送到池时，在具体发送对象内部需要删除
    },
    {
      timestamps: true
    }
  );

  return mongooseClient.model("assessments", assessments);
};
