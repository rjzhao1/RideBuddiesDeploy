const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports=function validateRegister(data){
    let errors = {};

    data.username = !isEmpty(data.username) ? data.username:"";
    data.email = !isEmpty(data.email) ? data.email:"";
    data.password = !isEmpty(data.password)? data.password:"";
    data.password2 = !isEmpty(data.password2) ? data.password2:"";

    if(Validator.isEmpty(data.username)){
        errors.username = "Name Field is required";
    }

    if(Validator.isEmpty(data.email)){
        errors.email = "Email Field is required";
    }else if(!Validator.isEmail(data.email)){
        errors.email = "Email is invalid";
    }

    if(Validator.isEmpty(data.password)){
        errors.password = "Password field is required";
    }

    
    if(Validator.isEmpty(data.password2)){
        errors.password2 = "Password field is required";
    }

    if(!Validator.isLength(data.password,{ min: 6, max: 30 })){
        errors.password2 = "Password must be at least 6 characters";
    }
    if(!Validator.equals(data.password,data.password2)){
        errors.password2 = "Passwords must match";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

