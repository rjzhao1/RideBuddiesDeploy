const express = require('express');
const cors = require ('cors');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require('path');

require('dotenv').config();

const app = express();

const usersRouter = require('./routes/api/users');
const ridesRouter = require('./routes/api/rides');


// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cors());
app.use(bodyParser.json());

app.use(passport.initialize());
require("./config/passport")(passport);


const { dirname } = require('path');

app.use('/api/users',usersRouter);
app.use('/api/rides',ridesRouter);

if(process.env.NODE_ENV=='production'){
  app.use('/', express.static(path.join(__dirname, '/client/build')));

  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
  });
}




const port = process.env.PORT||5000;



const uri = process.env.ATLAS_URI;
mongoose.connect(uri,{useNewUrlParser:true, useCreateIndex:true,'useFindAndModify':false})

const connection = mongoose.connection;

connection.once('open',()=>{
    console.log("MondoDB database connection established successfully");
    
})


app.listen(port,()=>{
    console.log(`Server is running on port: ${port}`);
});