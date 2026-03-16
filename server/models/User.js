const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    budgetGame: {
        score: { type: Number, default: 0 },
        level: { type: String, default: "Beginner" },
        gamesPlayed: { type: Number, default: 0 },
        results: { type: Array, default: [] }
    },
    learningModules: {
        modulesCompleted: { type: Number, default: 0 },
        progress: { type: Array, default: [] }
    }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);