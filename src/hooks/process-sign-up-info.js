// Use this hook to manipulate incoming or outgoing data.
// For more userInformation on hooks see: http://docs.feathersjs.com/api/hooks.html

// 准备用该库对输入数据验证及清洗
// express 中间件 xss-filter
const Validator = require('validator');

const ROLES = {
  student: 'student',
  teacher: 'teacher',
};

// TODO 检查注册信息
// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    // check validations
    const { data } = context;

    // check email
    if(!data.email) {
      throw new Error('You must input your email.');
    } else {
      if(!Validator.isEmail(data.email)) {
        throw new Error('You must input your email.');
      }
    }

    // check password
    if(!data.password) {
      throw new Error('You must input your password.');
    }

    // check publicKey
    if(!data.publicKey) {
      throw new Error('Key pair initailization failed, or can not receive your public key.');
    }

    // check role
    if(typeof(data.role) === 'string') {
      switch(data.role) {
      case ROLES.student :
      case ROLES.teacher :
        break;
      default :
        throw new Error('You must specify your role：student，teacher or visitor.');
      }
    } else {
      throw new Error('You role is invalid.');
    }

    // check userInfo
    // check name
    if(!data.name) {
      throw new Error('You must input your name.');
    } else {
      // TODO 正则式检查
    }

    // check telephone number

    if(data.sex !== 'male' && data.sex !== 'female') {
      throw new Error('You must specify your sex.');
    }

    // TODO 院校检查
    // 逻辑：数据库中存储院校名，查询后匹配
    // check institution

    // check faculty


    if(data.role !== 'student' && data.role !== 'teacher') {
      throw new Error('Your role is invalid.');
    } else if (data.role === 'student') {
      // check grade

      // check class

    } else {
      // teachers have no grade and class
      data.grade = 0;
      data.class = 0;
    }


    // Override the original data (so that people can't submit additional stuff)
    context.data = {
      email: data.email,
      password: data.password,
      publicKey: data.publicKey,
      role: data.role,
      name: data.name,
      sex: data.sex,
      tel: data.tel,
      institution: data.institution,
      faculty: data.faculty,
      grade: data.grade,
      class: data.class,
      // Messages can't be longer than 400 characters
      intro: data.intro.substring(0, 400)
    };

    return context;
  };
};

