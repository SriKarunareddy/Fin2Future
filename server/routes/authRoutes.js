const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// In-memory user storage (for demo; replace with DB in production)
const users = new Map();

// Signup
router.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (users.has(email)) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            _id: Date.now().toString(), // simple ID
            email,
            password: hashedPassword
        };

        users.set(email, newUser);
        res.status(201).json({ message: "Signup successful" });

    } catch (error) {
        console.log("Signup Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = users.get(email);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 🔐 Create Token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/me", authMiddleware, async (req, res) => {
    try {
        // Find user by id
        let foundUser = null;
        for (const user of users.values()) {
            if (user._id === req.user.id) {
                foundUser = user;
                break;
            }
        }
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const { password, ...userWithoutPassword } = foundUser;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;