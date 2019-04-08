const EC = require('elliptic').ec;
const SHA256 = require('crypto-js/sha256');
const ec = new EC('secp256k1');

class Verify {
  static hash(data) {
    return SHA256(JSON.stringify(data)).toString();
  }

  static verifySignature(account, signature, datfingerPrint) {
    return ec.keyFromPublic(account, 'hex').verify(datfingerPrint, signature);
  }

  static verifyAssessmentSignatrue(assessment) {
    return this.verifySignature(
      assessment.publicKey,
      assessment.signature,
      assessment.fingerPrint
    );
  }
}

module.exports = Verify;
