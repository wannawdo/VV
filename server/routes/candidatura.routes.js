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

  app.get("/candidaturi", candidatura.findAll);

  app.get("/candidaturi/:accessToken", candidatura.findOne);

  app.delete("/candidaturi/:id", candidatura.deleteOne);

  app.delete("/candidaturi/all", candidatura.deleteAll);

  app.put("/candidaturi", candidatura.upsert);
};
