const express = require('express');

const router = express.Router();

// Review Model
const Review = require('../model/review');
const Profile = require('../model/profile');
const Seller = require('../model/seller');
const Product = require('../model/product');

// OBTENER UN SOLO perfil
router.get('/:id', async (req, res) => {
  try {
    const getReview = await Review.findById(req.params.id);
    res.status(200).send(getReview);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// OBTENER TODAS las reseñas
router.get('/', async (req, res) => {
  try {
    const getReviews = await Review.find();
    res.status(200).send(getReviews);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// AGREGAR reseña
router.post('/', async (req, res) => {
  try {
    let userObject = await Profile.aggregate([{ $match: { email: req.body.emailU } }]);
    let profileObject = await Seller.aggregate([{ $match: { email: req.body.emailP } }]);
    let productObject = await Product.aggregate([{ $match: { _id: req.body.productId } }]);

    const review = {
      userData:{
        name:userObject[0].name,
        email:userObject[0].email
      },
      comment:req.body.comment,
      type:req.body.type,
      stars:req.body.stars,
      emailU:req.body.emailU,
      emailP:req.body.emailP,
      productId:req.body.productId,
      profileData:{
        firstName:profileObject[0].firstName,
        lastName:profileObject[0].lastName,
        email:profileObject[0].email,
        file:{
          fileName: profileObject[0].file.fileName,
          filePath: profileObject[0].file.filePath,
          fileType: profileObject[0].file.fileType,
          fileSize: profileObject[0].file.fileSize
        }
      },
      productData:{
        nameProduct:productObject[0].nameProduct,
        file:{
          fileName: productObject[0].file.fileName,
          filePath: productObject[0].file.filePath,
          fileType: productObject[0].file.fileType,
          fileSize: productObject[0].file.fileSize
        }
      }
    };
  
    const addReviews = new Review(review);
    await addReviews.save();
    res.status(201).send('Successfully Upgraded Review!');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// ACTUALIZAR una nueva reseña 
router.put('/:id', async (req, res) => {
  try {
    let userObject = await Profile.aggregate([{ $match: { email: req.body.emailU } }]);
    let profileObject = await Seller.aggregate([{ $match: { email: req.body.emailP } }]);
    let productObject = await Product.aggregate([{ $match: { _id: req.body.productId } }]);

    const updateReviews = {
      userData:{
        name:userObject[0].name,
        email:userObject[0].email
      },
      comment:req.body.comment,
      type:req.body.type,
      stars:req.body.stars,
      emailU:req.body.emailU,
      emailP:req.body.emailP,
      productId:req.body.productId,
      profileData:{
        firstName:profileObject[0].firstName,
        lastName:profileObject[0].lastName,
        email:profileObject[0].email,
        file:{
          fileName: profileObject[0].file.fileName,
          filePath: profileObject[0].file.filePath,
          fileType: profileObject[0].file.fileType,
          fileSize: profileObject[0].file.fileSize
        }
      },
      productData:{
        nameProduct:productObject[0].nameProduct,
        file:{
          fileName: productObject[0].file.fileName,
          filePath: productObject[0].file.filePath,
          fileType: productObject[0].file.fileType,
          fileSize: productObject[0].file.fileSize
        }
      }
    };
    await Review.findByIdAndUpdate(req.params.id, updateReviews);
    res.status(201).send('Successfully Upgraded Review!');
    /* if (Product.findByIdAndUpdate(req.params.id, newProduct) == true)
      res.json({status: 1, mssg: 'Product Updated'});
    else (Product.findByIdAndUpdate(req.params.id, newProduct) == false)
      res.json({status: -1, mssg: 'Product Not Updated'}); */
  } catch (error) {
    res.status(400).send(error.message);
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
    res.status(400).send(error.message);
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
/* FIN 1.0 */