const express = require('express');

const router = express.Router();

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
    res.status(400).send(error.message);
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
    res.status(400).send(error.message);
  }
});

// AGREGAR oferta
router.post('/', async (req, res) => {
  //console.log(req.body);
  try {
    const offer = {
      offer:req.body.offer,
      profile:req.body.profile
    };
  
    const addOffer = new Offer(offer);
    await addOffer.save();
    res.status(201).send('Successfully Upgraded Offer!');
  } catch (error) {
    res.status(400).send(error.message);
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
    res.status(400).send(error.message);
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
    res.status(400).send(error.message);
  }
});

module.exports = router;
/* FIN 1.2 */