const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const { User } = require("../db/user");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.send("Hey yooo");
});

// API for the new user registraion
router.post(
  "/register",
  // validation for email and password to meet the requirements
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const err = validationResult(req);

    if (!err.isEmpty()) res.status(400).json({ error: err.array() });

    // check if there are user's info in the database
    const user = User.find((user) => user.email === email);
    if (user)
      return res.status(400).json([
        {
          message: "This email already exists.",
        },
      ]);

    // encrypt the password
    let hashedPassword = await bcrypt.hash(password, 10);

    // save the password to the database
    User.push({
      email,
      password: hashedPassword,
    });

    // generate the token
    const token = await JWT.sign(
      {
        email,
      },
      "SECRET_KEY",
      {
        expiresIn: "24h",
      }
    );

    return res.json({
      token: token,
    });
  }
);

// API for checking the user of database
router.get("/allUsers", (req, res) => {
  return res.json(User);
});

// API for login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = User.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json([
      {
        message: "The user does not exist.",
      },
    ]);
  }

  // copy the password and check whether to match
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json([
      {
        message: "Invalid credentials",
      },
    ]);
  }

  const token = await JWT.sign(
    {
      email,
    },
    "SECRET_KEY",
    {
      expiresIn: "24h",
    }
  );

  return res.json({
    token: token,
  });
});

module.exports = router;
