const crypto = require('crypto');
const config = require('../config');

class Crypto {
  /**
   * 加解密必须使用同一套 key 和 iv
   * @param  {String} algorithm 算法名称，比如 `aes-128-ecb`
   * @param  {String} key       秘钥
   * @param  {String} iv        initialization vector，默认空字符串
   */
  constructor(algorithm, key, iv = '') {
    this.algorithm = algorithm;
    this.key = key;
    this.iv = iv;
  }

  /**
   * 加密算法
   *
   * @param  {String} message         明文
   * @param  {String} messageEncoding 明文编码
   * @param  {String} cipherEncoding  密文编码
   *
   * @return {String} encrypted       密文
   */
  encrypt(message, messageEncoding = 'utf8', cipherEncoding = 'base64') {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    cipher.setAutoPadding(true);

    let encrypted = cipher.update(message, messageEncoding, cipherEncoding);
    encrypted += cipher.final(cipherEncoding);

    return encrypted;
  }

  /**
   * 解密算法
   *
   * @param  {String} encrypted       密文
   * @param  {String} cipherEncoding  密文编码
   * @param  {String} messageEncoding 明文编码
   *
   * @return {String} decrypted       明文
   */
  decrypt(encrypted, cipherEncoding = 'base64', messageEncoding = 'utf8') {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    decipher.setAutoPadding(true);

    let decrypted = decipher.update(encrypted, cipherEncoding, messageEncoding);
    decrypted += decipher.final(messageEncoding);

    return decrypted;
  }
}

module.exports = new Crypto(
  config.COMMUNICATION_ENCRYPT_METHOD,
  config.COMMUNICATION_ENCRYPT_KEY
);
