module.exports = (sequelize, Sequelize) => {
  const Application = sequelize.define("applications", {
    text: {
      type: Sequelize.TEXT,
    },
  });

  return Application;
};
