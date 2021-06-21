const router = require('express').Router();
const mongoose = require('mongoose');
const { storeSchema } = require('../models/Store');


//get
router.get('/',async (req,res)=>{
    const store = await storeSchema.find().sort('name');
    res.send(store);
});

//post
router.post('/', async (req,res)=>{
  
    const store = new storeSchema({
        name: req.body.name,
        email:req.body.email,
        address:req.body.address,
        drugs:req.body.drugs,
        contact: {
            owner: genre._id,
            phone: genre.name
           
        },
        
    });
    await movie.save();
    res.send(movie);

});
//put
router.put('/:id',async (req,res)=>{
    const {error} = validateMovie(req.body);
    if(error) res.status('400').send(error.details[0].message);

   const movie =await Movie.findByIdAndUpdate(req.params.id,{name:req.body.name},{new:true});

    if(!movie) return res.status('404').send('the movie with the id could not be found');
 
    res.send(movie);

});
//delete
router.delete('/:id',async (req,res)=>{
    const movie =await Movie.findByIdAndRemove(req.params.id);

    if(!movie) return res.status('404').send('the movie with the id could not be found');

    res.send(movie);
});

router.get('/id:',async (req,res)=>{
    const movie = await Movie.findById(req.params.id);

    if(!movie) return res.status('404').send('the movie with the id could not be found');

    res.send(movie);
});

module.exports =router;

module.exports = router;
