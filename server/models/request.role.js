module.exports = (sequelize, Sequelize) => {
    const Request = sequelize.define("requests", {
      accountData: {
        type: Sequelize.STRING
      },
      evidence: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER
      }
    });
  
    return Request;
  };