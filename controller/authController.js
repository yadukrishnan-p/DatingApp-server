const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");


const { sendVerificationEmail, generateEmailToken } = require("../utils/email");



// Register
const register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    console.log("Register request body:", req.body);

    let user = await User.findOne({ email });
    if (user) {
      console.log("User already exists");
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      phone,
    });

    await user.save();

    const emailToken = generateEmailToken(user);
    await sendVerificationEmail(user, emailToken);

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error("Error in register:", err.message);
    res.status(500).send("Server error");
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      console.log("Invalid Credentials - User not found");
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid Credentials - Password mismatch");
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error("Error in login:", err.message);
    res.status(500).send("Server error");
  }
};



// verifyEmail
const verifyEmail = async (req, res) => {

  const { token } = req.query;

  try {
    console.log('Received token:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const user = await User.findById(decoded.user.id);

    if (!user) {
        console.log('User not found');
        return res.status(400).json({ msg: 'Invalid token' });
    }

    user.verified = true;
    await user.save();

    res.json({ msg: 'Email verified' });
} catch (err) {
    console.error('Error in verifyEmail:', err.message);
    res.status(500).send('Server error');
}
};

module.exports = { register, login, verifyEmail };
