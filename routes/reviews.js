const express = require('express');

const router = express.Router();

// Review Model
const Review = require('../model/review');

// OBTENER TODAS las reseñas
router.get('/', async (req, res) => {
  const getReviews = await Review.find();
  res.json(getReviews);
});

// AGREGAR reseña
router.post('/', async (req, res) => {
  const { seller, comment, type, stars, user } = req.body;
  const addReviews = new Review({seller, comment, type, stars, user});
    await addReviews.save();
    res.json({status: 1, mssg: 'Published Review'});
  });

  // ACTUALIZAR una nueva reseña 
router.put('/:id', async (req, res) => {
  const { seller, comment, type, stars, user } = req.body;
  const newReviews = {seller, comment, type, stars, user};
  await Review.findByIdAndUpdate(req.params.id, newReviews);
  res.json({status: 1, mssg: 'Review Updated'});
  /* if (Product.findByIdAndUpdate(req.params.id, newProduct) == true)
    res.json({status: 1, mssg: 'Product Updated'});
  else (Product.findByIdAndUpdate(req.params.id, newProduct) == false)
    res.json({status: -1, mssg: 'Product Not Updated'}); */
});

// ELIMINAR reseña
router.delete('/:id', async (req, res) => {
  await Review.findByIdAndRemove(req.params.id);
  res.json({status: 1, mssg: 'Review Deleted'});
  /* if (Product.findByIdAndRemove(req.params.id) == true)
    res.json({status: 1, mssg: 'Product Deleted'});
  else (Product.findByIdAndRemove(req.params.id) == false)
    res.json({status: -1, mssg: 'Product Not Deleted'}); */
});

module.exports = router;
/* FIN */