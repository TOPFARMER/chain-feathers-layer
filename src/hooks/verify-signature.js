// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const Verify = require('../utils/verify')

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    // 检查评论是否为空
    if(!context.data) {
      throw new Error('Your comment is empty.');
    }

    // 检查评论内容是否为空
    if(!context.data.contents || !context.data.contents === []) {
      throw new Error('Your comment is empty.');
    }

    // 检查HTTP请求用户的角色
    const user = context.params.user;
    if(user.role !== 'teacher' && uesr.role !== 'supervisor') {
      throw new Error('You have no authority to sign a comment.');
    }

    // 用户列表查找该签名publicKey
    const queryResult = context.app.service('users').find({
      query: {
        publicKey: {
          $in: [ user.publicKey ]
        }
      }
    });
    if(queryResult.total === 0) {
      throw new Error('Your public address is invalid.');
    } else {
      // 检查实际签名用户的角色
      const user = queryResult.data[0];
      if(user.role !== 'teacher' && uesr.role !== 'supervisor') {
        throw new Error('You have no authority to sign a comment.');
      }
    }

    // 检查签名有效性
    const comment = context.data;
    if(!Verify.verifyCommentSignatrue(comment)) {
      throw new Error('Your comment\'s signature is invaild.');
    }

    return context;
  };
};
