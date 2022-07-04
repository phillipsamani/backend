const { check } = require('express-validator');

exports.userSignupValidator = [
    check('firstName')
        .not()
        .isEmpty()
        .withMessage('Your First Name is required'),
    check('secondName')
        .not()
        .isEmpty()
        .withMessage('Your Second Name is required'),
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

exports.userSigninValidator = [
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];