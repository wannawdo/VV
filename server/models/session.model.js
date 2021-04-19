module.exports = (sequelize, Sequelize) => {
    const Session = sequelize.define("sessions", {
      name: {
        type: Sequelize.STRING
      },
      duration: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        type: Sequelize.DATE
      }
    });
  
    return Session;
  };