const db = require("../models");
const Sessions = db.session;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.name) {
      res.status(400).send({
        message: "Name can not be empty!",
      });
      return;
    }
    if (!req.body.duration) {
      res.status(400).send({
        message: "Duration can not be empty!",
      });
      return;
    }

    // Create a session
    const session = {
      name: req.body.name,
      duration: req.body.duration,
    };

    // Save session in the database
    const data = await Sessions.create(session);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the session.",
    });
  }
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Sessions.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Sessions.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving session with id = " + id,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Sessions.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Session was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update session with id=${id}. Maybe session was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating session with id = " + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Sessions.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Session was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete session with id=${id}. Maybe session was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete session with id = " + id,
      });
    });
};

exports.deleteAll = (req, res) => {
  Sessions.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Sessions were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all sessions.",
      });
    });
};

exports.findAllPublished = (req, res) => {
  Sessions.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving sessions.",
      });
    });
};
