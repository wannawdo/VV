const db = require("../models");
const User = db.user;
const Application = db.application;

// const { User, Application } = db;

exports.findAll = async (req, res) => {
  try {
    const rawApplications = await Application.findAll({
      attributes: ["id", "text", "userId"],
      raw: true,
    });

    const applications = await Promise.all(
      rawApplications.map(async (application) => {
        const user = await User.findOne({
          attributes: ["name", "username", "email"],
          where: {
            id: application.userId,
          },
        });

        return {
          id: application.id,
          //poza: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Placeholder_Person.jpg",
          poza:
            "https://www.gravatar.com/avatar/" +
            md5(user.email) +
            "?s=600&d=mp",
          nume: user.name,
          username: user.username,
          descriere: application.text,
        };
      })
    );

    res.status(200).send(applications);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving users.",
    });
  }
};

exports.findOne = (req, res) => {
  const id = jwt.verify(req.params.accessToken, config.secret).id;
  console.log("Requested for " + id);
  Application.findOne({ where: { userId: id } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving user with id = " + id,
      });
    });
};

exports.updateOne = (req, res) => {
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

exports.deleteOne = async (req, res) => {
  try {
    const { id } = req.params;
    const candidatura = await Application.findOne({ where: { id } });
    if (!candidatura) {
      res.status(404).send({ message: "Candidatura nu a fost gasita" });
    } else {
      await candidatura.destroy();
      res.status(200).send({ message: "Candidatura a fost stearsa" });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving users.",
    });
  }
};

exports.upsert = async (req, res) => {
  try {
    const { text, accessToken } = req.body;
    const userId = jwt.verify(accessToken, config.secret).id;
    const candidatura = await Application.findOne({ where: { userId } });
    if (!candidatura) {
      await Application.create({ text, userId });
      res.status(201).send({ message: "Candidatura a fost creata" });
    } else {
      await candidatura.update({ ...candidatura, text });
      res.status(200).send({ message: "Candidatura a fost actualizata" });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving users.",
    });
  }
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
