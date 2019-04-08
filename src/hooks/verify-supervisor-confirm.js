// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const Verify = require('../utils/verify')

// 我们并没有定义supervisor签名后的schema
// 在此处进行定义
/**
 *
 * signedPackage = new Schema {
 *  fingerPrint: {type: String, required:true},
 *  supervisorName: {type: String, required:true},
 *  publicKey: {type: String, required:true},
 *  signature: signature: {
 *     r: String,
 *     s: String,
 *     recoveryParam: Number
 *   },
 *  assessments: [{type: assessment}]
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
