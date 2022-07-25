const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const Points = require('../model/points');


validateSession = () => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        //console.log(user);
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };
}

// Offer Model
const Offer = require('../model/offer');

// OBTENER UNA SOLA oferta
router.get('/:id', async (req, res) => {
  try {
    const getOffer = await Offer.findById(req.params.id).populate([
      {path: 'profile', model: 'Profile'},
      {path: 'product', model: 'Product'}
    ]);
    res.status(200).send(getOffer);
  } catch (error) {
    res.status(400).json({status: -1, mssg: error.message});
  }
});

// OBTENER TODAS las ofertas
router.get('/', async (req, res) => {
  try {
    const getReviews = await Offer.find().populate([
      {path: 'profile', model: 'Profile'},
      {path: 'product', model: 'Product'}
    ]);
    res.status(200).send(getReviews);
  } catch (error) {
    res.status(400).json({status: -1, mssg: error.message});
  }
});

// AGREGAR oferta
router.post('/apply', validateSession(), async (req, res) => {
  //console.log(req.body);
  try {
    /*/const offer = {
      offer:req.body.offer,
      profile:req.body.profile
    };
  
    const addOffer = new Offer(offer);
    await addOffer.save();/*/
    let userPoints = await Points.aggregate([{$match: {user: req.user.id} }]);

    console.log(req.body);
    console.log(userPoints);
    res.status(201).json({status:1, mssh : "Hola"});
  } catch (error) {
    res.status(400).json({status: -1, mssg: error.message});
  }
});

// ACTUALIZAR una nueva oferta
router.put('/:id', async (req, res) => {
  try {
    const updateOffer = {
      offer:req.body.offer,
      profile:req.body.profile
    };
    await Offer.findByIdAndUpdate(req.params.id, updateOffer);
    res.status(201).send('Successfully Upgraded Offer!');
    /* if (Product.findByIdAndUpdate(req.params.id, newProduct) == true)
      res.json({status: 1, mssg: 'Product Updated'});
    else (Product.findByIdAndUpdate(req.params.id, newProduct) == false)
      res.json({status: -1, mssg: 'Product Not Updated'}); */
  } catch (error) {
    res.status(400).json({status: -1, mssg: error.message});
  }
});

// ELIMINAR oferta
router.delete('/:id', async (req, res) => {
  try {
    await Offer.findByIdAndRemove(req.params.id);
    res.status(200).send('Offer Deleted');
    /* if (Product.findByIdAndRemove(req.params.id) == true)
      res.json({status: 1, mssg: 'Product Deleted'});
    else (Product.findByIdAndRemove(req.params.id) == false)
      res.json({status: -1, mssg: 'Product Not Deleted'}); */
  } catch (error) {
    res.status(400).json({status: -1, mssg: error.message});
  }
});

module.exports = router;
/* FIN 1.2 */