const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  accessToken = req.headers["x-access-token"]
    ? req.headers["x-access-token"]
    : req.body.accessToken
    ? req.body.accessToken
    : req.params.accessToken;

  if (!accessToken) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(accessToken, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdministrator = (req, res, next) => {
  accessToken = req.headers["x-access-token"]
    ? req.headers["x-access-token"]
    : req.body.accessToken
    ? req.body.accessToken
    : req.params.accessToken;
  User.findByPk(jwt.verify(accessToken, config.secret).id).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "administrator") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Admin Role!",
      });
      return;
    });
  });
};

isCandidat = (req, res, next) => {
  accessToken = req.headers["x-access-token"]
    ? req.headers["x-access-token"]
    : req.body.accessToken
    ? req.body.accessToken
    : req.params.accessToken;

  User.findByPk(jwt.verify(accessToken, config.secret).id).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "candidat") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Candidat Role!",
      });
    });
  });
};

// isCandidatOrAdministrator = (req, res, next) => {
//   User.findByPk(req.userId).then(user => {
//     user.getRoles().then(roles => {
//       for (let i = 0; i < roles.length; i++) {
//         if (roles[i].name === "candidat") {
//           next();
//           return;
//         }

//         if (roles[i].name === "administrator") {
//           next();
//           return;
//         }
//       }

//       res.status(403).send({
//         message: "Require Candidat or Admin Role!"
//       });
//     });
//   });
// };

const authJwt = {
  verifyToken: verifyToken,
  isAdministrator: isAdministrator,
  isCandidat: isCandidat,
  //isCandidatOrAdministrator: isCandidatOrAdministrator
};
module.exports = authJwt;
