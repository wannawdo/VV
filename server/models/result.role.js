module.exports = (sequelize, Sequelize) => {
    const Result = sequelize.define("results", {
      winningOption: {
        type: Sequelize.STRING
      }
    });
  
    return Result;
  };