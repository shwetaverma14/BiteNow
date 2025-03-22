const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwtSecret = "MyNameisEndtoendEncrypted$#";

router.post("/createUser", [
    body('email').isEmail(),
    body('name').isLength({ min: 2 }),
    body('password', 'Incorrect Password').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, name, password, location } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(password, salt);

        // Create a new user
        await User.create({
            name: name,
            password: secPassword,
            email: email,
            location: location
        });

        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.post("/loginUser", [
    body('email').isEmail(),
    body('password', 'Incorrect Password').isLength({ min: 4 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Find the user by email
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({ success: false, errors: "Try logging in with correct credentials" });
        }

        // Compare the password
        const pwdCompare = await bcrypt.compare(password, userData.password);
        if (!pwdCompare) {
            return res.status(400).json({ success: false, errors: "Try logging in with correct credentials" });
        }

        // Generate JWT token
        const data = {
            user: {
                id: userData.id
            }
        };
        const authToken = jwt.sign(data, jwtSecret);
        res.json({ success: true, authToken: authToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;