const express = require('express');
const router = express.Router();

// Producto Model
const Product = require('../model/product');
// Service Multer
const multer = require('../middleware/multer')


// OBTENER UN SOLO producto
router.get('/:id', async (req, res) => {
  const getProduct = await Product.findById(req.params.id);
  res.json(getProduct);
});

// OBTENER TODOS los productos
router.get('/', async (req, res) => {
  try{
    const getProducts = await Product.find();
    res.status(200).send(getProducts);
  }catch(error) {
    res.status(400).send(error.message);
}
});

// AGREGAR un nuevo producto
router.post('/', multer.upload.array('files', 6), async (req, res, next) => {
  try{
    let filesArray = [];
    req.files.forEach(element => {
        const file = {
            fileName: element.originalname,
            filePath: element.path,
            fileType: element.mimetype,
            fileSize: fileSizeFormatter(element.size, 2)
        }
        filesArray.push(file);
    });
    const addProducts = new Product({
      nameProduct:req.body.nameProduct, category:req.body.category,
      description:{ material:req.body.material, marca:req.body.marca, dimensions:req.body.dimensions, actualCondition:req.body.actualCondition, observations:req.body.observations },
      status:req.body.status,
      price:{ initialP:req.body.initialP, buyNow:req.body.buyNow, offered:req.body.offered },
      auctionDate:{ initialD:req.body.initialD, final:req.body.final },
      files: filesArray
    });
    await addProducts.save();
    res.status(201).send('Products Successfully Added!');
  }catch(error) {
    res.status(400).send(error.message);
  }
});


// ACTUALIZAR a nuevo producto
router.put('/:id', multer.upload.array('files', 6), async (req, res, next) => {
  try{
    let filesArray = [];
    req.files.forEach(element => {
        const file = {
            fileName: element.originalname,
            filePath: element.path,
            fileType: element.mimetype,
            fileSize: fileSizeFormatter(element.size, 2)
        }
        filesArray.push(file);
    });
    const updateProducts = {
      nameProduct:req.body.nameProduct, category:req.body.category,
      description:{ material:req.body.material, marca:req.body.marca, dimensions:req.body.dimensions, actualCondition:req.body.actualCondition, observations:req.body.observations },
      status:req.body.status,
      price:{ initialP:req.body.initialP, buyNow:req.body.buyNow, offered:req.body.offered },
      auctionDate:{ initialD:req.body.initialD, final:req.body.final },
      files: filesArray
    };
    await updateProducts.save();
    res.status(201).send('Successfully Upgraded Products!');
  }catch(error) {
    res.status(400).send(error.message);
  }
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

/* FIN */