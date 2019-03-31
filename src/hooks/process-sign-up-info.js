// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

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
    if(!data.role) {
      throw new Error('You must specify your role, student or teacher.');
    }

    if(data.role !== 'student' && data.role !== 'teacher') {
      throw new Error('Your role is invalid.');
    } else if (data.role === 'student') {
      // check info
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
      info: {
        name: data.info.name,
        sex: data.info.sex,
        tel: data.info.tel,
        institution: data.info.institution,
        faculty: data.info.faculty,
        grade: data.info.grade,
        class: data.info.class,
        resume: data.info.resume
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
//   "info": {
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
