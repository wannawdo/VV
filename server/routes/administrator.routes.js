const { authJwt } = require("../middleware");
const user = require("../controllers/user.controller.js");
const administrator = require("../controllers/administrator.controller.js");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Retrieve all users
  app.get(
    "/gestionareconturi",
    [authJwt.verifyToken, authJwt.isAdministrator],
    administrator.findAll
  );

  // Retrieve all published user
  // app.get("/gestionareconturi/published", user.findAllByCondition);

  // Retrieve a single user with id
  app.get(
    "/gestionareconturi/:id",
    [authJwt.verifyToken, authJwt.isAdministrator],
    administrator.findOne
  );

  // Update a user with id
  app.put(
    "/gestionareconturi/:id",
    [authJwt.verifyToken, authJwt.isAdministrator],
    administrator.update
  );

  // Delete a user with id
  app.delete(
    "/gestionareconturi/:id",
    [authJwt.verifyToken, authJwt.isAdministrator],
    administrator.delete
  );

  app.delete(
    "/gestionareconturi/",
    [authJwt.verifyToken, authJwt.isAdministrator],
    administrator.deleteAll
  );

  app.post(
    "/gestionareconturi/activare/:id",
    [authJwt.verifyToken, authJwt.isAdministrator],
    administrator.activate
  );

  app.post(
    "/gestionareconturi/activareConturi/",
    [authJwt.verifyToken, authJwt.isAdministrator],
    administrator.activateAll
  );

  app.put(
    "/gestionareconturi/tip/:id/:rol",
    [authJwt.verifyToken, authJwt.isAdministrator],
    administrator.setRole
  );
};
