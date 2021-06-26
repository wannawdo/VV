const { authJwt } = require("../middleware");
const user = require("../controllers/user.controller.js");
const candidatura = require("../controllers/candidatura.controller.js");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Retrieve all users
  app.get("/candidaturi", candidatura.findAll);

  // Retrieve all published user
  //   app.get("/gestionareconturi/published", user.findAllByCondition);

  // Retrieve a single user with id
  app.get("/candidaturi/:accessToken", candidatura.findOne);

  // Delete a user with id
  app.delete("/candidaturi/:id", candidatura.deleteOne);

  app.delete("/candidaturi/all", candidatura.deleteAll);

  app.put("/candidaturi", candidatura.upsert);
};
