module.exports = (sequelize, Sequelize) => {
    const Vote = sequelize.define("votes", {
      option: {
        type: Sequelize.INTEGER
      }
    });
  
    return Vote;
  };