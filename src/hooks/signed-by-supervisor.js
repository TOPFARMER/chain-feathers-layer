// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return async context => {
    const assessmentsArr = JSON.parse(context.data.assessments);
    assessmentsArr.forEach(async assessment => {
      await context.app
        .service("assessments")
        ._patch(assessment._id, { isSignedBySup: true });
    });

    return context;
  };
};
