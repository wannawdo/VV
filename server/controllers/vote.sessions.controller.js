const { session } = require("../models");
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
    let temporaryAccessCode = Math.random().toString(36).slice(6);
    const session = Sessions.create({
      name,
      duration,
      accessCode: temporaryAccessCode,
      status: 1,
      description,
      options: options.join(";"),
      userId: jwt.verify(accessToken, config.secret).id,
    });
    res.status(201).send({
      message: `Session ${description} was sucessfull created`,
      accessCode: temporaryAccessCode,
    });
  } else {
    res.status(400).send({ errors });
  }
};

exports.getVoteSessions = async (req, res) => {
  const name = req.query.name;

  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  console.log(condition);

  const sessions = await Sessions.findAll({
    attributes: ["id", "name", "duration", "status", "createdAt"],
    where: condition,
  });

  // const sessions = await Promise.all(
  //   rawSessions.map(async (session) => {
  //     const votes = await Vote.findAll({
  //       attributes: ["option", "createdAt"],
  //       where: {
  //         sessionId: session.id,
  //       },
  //     });

  //     return { ...session, votes, options: session.options.split(";") };
  //   })
  // );

  res.status(200).send(sessions);
};

exports.getVoteSessionsById = (req, res) => {
  const { id, accessCode, accessToken } = req.params;
  Sessions.findOne({
    attributes: [
      "id",
      "name",
      "duration",
      "status",
      "description",
      "createdAt",
      "options",
    ],
    where: {
      id: id,
      accessCode: accessCode,
    },
  }).then((session) => {
    console.log(session);

    const itemTime = new Date(session.createdAt);

    if (itemTime.getTime() + session.duration * 60 * 1000 < Date.now()) {
      session.update({ ...session, status: 0 });
    }

    let userHasVoted = false;

    Vote.findOne({
      where: {
        sessionId: session.id,
        userId: jwt.verify(accessToken, config.secret).id,
      },
    })
      .then((user_vote) => {
        if (user_vote) userHasVoted = true;
        else userHasVoted = false;

        votes = Vote.findAll({
          attributes: ["option"],
          where: {
            sessionId: session.id,
          },
        }).then((votes) => {
          session.options = session.options.split(";");
          tempSession = JSON.parse(JSON.stringify(session));
          tempSession.votes = votes;
          tempSession.userHasVoted = userHasVoted;
          res.status(200).send(tempSession);
        });
      })
      .catch((err) => {
        res.status(403).send();
      });
  });
};

exports.postVote = (req, res) => {
  const { option, sessionId, accessCode, accessToken } = req.body;
  Vote.findOne({
    where: {
      sessionId: sessionId,
      userId: jwt.verify(accessToken, config.secret).id,
    },
  }).then((user_vote) => {
    if (user_vote) {
      res.status(403).send({ message: `Already voted!` });
    } else {
      Sessions.findOne({
        attributes: [
          "id",
          "description",
          "duration",
          "createdAt",
          "userId",
          "status",
        ],
        where: { id: sessionId, accessCode: accessCode },
      }).then((session) => {
        console.log(session);

        if (!session) {
          res.status(400).send({ message: `Session not exists` });
        } else {
          if (session.status) {
            Vote.create({
              option,
              sessionId,
              userId: jwt.verify(accessToken, config.secret).id,
            });

            res.status(201).send({ message: `Vote was sent` });
          } else {
            res.status(403).send({ message: `Session finished` });
          }
        }
      });
    }
  });
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
