const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  // check whether to have JWT in request header of x-auth-token
  const token = req.header("x-auth-token");

  if (!token) {
    res.status(400).json([
      {
        message:
          "You have to have access privileges in order to view this article.",
      },
    ]);
  } else {
    try {
      let user = await JWT.verify(token, "SECRET_KEY");
      console.log(user);
      req.user = user.email;
      next();
    } catch (error) {
      return res.status(400).json([
        {
          message: "The token does not match.",
        },
      ]);
    }
  }
};
