const express = require('express');
const router = express.Router();

// Producto Model
const Product = require('../models/product');

// OBTENER UN SOLO producto
router.get('/:id', async (req, res) => {
  const getProduct = await Product.findById(req.params.id);
  res.json(getProduct);
});

// OBTENER TODOS los productos
router.get('/', async (req, res) => {
  const getProducts = await Product.find();
  res.json(getProducts);
});

// AGREGAR un nuevo producto
router.post('/', async (req, res) => {
  const {
    nameProduct, category,
    description, material, marca, dimensions, actualCondition, observations,
    status,
    price, initialP, buyNow, offered,
    auctionDate, initialD, final,
    images, img1, img2, img3, img4, img5,img6
  } = req.body;
  const addProducts = new Product(
    {
      nameProduct, category, description, material, marca, dimensions,
      actualCondition, observations, status, price, initialP, buyNow,
      offered, auctionDate, initialD, final, images, img1, img2,
      img3, img4, img5, img6
    }
  );
  await addProducts.save();
  res.json({status: 1, mssg: 'Product Saved'});
});


// ACTUALIZAR a nuevo producto
router.put('/:id', async (req, res) => {
  const {
    nameProduct, category,
    description, material, marca, dimensions, actualCondition, observations,
    status,
    price, initialP, buyNow, offered,
    auctionDate, initialD, final,
    images, img1, img2, img3, img4, img5,img6
  } = req.body;
  const newProduct = {
    nameProduct, category, description, material, marca, dimensions,
    actualCondition, observations, status, price, initialP, buyNow,
    offered, auctionDate, initialD, final, images, img1, img2,
    img3, img4, img5, img6
  };
  await Product.findByIdAndUpdate(req.params.id, newProduct);
  res.json({status: 1, mssg: 'Product Updated'});
  /* if (Product.findByIdAndUpdate(req.params.id, newProduct) == true)
    res.json({status: 1, mssg: 'Product Updated'});
  else (Product.findByIdAndUpdate(req.params.id, newProduct) == false)
    res.json({status: -1, mssg: 'Product Not Updated'}); */
});

// ELIMINAR un producto
router.delete('/:id', async (req, res) => {
  await Product.findByIdAndRemove(req.params.id);
  res.json({status: 1, mssg: 'Product Deleted'});
  /* if (Product.findByIdAndRemove(req.params.id) == true)
    res.json({status: 1, mssg: 'Product Deleted'});
  else (Product.findByIdAndRemove(req.params.id) == false)
    res.json({status: -1, mssg: 'Product Not Deleted'}); */
});

module.exports = router;