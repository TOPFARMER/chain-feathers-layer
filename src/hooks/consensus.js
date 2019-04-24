// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { Protocol } = require("../client/protocol");
// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return async context => {
    const client = context.app.get("pbftclient");
    const { hash, signature, publicKey, assessments, timestamp } = context.data;
    try {
      let block = null;
      const result = await client.broadcastAndWaitForReply(
        Protocol.requestMsg(hash, signature, publicKey, assessments, timestamp)
      );
      const serverNum = client.servers.length;
      console.log(`Result List \n ${result}`);
      const countObj = result.reduce((count, msg) => {
        msg in count ? count[msg]++ : (count[msg] = 1);
        return count;
      }, {});

      for (let str in countObj) {
        if (countObj[str] >= Math.ceil((2 / 3) * serverNum)) {
          console.log(`Consensus: ${countObj[str]} \n ${str}`);
          const { timestamp, lastHash, hash, height } = JSON.parse(str);
          block = {
            timestamp,
            lastHash,
            hash,
            assessments,
            height
          };
        }
      }
      if (!block) throw new Error("延时等待一轮视图转换，未实现");
      context.data = block;
    } catch (err) {
      // 失败后重置评价
      const assessmentsArr = JSON.parse(assessments);
      await Promise.all(
        assessmentsArr.map(async assessment => {
          await context.app
            .service("assessments")
            ._patch(assessment._id, { isSignedBySup: false });
        })
      );
      throw new Error(`Error occur when hooks consensus :${err}`);
    }
    return context;
  };
};
