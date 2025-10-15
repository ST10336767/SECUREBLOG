const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//Schema defines how user documents will look
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    //added for RBAC
    role: {
        type: String,
         enum: ['admin','editor','author','reader'], 
         default: 'reader'}
});

//Automatically hash pw before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    //define saltg
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//compare plain text password with hashed password
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);