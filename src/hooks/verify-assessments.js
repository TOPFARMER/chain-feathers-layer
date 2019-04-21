// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const Verify = require("../utils/verify");

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return async context => {
    if (context.method === "update") {
      const queryResult = await context.app.service("assessments").find({
        query: {
          _id: context.id
        }
      });
      if (queryResult.total === 0) {
        throw new Error("This assessments do not exist.");
      } else {
        // 审查员签名的评价不可更改
        const assessment = queryResult.data[0];
        if (assessment.isSignedBySup) {
          throw new Error(
            "This assessment wrriten in blockchian is unchangable."
          );
        }
      }
    }

    let isSignedByTchr = false;
    let {
      // 准备清洗数据
      hash,
      publicKey,
      teacherName,
      studentName,
      contents,
      signature
    } = context.data;

    if (!contents || !studentName) {
      throw new Error("Can not process empty data");
    }

    // 检查HTTP请求用户的角色
    const user = context.params.user;
    if (user.role !== "teacher" && user.role !== "supervisor") {
      throw new Error("You have no authority to render or sign a assessment.");
    }

    // 检查是否被篡改
    const currenthash = Verify.hash(
      publicKey,
      teacherName,
      studentName,
      contents
    );
    if (hash !== currenthash) {
      throw new Error("The data had been tampered");
    }

    // 如果存在签名
    if (signature) {
      // 用户列表查找该签名publicKey
      const queryResult = await context.app.service("users").find({
        query: {
          publicKey: user.publicKey
        }
      });
      if (queryResult.total === 0) {
        throw new Error("Your public address is invalid.");
      } else {
        // 检查实际签名用户的角色
        const user = queryResult.data[0];
        if (user.role !== "teacher" && user.role !== "supervisor") {
          throw new Error("You have no authority to sign a assessment.");
        }
      }
      // 检查签名有效性

      if (!Verify.verifySignature(publicKey, signature, hash)) {
        throw new Error("Your assessment's signature is invaild.");
      }
      // 数据无误，签名正确
      isSignedByTchr = true;
    }

    // 数据清洗完毕
    context.data = {
      hash,
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
