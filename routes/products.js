const express = require('express');
const router = express.Router();

// Models
const Product = require('../model/product');
const Profile = require('../model/profile');
// Service Multer
const multer = require('../middleware/multerProducts')

// Fields
const fields = multer.upload.fields([{ name: 'file', maxCount: 1 }, { name: 'files', maxCount: 6 }])


// OBTENER UN SOLO producto
router.get('/:id', async (req, res) => {
  try {
    const getProduct = await Product.findById(req.params.id);
    res.status(200).send(getProduct);
  } catch (error) {
    res.status(400).send(error.message);
  }
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
router.post('/', fields, async (req, res, next) => {
  try{
    //Se relaciona el email con la bd de profile y encuentra la coincidencia
    let sellerObject = await Profile.aggregate([{ $match: { email: req.body.email } }]);
    let filesArray = [];

    const product = {
      nameProduct:req.body.nameProduct, category:req.body.category,
      description:{ material:req.body.material, marca:req.body.marca, dimensions:req.body.dimensions, actualCondition:req.body.actualCondition, observations:req.body.observations },
      status: 'inactive',
      price:{ initialP:req.body.initialP, buyNow:req.body.buyNow, offered:req.body.offered },
      auctionDate:{ initialD:req.body.initialD, final:req.body.final },
      file:{
        fileName: req.files['file'][0].originalname,
        filePath: req.files['file'][0].path,
        fileType: req.files['file'][0].mimetype,
        fileSize: fileSizeFormatter(req.files['file'][0].size, 2) // 0.00
      },
      email: req.body.email,
      sellerData: {
        _id:sellerObject[0].email,
        firstName:sellerObject[0].firstName,
        lastName:sellerObject[0].lastName,
        birthday:sellerObject[0].birthday,
        address:{
          cpp: sellerObject[0].address.cpp,
          stree: sellerObject[0].address.stree,
          suburb: sellerObject[0].address.suburb,
          municipaly: sellerObject[0].address.municipaly,
          state: sellerObject[0].address.state,
        },
        phone:sellerObject[0].phone,
        email:sellerObject[0].email,
        password:sellerObject[0].password,
        status:sellerObject[0].status,
        file:{
          fileName: sellerObject[0].file.fileName,
          filePath: sellerObject[0].file.filePath,
          fileType: sellerObject[0].file.fileType,
          fileSize: sellerObject[0].file.fileSize
        }
      }
    };
    if(req.files['files']) {
      req.files['files'].forEach(element => {
        const image = {
          fileName: element.originalname,
          filePath: element.path,
          fileType: element.mimetype,
          fileSize: fileSizeFormatter(element.size, 2)
        }
        filesArray.push(image);
      });
      product.files = filesArray;
    }

    const addProducts = new Product(product);
    await addProducts.save();
    res.status(201).send('Products Successfully Added!');
  }catch(error) {
    res.status(400).send(error.message);
  }
});

// Actualizar campo offered de algun producto
router.put('/offered/:id', async (req, res, next) => {
  try{
    const updateOfferedProduct = {
      price:{
        offered:req.body.offered
      }
    };
    
    await Product.findByIdAndUpdate(req.params.id, updateOfferedProduct);
    res.status(201).send('Successfully Offered Upgraded Products!');
  }catch(error) {
    res.status(400).send('No se actualizo la oferta correctamente.');
  }
});

// Actualizar campo status de algun producto
router.put('/status/:id', async (req, res, next) => {
  try{
    const updateStatusProduct = {
      status:req.body.status
    };
    let update = await Product.updateOne({_id : req.params.id} ,{ $set : updateStatusProduct});
    res.status(200).json({ status: 1, mssg: 'Successfully status Upgraded Products!', update: update } );
  }catch(error) {
    console.log(error);
    res.status(401).json({status: -1, mssg: error.message});
  }
});


// ACTUALIZAR a nuevo producto
router.put('/:id', fields, async (req, res, next) => {
  try{
    //Se relaciona el email con la bd de profile y encuentra la coincidencia
    let sellerObject = await Profile.aggregate([{ $match: { email: req.body.email } }]);
    let filesArray = [];

    const updateProduct = {
      nameProduct:req.body.nameProduct, category:req.body.category,
      description:{ material:req.body.material, marca:req.body.marca, dimensions:req.body.dimensions, actualCondition:req.body.actualCondition, observations:req.body.observations },
      status:req.body.status,
      price:{ initialP:req.body.initialP, buyNow:req.body.buyNow, offered:req.body.offered },
      auctionDate:{ initialD:req.body.initialD, final:req.body.final },
      file:{
        fileName: req.files['file'][0].originalname,
        filePath: req.files['file'][0].path,
        fileType: req.files['file'][0].mimetype,
        fileSize: fileSizeFormatter(req.files['file'][0].size, 2) // 0.00
      },
      email: req.body.email,
      sellerData: {
        _id:sellerObject[0].email,
        firstName:sellerObject[0].firstName,
        lastName:sellerObject[0].lastName,
        birthday:sellerObject[0].birthday,
        address:{
          cpp: sellerObject[0].address.cpp,
          stree: sellerObject[0].address.stree,
          suburb: sellerObject[0].address.suburb,
          municipaly: sellerObject[0].address.municipaly,
          state: sellerObject[0].address.state,
        },
        phone:sellerObject[0].phone,
        email:sellerObject[0].email,
        password:sellerObject[0].password,
        status:sellerObject[0].status,
        file:{
          fileName: sellerObject[0].file.fileName,
          filePath: sellerObject[0].file.filePath,
          fileType: sellerObject[0].file.fileType,
          fileSize: sellerObject[0].file.fileSize
        }
      }
    };
    if(req.files['files']) {
      req.files['files'].forEach(element => {
        const image = {
          fileName: element.originalname,
          filePath: element.path,
          fileType: element.mimetype,
          fileSize: fileSizeFormatter(element.size, 2)
        }
        filesArray.push(image);
      });
      updateProduct.files = filesArray;
    }
    
    await Product.findByIdAndUpdate(req.params.id, updateProduct);
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
  try {
    await Product.findByIdAndRemove(req.params.id);
    res.status(200).send('Product Deleted');
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

/* FIN 1.1 */