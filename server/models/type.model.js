module.exports = (sequelize, Sequelize) => {
    const Type = sequelize.define("types", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      }
    });
  
    return Type;
  };