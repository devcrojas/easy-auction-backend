const express = require('express');
const router = express.Router();

// Producto Model
const Product = require('../model/product');

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
router.post('/', image.upload, async (req, res) => {

  var obj = { nameProduct:req.body.nameProduct, category:req.body.category,
    description:{ material:req.body.material, marca:req.body.marca, dimensions:req.body.dimensions, actualCondition:req.body.actualCondition, observations:req.body.observations },
    status:req.body.status,
    price:{ initialP:req.body.initialP, buyNow:req.body.buyNow, offered:req.body.offered },
    auctionDate:{ initialD:req.body.initialD, final:req.body.final },
    image:{
      data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
      contentType: 'image/png'
    }
  }
  const addProducts = new Product(obj);
  await addProducts.save();
  res.json({status: 1, mssg: 'Product Saved'});
});


// ACTUALIZAR a nuevo producto
router.put('/:id', async (req, res) => {
  var obj = { nameProduct:req.body.nameProduct, category:req.body.category,
    description:{ material:req.body.material, marca:req.body.marca, dimensions:req.body.dimensions, actualCondition:req.body.actualCondition, observations:req.body.observations },
    status:req.body.status,
    price:{ initialP:req.body.initialP, buyNow:req.body.buyNow, offered:req.body.offered },
    auctionDate:{ initialD:req.body.initialD, final:req.body.final },
    image:{
      data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
      contentType: 'image/png'
    }
  }
  const newProduct = obj;
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
/* fin */