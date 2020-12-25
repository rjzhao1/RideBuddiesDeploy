const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateForm(data){
    let errors = {};

    data.group_Name = !isEmpty(data.group_Name) ? data.group_Name:"";
    data.seats = !isEmpty(data.seats)? data.seats:"";
    data.pickup = !isEmpty(data.pickup)? data.pickup:"";
    data.location = !isEmpty(data.location)? data.location:"";
    data.date = !isEmpty(data.date)? data.date:"";
    data.time = !isEmpty(data.date)? data.time:"";

    // Checks if there is a group name
    if(Validator.isEmpty(data.group_Name)){
        errors.group_Name = "Group Name Field is required";
    }

    // Check if there is a seat, and seat is a number and number is greater than 0
    if(Validator.isEmpty(data.seats)){
        errors.seats = "Seat field is required";
    }else if(Number(data.seats<=0)){
        errors.noSeats = "Seat must be greater than 0";
    }else if(isNaN(data.seats)){
        errors.seatNaN = "Seat is not a number";
    }

    // Check if there is a pickup
    if(Validator.isEmpty(data.pickup)){
        errors.pickup = "Pickup field is required";
    }

    // Check if there is a location
    if(Validator.isEmpty(data.location)){
        errors.location = "Location field is required";
    }

    // Check if there is a date
    if(Validator.isEmpty(data.date)){
        errors.date = "Date field is required";
    }

    // Check if there is a time
    if(Validator.isEmpty(data.time)){
        errors.time = "Time field is required";
    }

    // return any errors
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
