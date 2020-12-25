const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLogin(data){
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email:"";
    data.password = !isEmpty(data.password)? data.password:"";
    
    // Checks if there is an email and the email is properly formatted
    if(Validator.isEmpty(data.email)){
        errors.email = "Email Field is required";
    }else if(!Validator.isEmail(data.email)){
        errors.email = "Email is invalid";
    }

    // Checks if there is a password
    if(Validator.isEmpty(data.password)){
        errors.password = "Password field is required";
    }

    // return any errors
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
