exports.allAccess = (req, res) => {
    res.status(200).send("Bine ai venit!");
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).send("Sesiuni disponibile de vot");
  };
  
  exports.administratorBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  
  exports.CandidatBoard = (req, res) => {
    res.status(200).send("Candidat Content.");
  };