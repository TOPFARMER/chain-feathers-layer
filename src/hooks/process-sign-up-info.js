// Use this hook to manipulate incoming or outgoing data.
// For more userInformation on hooks see: http://docs.feathersjs.com/api/hooks.html

const ROLES = {
  student: 'student',
  teacher: 'teacher',
  visitor: 'visitor'
};

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    // check validations
    const { data } = context;

    // check email
    if(!data.email) {
      throw new Error('You must input your email.');
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
      case ROLES.visitor :
        break;
      default :
        throw new Error('You must specify your role：student，teacher or visitor.');
      }
    } else {
      throw new Error('You role is invalid.');
    }

    if(data.role !== 'student' && data.role !== 'teacher') {
      throw new Error('Your role is invalid.');
    } else if (data.role === 'student') {
      // check userInfo
      // check name

      // check sex

      // check telephone number

      // check institution

      // check faculty

      // check grade

      // check class

      // check resume
    } else {
      // teachers have no grade and class
      data.grade = 0;
      data.class = 0;

      // check name

      // check sex

      // check telephone number

      // check institution

      // check faculty

      // check resume
    }

    // Override the original data (so that people can't submit additional stuff)
    context.data = {
      email: data.email,
      password: data.password,
      publicKey: data.publicKey,
      role: data.role,
      userInfo: {
        name: data.userInfo.name,
        sex: data.userInfo.sex,
        tel: data.userInfo.tel,
        institution: data.userInfo.institution,
        faculty: data.userInfo.faculty,
        grade: data.userInfo.grade,
        class: data.userInfo.class,
        resume: data.userInfo.resume
      }
    };

    return context;
  };
};


// data dictionary
// {
//   "email": "test0@example.com",
//   "password": "secret",
//   "role": "teacher",
//   "publicKey": "foo_address",
//   "userInfo": {
//     "name": "{ type: String }",
//     "sex": "{ type: String }",
//     "tel": "{ type: String }",
//     "institution": "{ type: String }",
//     "faculty": "{ type: String }",
//     "grade": 2018,
//     "class": 3,
//     "resume": "{type: String }"
//   }
// }
