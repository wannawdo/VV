const db = require("../models");
var nodemailer = require("nodemailer");
const dbConfig = require("../config/db.config");

const User = db.user;
const Role = db.role;
const requestRole = db.request;
const Op = db.Sequelize.Op;

var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: dbConfig.email_credentials,
});

exports.findAll = async (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  const data = await User.findAll({
    attributes: ["id", "name", "username", "email", "active", "uploadedFile"],
    where: condition,
  });

  temp_data = JSON.parse(JSON.stringify(data));

  const final_data = await Promise.all(
    temp_data.map(async (user) => {
      const temp_request = await requestRole.findAll({
        where: { userId: user.id },
      });
      user.requests = temp_request;
      return user;
    })
  );

  res.send(final_data);
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving user with id = " + id,
      });
    });
};

exports.setRole = async (req, res) => {
  const id = req.params.id;
  const { accessToken, requestId } = req.body;

  const admin_user = await User.findOne({
    where: { id: jwt.verify(accessToken, config.secret).id },
  });

  const changing_user = await User.findOne({
    where: { id: id },
  });

  const check_roles = await admin_user.getRoles();

  check_roles.forEach(async (role) => {
    if (role.name == "administrator") {
      if (changing_user) {
        const roles = await Role.findAll({
          where: {
            name: req.params.rol,
          },
        });
        await changing_user.setRoles(roles);
        await requestRole.update({ status: 1 }, { where: { id: requestId } });

        smtpTransport.sendMail(
          {
            from: dbConfig.email_credentials.user,
            to: changing_user.email,
            subject: "Activare candidatură VV",
            text:
              "Bună " +
              changing_user.name +
              ",\n\rAi devenit candidat. Acum iți poți încărca candidatura în aplicația VV.",
          },
          function (error, response) {
            if (error) {
              console.log(error);
            }
          }
        );

        res.send({ message: "User was modified successfully!" });
      } else {
        res.status(404).send("User not found");
      }
      return;
    }
  });
};

exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update user with id=${id}. Maybe user was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating user with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

exports.activate = (req, res) => {
  const id = req.params.id;

  User.findOne({
    where: { id: id },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      smtpTransport.sendMail(
        {
          from: dbConfig.email_credentials.user,
          to: user.email,
          subject: "Activare cont VV",
          text:
            "Bună " +
            user.name +
            ",\n\rContul tau a fost activat cu succes. Acum poti folosi aplicatia VV.",
        },
        function (error, response) {
          if (error) {
            console.log(error);
          }
        }
      );

      user.update({ active: true });

      res.send({ message: "User is active" });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not activate User with id=" + id,
      });
    });
};

exports.activateAll = (req, res) => {
  User.findAll({
    where: { active: false },
  }).then((users) => {
    users.forEach((user) => {
      smtpTransport.sendMail(
        {
          from: dbConfig.email_credentials.user,
          to: user.email,
          subject: "Activare cont VV",
          text:
            "Bună " +
            user.name +
            ",\n\rContul tau a fost activat cu succes. Acum poti folosi aplicatia VV.",
        },
        function (error, response) {
          if (error) {
            console.log(error);
          }
        }
      );
    });
    User.update({ active: true }, { where: { active: false } })
      .then(() => {
        console.log(users);
        res.send({ message: "Users are active" });
      })
      .catch((err) => {
        res.status(500).send({
          message: "Could not activate Users",
          description: err,
        });
      });
  });
};

exports.deleteAll = (req, res) => {
  User.destroy({ where: { active: false } })
    .then(() => {
      res.send({ message: "Users are deleted" });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Users",
      });
    });
};

// exports.findAllByCondition = (req, res) => {
//   User.findAll({ where: { status: true } })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving tutorials."
//       });
//     });
// };
