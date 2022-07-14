const express = require('express');

const router = express.Router();

// Review Model
const Review = require('../model/review');
const Profile = require('../model/profile');
const Product = require('../model/product');

// OBTENER UN SOLO perfil
router.get('/:id', async (req, res) => {
  try {
    const getReview = await Review.findById(req.params.id).populate([
      {path: 'emailU', model: 'Profile'},
      {path: 'emailP', model: 'Profile'},
      {path: 'productId', model: 'Product'}
    ]);
    res.status(200).send(getReview);
  } catch (error) {
    res.status(400).json({status: -1, mssg: error.message});
  }
});

// OBTENER TODAS las reseñas
router.get('/', async (req, res) => {
  try {
    const getReviews = await Review.find().populate([
      {path: 'emailU', model: 'Profile'},
      {path: 'emailP', model: 'Profile'},
      {path: 'productId', model: 'Product'}
    ]);
    res.status(200).send(getReviews);
  } catch (error) {
    res.status(400).json({status: -1, mssg: error.message});
  }
});

// Obtener reseñas que hizo el usuario de la sesion
router.post('/myreviews', async (req, res) => {
  try {
    const getMyReviews = await Review.find({
      'emailU': req.body.emailU
    }).populate([
      {path: 'emailU', model: 'Profile', select: '_id'},
      {path: 'emailP', model: 'Profile', select: '_id firstName lastName file'},
      {path: 'productId', model: 'Product', select: '_id nameProduct file'}
    ]);
    res.status(200).send(getMyReviews);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// AGREGAR reseña
router.post('/', async (req, res) => {
  //console.log(req.body);
  try {
    //let userObject = await Profile.aggregate([{ $match: { _id: req.body.emailU } }]);
    //let profileObject = await Profile.aggregate([{ $match: { email: req.body.profile }]);
    //let products = await Product.find();
    //let productObject = products.filter((prod) => {return prod._id == req.body.product});
    //console.log(productObject);
    const review = {
      comment:req.body.comment,
      type:req.body.type,
      stars:req.body.stars,
      emailU:req.body.emailU,
      emailP:req.body.emailP,
      productId:req.body.productId
    };
  
    const addReviews = new Review(review);
    await addReviews.save();
    res.status(201).send('Successfully Upgraded Review!');
  } catch (error) {
    res.status(400).json({status: -1, mssg: error.message});
  }
});

// ACTUALIZAR una nueva reseña 
router.put('/:id', async (req, res) => {
  try {
    //let userObject = await Profile.aggregate([{ $match: { email: req.body.userSession } }]);
    //let profileObject = await Profile.aggregate([{ $match: { email: req.body.profile } }]);

    const updateReview = {
      comment:req.body.comment,
      type:req.body.type,
      stars:req.body.stars,
    };
    await Review.findByIdAndUpdate(req.params.id, updateReview);
    res.status(201).send('Successfully Upgraded Review!');
    /* if (Product.findByIdAndUpdate(req.params.id, newProduct) == true)
      res.json({status: 1, mssg: 'Product Updated'});
    else (Product.findByIdAndUpdate(req.params.id, newProduct) == false)
      res.json({status: -1, mssg: 'Product Not Updated'}); */
  } catch (error) {
    res.status(400).json({status: -1, mssg: error.message});
  }
});

// ELIMINAR reseña
router.delete('/:id', async (req, res) => {
  try {
    await Review.findByIdAndRemove(req.params.id);
    res.status(200).send('Review Deleted');
    /* if (Product.findByIdAndRemove(req.params.id) == true)
      res.json({status: 1, mssg: 'Product Deleted'});
    else (Product.findByIdAndRemove(req.params.id) == false)
      res.json({status: -1, mssg: 'Product Not Deleted'}); */
  } catch (error) {
    res.status(400).json({status: -1, mssg: error.message});
  }
});

const fileSizeFormatter = (bytes, decimal) => {
  if(bytes === 0){
      return '0 Bytes';
  }
  const dm = decimal || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];
}

module.exports = router;
/* FIN 1.2 */