// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const SKIP = require("@feathersjs/feathers").SKIP;
const ROLES = {
  admin: "admin",
  supervisor: "supervisor",
  teacher: "teacher"
};

// 检查用户是否为管理员
// 用于区分用户行为，其中管理员可以跳过申请用户的数据检查

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return async context => {
    const user = context.params.user;
    switch (
      user.role // 区分用户角色
    ) {
      case ROLES.teacher:
      case ROLES.supervisor:
        switch (
          context.method // 定义visitor, student,
        ) {
          case "patch": // teacher， supervisor用户对用户数据的操作权限
          case "update":
          case "remove":
            if (context.id === null) {
              // 不能批量更改用户信息
              throw new Error(
                "You don't have permission to modify multiple user data."
              );
            }
            if (context.id !== user._id) {
              // 不能改改不是自己的用户信息
              throw new Error(
                "You don't have permission to modify other user's data."
              );
            }
            break;
          default:
            break;
        }
        break;
      case ROLES.admin:
        // 用户为管理员，跳过所有before钩子直接处理用户信息
        return SKIP;
      default:
        throw new Error("User's role is invalid.");
    }
    return context;
  };
};
