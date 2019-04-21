const EC = require("elliptic").ec;
const SHA256 = require("crypto-js/sha256");
const ec = new EC("secp256k1");

class Verify {
  static hash() {
    let data = [...arguments].reduce((str, arg) => {
      str = str + arg;
      return str;
    });
    // 相当于 SHA256(JSON.stringify(`${arg1}${arg2}`))
    return SHA256(JSON.stringify(data)).toString();
  }

  static verifySignature(pub, signature, datahash) {
    return ec.keyFromPublic(pub, "hex").verify(datahash, signature);
  }
}

module.exports = Verify;
