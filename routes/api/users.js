const router = require('express').Router();
let User = require('../../models/user.model');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validateRegister = require("../../client/validation/register");
const validateLogin = require("../../client/validation/login")
const keys = require("../../config/keys");




router.route('/').get((req,res)=>{
    User.find()
        .then(users=>res.json(users))
        .catch(err => res.status(400).json('Error '+err));
});

router.route('/:id').delete((req,res)=>{
    User.findByIdAndDelete(req.params.id)
        .then(()=>res.json('User Deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route("/register").post((req,res)=>{
    const{errors,isValid}=validateRegister(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }

    User.findOne({email:req.body.email}).then(user =>{
        if(user){
            return res.status(400).json({email:"Email already exists"});
        }else{            
            const newUser = new User({
                email:req.body.email,
                username:req.body.username,
                password: req.body.password
            });
            
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password, salt, (err,hash)=>{
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user =>res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    })
});

router.route("/login").post((req,res)=>{
    const {errors,isValid} = validateLogin(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    
    User.findOne({email}).then(user =>{
        if(!user){
            return res.status(404).json({emailnotfound:"Email not found"});
        }

        bcrypt.compare(password,user.password).then(isMatch =>{
            if(isMatch){
                const payload ={
                    id: user.id,
                    username:user.username,
                    email:user.email
                };
                
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926
                    },
                    (err,token) =>{
                        res.json({
                            success:true,
                            token: "Bearer" + token
                        });
                    });
            }else{
                return res.status(400).json({passwordincorrect: "Password incorrect"});
            }
        });
    });
    
});

module.exports = router;