// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const Verify = require("../utils/verify");

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return async context => {
    let isSignedByTchr = false;
    let {
      // 准备清洗数据
      aHash,
      publicKey,
      teacherName,
      studentName,
      contents,
      signature
    } = context.data;


    // // 检查评论是否为空
    // if(!context.data) {
    //   throw new Error('Your assessment is empty.');
    // }

    // // 检查评论内容是否为空
    // if(!context.data.contents || !context.data.contents === []) {
    //   throw new Error('Your assessment is empty.');
    // }

    // 检查HTTP请求用户的角色
    const user = context.params.user;
    if (user.role !== "teacher" && user.role !== "supervisor") {
      throw new Error("You have no authority to render or sign a assessment.");
    }

    // 如果存在签名
    if (context.data.signature) {
      // 用户列表查找该签名publicKey
      const queryResult = context.app.service("users").find({
        query: {
          publicKey: {
            $in: [user.publicKey]
          }
        }
      });
      if (queryResult.total === 0) {
        throw new Error("Your public address is invalid.");
      } else {
        // 检查实际签名用户的角色
        const user = queryResult.data[0];
        if (user.role !== "teacher" && uesr.role !== "supervisor") {
          throw new Error("You have no authority to sign a assessment.");
        }
      }
      // 检查签名有效性
      const assessment = context.data;
      if (!Verify.verifyassessmentSignatrue(assessment)) {
        throw new Error("Your assessment's signature is invaild.");
      }
      // 数据无误，签名正确
      isSignedByTchr = true;
    }

    // 数据清洗完毕
    context.data = {
      aHash,
      publicKey,
      teacherName,
      studentName,
      contents,
      signature,
      isSignedByTchr
    };
    return context;
  };
};
