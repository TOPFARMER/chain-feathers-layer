const MSGTYPES = {
  request: 1,
  response: 4,
};

class Protocol {
  /**
   *
   *
   * @static
   * @param {*} hash assessments, publicKey, timestamp的哈希
   * @param {*} signature 审查员的签名
   * @param {*} publicKey 审查员的公钥地址
   * @param {*} assessments 打包的评价内容
   * @param {*} timestamp 审查员发起的时间戳
   * @returns
   * @memberof Protocol
   */
  static requestMsg(hash, signature, publicKey, assessments, timestamp) {
    return {
      type: MSGTYPES.request,
      request: {
        hash,
        signature,
        publicKey,
        assessments,
        timestamp
      }
    };
  }

   /**
   *
   *
   * @static
   * @param {*} block 本节点生成的block
   * @returns
   * @memberof Protocol
   */
  static responseMsg(block) {
    const { timestamp, lastHash, hash, height } = block;
    return { type: MSGTYPES.response, timestamp, lastHash, hash, height };
  }
}

module.exports = { MSGTYPES, Protocol };
