// auth.js

const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = "FATIMA_SHEIKH";
const fetchuser = require("../middleware/fetchuser");

const cors = require('cors');
const app = express();

// Use CORS middleware
app.use(cors({
  origin: 'https://news-monkey-coral.vercel.app/',  // Replace with your frontend URL
  methods: ['GET', 'POST'],  // Add the HTTP methods you need
  allowedHeaders: ['Content-Type'],  // Add headers you want to allow
}));
//Create a user endpoint

// ROUTE# 1 ----- Route with validation
router.post(
  "/signup",
  [
    // Validate name
    body("name", "Enter a valid name").notEmpty().isString(),
    // Validate email
    body("email", "Enter a valid email").isEmail(),
    // Validate password
    body(
      "password",
      "Password must be atleast 5 characters long, and must contain both characters and numbers"
    ),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorarray = errors.array();
      return res.status(400).json({ errors: errorarray[0].msg });
    }

    const checkUserExistence = async (email) => {
      try {
        // Find a user with the provided email
        const existingUser = await User.findOne({ email });
    
        if (existingUser) {
          console.log("user exist");
          return { error: "User already exists" }; // Return error message
        }
    
        // User with the provided email does not exist
        return null;
      } catch (error) {
        // Handle database error
        console.error("Error checking user existence:", error);
        throw error; // Throw the error to be caught in the catch block
      }
    };
    
    // Generating Salt for website

    const userEmail = req.body.email;
    const result = await checkUserExistence(userEmail);
    if (result && result.error === "User already exists") {
      // User with the provided email already exists
      return res.status(409).json({ error: result.error });
    } else {
      try {
        // If no validation errors, process the request
        const { name, email, password } = req.body;
        // Generate a salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password with the generated salt
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
          name,
          email,
          password: hashedPassword, // Save the hashed password in the database
        });

        await user.save(); // Wait for the save operation to complete
        res.status(201).json({ message: "User signed up successfully" }); // Send success response
      } catch (error) {
        console.error("Error saving user:", error);
        if (error.code === 11000) {
          // Duplicate key error (email already exists)
          return res.status(409).json({ error: "User with this email already exists" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
);

//ROUTE# 2 ----- Create a login Endpoint
router.post(
  "/login",
  [
    // Validate email
    body("email", "Enter a valid email").isEmail(),
    // Validate password
    body("password", "Password can not be empty").notEmpty(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorarray = errors.array();
      return res.status(400).json({ errors: errorarray[0].msg });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          // Handle error
          console.error(err);
        }
        if (user && result) {
          console.log("user logged in successfully");
          const payload = { userid: user.id };
          const authtoken = jwt.sign(payload, secretKey);
          res.json({ authtoken });
        } else {
          return res.status(401).json({ error: "Invalid credentials" });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
);

//ROUTE# 2 ----- Create a login Endpoint
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userid = req.user.userid;
    const user = await User.findById(userid).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal serval error");
  }
});

// Export the router
module.exports = router;
