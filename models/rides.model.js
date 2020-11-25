const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const riderSchema = new Schema({
    rider:{type:String,required:true},
    rider_email:{type:String,required:true},
},{
    timestamps:true,
});

const ridesGroupSchema = new Schema({
    host_email: {type:String,required:true},
    seats:{type:Number,required:true},
    group_Name: {type:String,required:true},
    pickup: {type:String,required:true},
    pick_lat:{type:Number},
    pick_lng:{type:Number},
    location: {type:String,required:true},
    date:{type:Date,required:true},
    time:{type:String,required:true},
    rider:[riderSchema]
},{
    timestamps:true,
});


const Rides = mongoose.model('Rides',ridesGroupSchema);

module.exports = Rides;
