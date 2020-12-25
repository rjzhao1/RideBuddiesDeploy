const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports=function validateRegister(data){
    let errors = {};

    data.username = !isEmpty(data.username) ? data.username:"";
    data.email = !isEmpty(data.email) ? data.email:"";
    data.password = !isEmpty(data.password)? data.password:"";
    data.password2 = !isEmpty(data.password2) ? data.password2:"";

    // Check if there is a username
    if(Validator.isEmpty(data.username)){
        errors.username = "Name Field is required";
    }

    // Check if there is a email and the email is properly formatted
    if(Validator.isEmpty(data.email)){
        errors.email = "Email Field is required";
    }else if(!Validator.isEmail(data.email)){
        errors.email = "Email is invalid";
    }

    // Check if there is a password
    if(Validator.isEmpty(data.password)){
        errors.password = "Password field is required";
    }

    // Check if there is a confirm password
    if(Validator.isEmpty(data.password2)){
        errors.password2 = "Password field is required";
    }

    // Check if the password is properly formatted and comfirm password matches password
    if(!Validator.isLength(data.password,{ min: 6, max: 30 })){
        errors.password2 = "Password must be at least 6 characters";
    }
    if(!Validator.equals(data.password,data.password2)){
        errors.password2 = "Passwords must match";
    }
    // return any errors
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

