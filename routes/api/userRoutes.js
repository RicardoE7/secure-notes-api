const router = require("express").Router();

const { User } = require("../../models");
const { signToken } = require("../../utils/auth");

// REGISTER
// POST /api/users/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "A user with this email already exists.",
      });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    const token = signToken(user);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// LOGIN
// POST /api/users/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
      });
    }

    const correctPassword = await user.isCorrectPassword(password);

    if (!correctPassword) {
      return res.status(400).json({
        message: "Incorrect email or password.",
      });
    }

    const token = signToken(user);

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to log in.",
    });
  }
});

module.exports = router;
