const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.request = require("../models/request.role.js")(sequelize, Sequelize);
db.result = require("../models/result.role.js")(sequelize, Sequelize);
db.session = require("../models/session.model.js")(sequelize, Sequelize);
db.type = require("../models/type.model.js")(sequelize, Sequelize);
db.vote = require("../models/vote.model.js")(sequelize, Sequelize);
db.application = require("../models/application.model.js")(
  sequelize,
  Sequelize
);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

db.type.belongsToMany(db.request, {
  through: "request_types",
  foreignKey: "typeId",
  otherKey: "requestId",
});
db.request.belongsToMany(db.type, {
  through: "request_types",
  foreignKey: "requestId",
  otherKey: "typeId",
});

db.user.hasMany(db.application, { onDelete: "Cascade" });
db.user.hasMany(db.vote, { onDelete: "Cascade" });
db.user.hasMany(db.request, { onDelete: "Cascade" });
db.user.hasMany(db.session, { onDelete: "Cascade" });
db.session.hasMany(db.application, { onDelete: "Cascade" });
db.session.hasMany(db.result, { onDelete: "Cascade" });
db.session.hasMany(db.vote, { onDelete: "Cascade" });

db.ROLES = ["votant", "candidat", "administrator"];

module.exports = db;
