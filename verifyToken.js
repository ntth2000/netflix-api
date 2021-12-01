const jwt = require("jsonwebtoken");
const verify = async (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) res.status(401).json(err);
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  } 
};
module.exports = verify;
