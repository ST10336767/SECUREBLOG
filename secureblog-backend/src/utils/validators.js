const {body} = require("express-validator");

//shared password strtength rule (mirrors front-end, but authorative here)
const passwordStrength = body("password")
    .isString()
    .isLength({ min: 8}).withMessage("Password must be at least 8 characters")
    .matches(/[A-Za-z]/).withMessage("Password must include a letter")
    .matches(/\d/).withMessage("Password must include a number");

    //Email for reg & login 
    const emailField = body("email")
    .isEmail().withMessage("Email must be valid")
    .normalizeEmail();

    //optionnal: for username
    // const usernameField = body("username")
    //     .optional()
    //     .isLength({ min: 3, max: 40}).withMessage("Username must be 3-40 chars")
    //     .isAlphanumeric().withMessage("Username must be alphanumeric");

    //Reg rules: requires email + password
    const registerRules = [emailField, passwordStrength];

    //Login rules: require email & non empty password
    //NOTE: do not .escape() pw on server - changes string and breaks bcrypt.
    //Trimming is fine if yo've documented that passwordss cannot start/.end with spaces
    //Many apps choose not to trim to avoid altering userinput. Below is no trium
    const loginRules = [
        emailField,
        body("password").isString().notEmpty().withMessage("Password is required,"),
    ];

    module.exports = {registerRules, loginRules};