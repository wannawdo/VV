const db = require("../models");
const Sessions = db.session;
const Vote = db.vote;
const Op = db.Sequelize.Op;

exports.createVoteSession = (req, res) => {
  const { name, duration, description, userId, options, accessToken } =
    req.body;
  const errors = [];

  if (!name) {
    errors.push("Name is empty");
  }
  if (!description) {
    errors.push("Description is empty");
  }
  if (!duration) {
    errors.push("Duration is empty");
  }
  // else if (!duration.match(/^[0-9]*$/)) {
  //   errors.push("Duration is not valid");
  // }

  if (errors.length === 0) {
    const session = Sessions.create({
      name,
      duration,
      accessCode: Math.random().toString(36).slice(6),
      status: 1,
      description,
      options: options.join(";"),
      userId: jwt.verify(accessToken, config.secret).id,
    });
    res.status(201).send({
      message: `Session ${description} was sucessfull created`,
      accessCode: session.accessCode,
    });
  } else {
    res.status(400).send({ errors });
  }
};

exports.getVoteSessions = (req, res) => {
  let formattedSessions = [];
  const sessions = Sessions.findAll({
    attributes: [
      "id",
      "name",
      "duration",
      "status",
      "description",
      "createdAt",
      "options",
    ],
  }).then((data) => {
    for (let i = 0; i < data.length; i++) {
      const votes = Vote.findAll({
        attributes: ["option", "createdAt"],
        where: {
          sessionId: data[i].id,
        },
      });

      data[i].votes = votes;
      data[i].options = data[i].options.split(";");
      formattedSessions.push(data[i]);
    }
    res.status(200).send(formattedSessions);
  });
};

exports.getVoteSessionsById = (req, res) => {
  const { id } = req.params;
  const session = Sessions.findOne({
    attributes: [
      "id",
      "accessCode",
      "duration",
      "status",
      "description",
      "createdAt",
    ],
    where: {
      id: id,
    },
  });

  console.log(session);
  const itemTime = new Date(session.createdAt);

  if (itemTime.getTime() + session.duration * 60 * 1000 < Date.now()) {
    session.update({ ...session, status: 0 });
  }

  const vote = Vote.findAll({
    attributes: ["option", "createdAt"],
    where: {
      sessionId: session.id,
    },
  });
  res.status(200).send({ ...session.get({ plain: true }), vote });
};

exports.postVote = (req, res) => {
  const { option, sesssionId } = req.body;

  const sesssion = Sessions.findOne({
    attributes: [
      "id",
      "description",
      "duration",
      "createdAt",
      "userId",
      "status",
    ],
    where: { id: sesssionId },
  });

  if (!sesssion) {
    res.status(400).send({ message: `Session not exists` });
  } else {
    if (sesssion.status) {
      Vote.create({ emoticon, sesssionId, userId: req.session.id });
      res.status(201).send({ message: `Vote was sent` });
    } else {
      res.status(403).send({ message: `Session finished` });
    }
  }
};

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
