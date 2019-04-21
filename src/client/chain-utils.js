const EC = require('elliptic').ec;
const SHA256 = require('crypto-js/sha256');
const ec = new EC('secp256k1');

class ChainUtil {
  static genKeyPair() {
    return ec.genKeyPair();
  }

  static importPrivateKey(priv) {
    return ec.keyFromPrivate(priv, 'hex');
  }

  static hash() {
    let data = [...arguments].reduce((str, arg) => {
      str = str + arg;
      return str;
    });
    // 相当于 SHA256(JSON.stringify(`${arg1}${arg2}`))
    return SHA256(JSON.stringify(data)).toString();
  }

  static verifySignature(account, signature, dataHash) {
    return ec.keyFromPublic(account, 'hex').verify(dataHash, signature);
  }

  static sign(priv, dataHash) {
    return ec.keyFromPrivate(priv, 'hex').sign(dataHash);
  }
}



module.exports = ChainUtil;
