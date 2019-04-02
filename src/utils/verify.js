const EC = require('elliptic').ec;
const SHA256 = require('crypto-js/sha256');
const ec = new EC('secp256k1');

class Verify {
  static hash(data) {
    return SHA256(JSON.stringify(data)).toString();
  }

  static verifySignature(account, signature, dataHash) {
    return ec.keyFromPublic(account, 'hex').verify(dataHash, signature);
  }

  static verifyCommentSignatrue(comment) {
    return ChainUtil.verifySignature(
      comment.metadata.accountAddr,
      comment.metadata.signature,
      Verify.hash(comment.contents)
    );
  }
}

module.exports = Verify;
