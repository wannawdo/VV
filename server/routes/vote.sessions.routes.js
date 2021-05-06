const { authJwt } = require("../middleware");
const user = require("../controllers/user.controller.js");
const sessions = require("../controllers/vote.sessions.controller");

module.exports = function(app) {

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
    // Create a new Tutorial
    app.post("/sesiunivot", sessions.create);

    // Retrieve all Tutorials
    app.get("/sesiunivot", sessions.findAll);
  
    // Retrieve all published Tutorials
    app.get("/sesiunivot", sessions.findAllPublished);
  
    // Retrieve a single Tutorial with id
    app.get("/sesiunivot/:id", sessions.findOne);
  
    // Update a Tutorial with id
    app.put("/sesiunivot/:id", sessions.update);
  
    // Delete a Tutorial with id
    app.delete("/sesiunivot/:id", sessions.delete);
  
    // Delete all Tutorials
    app.delete("/sesiunivot/", sessions.deleteAll);

 
};