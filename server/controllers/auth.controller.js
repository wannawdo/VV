const db = require("../models");
const User = db.user;
const Role = db.role;
const requestRole = db.request;

const Op = db.Sequelize.Op;

var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  // Save User to Database
  try {
    const user = await User.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      active: false,
    });
    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });
      await user.setRoles(roles);
      res.send({ message: "User was registered successfully!" });
    } else {
      // user role = 1
      await user.setRoles([1]);
      res.send({ message: "User was registered successfully!" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      if (!user.active) {
        return res.status(401).send({
          accessToken: null,
          message: "Account not active",
        });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE = " + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.register = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      try {
        if (!req.files) {
          res.send({
            status: false,
            message: "No file uploaded",
          });
        } else {
          //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
          let file = req.files.file;

          //Use the mv() method to place the file in upload directory (i.e. "uploads")
          file.mv("./uploads/" + file.name);

          user.update({
            uploadedFile: file.name,
          });

          //send response
          res.send({ message: "File is uploaded" });
        }
      } catch (err) {
        res.status(500).send(err);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.sendRequest = (req, res) => {
  const { accessToken } = req.body;
  User.findOne({
    where: {
      id: jwt.verify(accessToken, config.secret).id,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      try {
        if (!req.files) {
          res.send({
            status: false,
            message: "No file uploaded",
          });
        } else {
          //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
          let file = req.files.file;

          //Use the mv() method to place the file in upload directory (i.e. "uploads")
          file.mv("./uploads/" + file.name);
          console.log({
            userId: jwt.verify(accessToken, config.secret).id,
            evidence: file.name,
            typeId: 1,
            status: 0,
          });
          requestRole
            .create({
              userId: jwt.verify(accessToken, config.secret).id,
              evidence: file.name,
              typeId: 1,
              status: 0,
            })
            .then(() => {
              res.send({ message: "File is uploaded" });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send(err);
            });
        }
      } catch (err) {
        console.log(err);
        res.status(500).send(err);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.update = (req, res) => {
  const { username, password, full_name, email, accessToken } = req.body;

  let updateObj = {
    useranme: username,
    name: full_name,
    email: email,
  };

  if (password && password != "")
    updateObj.password = bcrypt.hashSync(password, 8);

  User.update(updateObj, {
    where: {
      id: jwt.verify(accessToken, config.secret).id,
    },
  })
    .then(() => {
      res.send({ message: "Update successfull" });
    })
    .catch(() => {
      res.status(500).send({ message: "Update failed" });
    });
};

exports.deleteAccount = (req, res) => {
  const { accessToken } = req.params;

  console.log(req.params);

  User.destroy({
    where: { id: jwt.verify(accessToken, config.secret).id },
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
