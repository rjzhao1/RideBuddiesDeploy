const router = require('express').Router();
const Rides = require('../../models/rides.model');
const validateForm = require("../../client/validation/form");


router.route('/').get((req,res)=>{
    Rides.find({seats:{$gt:0}})
        .then(rides=>res.json(rides))
        .catch(err => res.status(400).json('Error '+err));
});

router.route('/view/:id').get((req,res)=>{
    Rides.findById(req.params.id)
        .then(rides=>{res.json(rides)})
        .catch(err => res.status(400).json('Error '+err));
});
router.route('/myRides').get((req,res)=>{
    
    Rides.find()
        .then( rides =>res.json(rides))  
        .catch(err => res.status(400).json('Error '+err));
});
router.route('/add').post((req,res)=>{

    const{errors,isValid}=validateForm(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }
    
    const host_email = req.body.host_email;
    const seats = Number(req.body.seats);
    const group_Name = req.body.group_Name;
    const pickup = req.body.pickup;
    const lat = req.body.lat;
    const lng = req.body.lng;
    const location = req.body.location;
    const date = Date.parse(req.body.date);
    const time = req.body.time;


    const newRides = new Rides({
        host_email,
        seats,
        group_Name,
        pickup,
        lat,
        lng,
        location,
        date,
        time
    });

    newRides.save()
        .then(()=>res.json("Ride Group Created"))
        .catch(err => res.status(400).json(errors));
});

router.route('/:id').delete((req,res)=>{
    
   Rides.findById(req.param.id)
    .then(group =>{
        Rides.findOneAndDelete({_id:req.params.id,host_email:req.body.host_email})
        .then((result)=>{
            if(!result){
                
                
                res.status(404).json('Ride Group not found');
            }else{
                res.json('Ride Deleted');
            }
            })
        .catch(err => res.status(400).json('Error: ' + err));
        
    })
   
});

router.route('/join/:id').post((req,res)=>{
    const passenger = req.body.passenger;
    const passenger_email = req.body.passenger_email;

    Rides.findOneAndUpdate(
        {_id:req.params.id,seats:{$gt:0}},
        {$inc:{seats:-1}})
        .then((result) => {
            if(!result){
                res.status(404).json('Ride Group not found or full');
                
            }else{
                result.passenger.push({passenger:passenger,passenger_email:passenger_email});
                result.save()
                    .then(res.json("Ride Joined"))
                    .catch(err => res.status(400).json('Error: ' + err));
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));

    
});
module.exports = router;