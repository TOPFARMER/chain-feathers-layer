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
      console.log(JSON.stringify(result));
      const resultStr = result.map(res => JSON.stringify(res));
      const countObj = resultStr.reduce((count, msg) => {
        msg in count ? count[msg]++ : (count[msg] = 1);
        return count;
      }, {});

      for (let str in countObj) {
        if (countObj[str] >= Math.ceil((2 / 3) * serverNum)) {
          console.log(countObj[str]);
          block = Object.assign({ assessments }, JSON.parse(countObj[str]));
        }
      }
      console.log(block);
      throw new Error("正在施工");
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
    // console.log(context.data);
    return context;
  };
};
