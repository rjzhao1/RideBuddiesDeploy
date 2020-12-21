const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema for passengers
const passengerSchema = new Schema({
    passenger:{type:String,required:true},
    passenger_email:{type:String,required:true},
},{
    timestamps:true,
});

//Schema for each ride groups
const ridesGroupSchema = new Schema({
    host_email: {type:String,required:true},
    seats:{type:Number,required:true},
    group_Name: {type:String,required:true},
    pickup: {type:String,required:true},
    lat:{type:Number},
    lng:{type:Number},
    location: {type:String,required:true},
    date:{type:Date,required:true},
    time:{type:String,required:true},
    passenger:[passengerSchema]
},{
    timestamps:true,
});


const Rides = mongoose.model('Rides',ridesGroupSchema);

module.exports = Rides;
