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
      {path: 'userLog', model: 'Profile'},
      {path: 'profileProd', model: 'Profile'},
      {path: 'product', model: 'Product'}
    ]);
    res.status(200).send(getReview);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({status: -1, mssg: error.message});
  }
});

// OBTENER TODAS las reseñas
router.get('/', async (req, res) => {
  try {
    const getReviews = await Review.find().populate([
      {path: 'userLog', model: 'Profile'},
      {path: 'profileProd', model: 'Profile'},
      {path: 'product', model: 'Product'}
    ]);
    res.status(200).send(getReviews);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({status: -1, mssg: error.message});
  }
});

// Obtener reseñas que hizo el usuario de la sesion
router.post('/myreviews', async (req, res) => {
  try {
    const getMyReviews = await Review.find({
      'userLog': req.body.userLog
    }).populate([
      {path: 'userLog', model: 'Profile', select: '_id'},
      {path: 'profileProd', model: 'Profile', select: '_id firstName lastName file'},
      {path: 'product', model: 'Product', select: '_id nameProduct file'}
    ]);
    res.status(200).send(getMyReviews);
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
});

// AGREGAR reseña
router.post('/', async (req, res) => {
  //console.log(req.body);
  try {
    //let userObject = await Profile.aggregate([{ $match: { _id: req.body.userLog } }]);
    //let profileObject = await Profile.aggregate([{ $match: { email: req.body.profileProd }]);
    //let products = await Product.find();
    //let productObject = products.filter((prod) => {return prod._id == req.body.product});
    //console.log(productObject);
    const review = {
      comment:req.body.comment,
      type:req.body.type,
      stars:req.body.stars,
      userLog:req.body.userLog,
      profileProd:req.body.profileProd,
      product:req.body.product
    };
  
    const addReviews = new Review(review);
    await addReviews.save(function (err) {
      if(err) return console.log(err);
    });
    res.status(201).send('Successfully Upgraded Review!');
  } catch (error) {
    console.log(error.message);
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
    console.log(error.message);
    res.status(400).json({status: -1, mssg: error.message});
  }
});

// Actualizar campo status de alguna reseña
router.put('/status/:id', async (req, res, next) => {
  try{
    const updateStatusReview = {
      status:req.body.status
    };
    let update = await Review.updateOne({_id : req.params.id} ,{ $set : updateStatusReview});
    res.status(200).json({ status: 1, mssg: 'Successfully Status Upgraded Review!', update: update } );
  }catch(error) {
    console.log(error.message);
    res.status(401).json({status: -1, mssg: error.message});
  }
});

// ELIMINAR reseña
router.delete('/:id', async (req, res) => {
  try {
    await Review.findByIdAndRemove(req.params.id);
    res.status(200).send('Review Deleted');
  } catch (error) {
    console.log(error.message);
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
/* FIN 1.21 */