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

  app.get("/candidaturi", [authJwt.verifyToken], candidatura.findAll);

  app.get(
    "/candidaturi/:accessToken",
    [authJwt.verifyToken, authJwt.isCandidat],
    candidatura.findOne
  );

  app.delete(
    "/candidaturi/:id",
    [authJwt.verifyToken, authJwt.isAdministrator],
    candidatura.deleteOne
  );

  app.delete(
    "/candidaturi/all",
    [authJwt.verifyToken, authJwt.isAdministrator],
    candidatura.deleteAll
  );

  app.put(
    "/candidaturi",
    [authJwt.verifyToken, authJwt.isCandidat],
    candidatura.upsert
  );
};
