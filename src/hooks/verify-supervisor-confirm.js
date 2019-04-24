// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const Verify = require("../utils/verify");

// 我们并没有定义supervisor签名后的schema
// 在此处进行定义
/**
 *
 * signedPackage = new Schema {
 *  hash: {type: String, required:true},
 *  publicKey: {type: String, required:true},
 *  signature: signature: {
 *     r: String,
 *     s: String,
 *     recoveryParam: Number
 *   },
 *  assessments: JSON.stringify([{type: assessment}])
 * }
 *
 *  清洗阶段：
 *  1.只取出需要的数据
 *  2.检查角色与姓名是否匹配
 *  3.检查角色是否为审查员
 *  4.检查数据指纹是否正确
 *  5.检查签名是否正确
 *
 *  处理阶段
 *  1.遍历每一个assessment,map他们的_id到另一个数组
 *  2.内部为符合_id的库内assessment.isSignedBySup设置为True
 *  3.返回清洗后的数据包给服务
 *  4.把整个包发到区块链API
 **/

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return async context => {
    const startTime = Date.now();
    let { hash, publicKey, signature, assessments, timestamp } = context.data;

    const assessmentsArr = JSON.parse(assessments);

    if (!(assessmentsArr instanceof Array)) {
      throw new Error("Assessments should be a string array");
    }

    if (assessmentsArr.length === 0) {
      throw new Error("Assessments can not be empty!");
    }

    // 检查HTTP请求用户的角色
    const user = context.params.user;
    if (user.role !== "supervisor") {
      throw new Error("You have no authority to add a block.");
    }

    if (!signature) {
      throw new Error("Can not process block request without signature");
    }

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
      if (user.role !== "supervisor") {
        throw new Error("You have no authority to mine a block.");
      }
    }

    // 检查是否被篡改
    const currenthash = Verify.hash(publicKey, assessments, timestamp);
    if (hash !== currenthash) {
      throw new Error("The data had been tampered");
    }

    if (!Verify.verifySignature(publicKey, signature, hash)) {
      throw new Error("Your request's signature is invaild.");
    }

    // 检查每一条评价

    await Promise.all(
      assessmentsArr.map(async assessment => {
        let queryResult = await context.app
          .service("assessments")
          ._get(assessment._id);

        // 检查评价是否有冲突
        if (!queryResult) {
          throw new Error(`This assessment: ${assessment._id} is not exist.`);
        } else {
          // 检查实际签名用户的角色
          console.log(
            `We have assessment ${queryResult._id}: signed by sup: ${
              queryResult.isSignedBySup
            }`
          );
          if (queryResult.isSignedBySup) {
            throw new Error(
              `Assessment: ${assessment._id} had been wrapped up in block`
            );
          }
          if (!queryResult.isSignedByTchr) {
            throw new Error(`Assessment: ${assessment._id} without signature.`);
          }
        }

        queryResult = await context.app.service("users").find({
          query: {
            publicKey: assessment.publicKey
          }
        });
        if (queryResult.total === 0) {
          throw new Error(
            `Public address of assessment: ${assessment._id} is invalid.`
          );
        } else {
          // 检查实际签名用户的角色
          const user = queryResult.data[0];
          if (user.role !== "supervisor" && user.role !== "teacher") {
            throw new Error(
              `Signer of assessment: ${assessment._id} is invalid`
            );
          }
        }

        const {
          hash,
          publicKey,
          teacherName,
          studentName,
          contents,
          signature
        } = assessment;
        // 检查是否被篡改
        const currenthash = Verify.hash(
          publicKey,
          teacherName,
          studentName,
          contents
        );
        if (hash !== currenthash) {
          throw new Error(
            `Data of assessment: ${assessment._id} had been tampered`
          );
        }
        if (!Verify.verifySignature(publicKey, signature, hash)) {
          throw new Error(`Signature of ${assessment._id} is invaild.`);
        }

        // 先锁住评价，以防重复上链
        await context.app
          .service("assessments")
          ._patch(assessment._id, { isSignedBySup: true });
      })
    );

    //检查每条评价

    context.data = {
      hash,
      signature,
      publicKey,
      assessments,
      timestamp
    };

    const endTime = Date.now();
    console.log(`Time spending: ${endTime - startTime}`);
    return context;
  };
};
