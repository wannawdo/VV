const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};

const db = require("./models");
const Role = db.role;

// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and Resync Db");
//   initial();
// });

db.sequelize.sync();

app.use(cors(corsOptions));

app.use(
  fileUpload({
    createParentPath: true,
  })
);

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to vote application." });
});

require("./routes/administrator.routes")(app);
require("./routes/vote.sessions.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

function initial() {
  Role.create({
    id: 1,
    name: "votant",
  });

  Role.create({
    id: 2,
    name: "candidat",
  });

  Role.create({
    id: 3,
    name: "administrator",
  });
}
