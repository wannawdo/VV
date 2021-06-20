const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  User.findAll({
    attributes: ["id", "name", "username", "email", "active", "uploadedFile"],
    where: condition,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
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
  User.update({ active: true }, { where: { active: false } })
    .then(() => {
      res.send({ message: "Users are active" });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not activate Users",
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
