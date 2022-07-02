const express = require('express');

const router = express.Router();

// Seller Model
const Seller = require('../model/seller');
// Service Multer
const multer = require('../middleware/multer')


// OBTENER UN SOLO vendedor
router.get('/:id', async (req, res) => {
  const getSeller = await Seller.findById(req.params.id);
  res.json(getSeller);
});

// OBTENER TODOS los vendedores
router.get('/', async (req, res) => {
  try{
    const getSeller = await Seller.find();
    res.status(200).send(getSeller);
  }catch(error) {
    res.status(400).send(error.message);
  }
});

// AGREGAR un nuevo vendedor
router.post('/', multer.upload.single('file'), async (req, res, next) => {
  try{
    const addSeller = new Seller({
      firstNameSeller:req.body.firstNameSeller,
      lastNameSeller:req.body.lastNameSeller,
      birthday:req.body.birthday,
      address:req.body.address,
      phone:req.body.phone,
      email:req.body.email,
      password:req.body.password,
      bankAccount:{
        cardNumber:req.body.cardNumber,
        expiration:req.body.expiration,
        cvv:req.body.cvv
      },
      emailPaypal:req.body.emailPaypal,
      status:req.body.status,
      file:{
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2) // 0.00
      }
    });
    await addSeller.save();
    res.status(201).send('Seller Successfully Added!');
  }catch(error) {
    res.status(400).send(error.message);
  }
});

// ACTUALIZAR vendedor
router.put('/:id', multer.upload.single('file'), async (req, res, next) => {
  try{
    const updateSeller = {
      firstNameSeller:req.body.firstNameSeller,
      lastNameSeller:req.body.lastNameSeller,
      birthday:req.body.birthday,
      address:req.body.address,
      phone:req.body.phone,
      email:req.body.email,
      password:req.body.password,
      bankAccount:{
        cardNumber:req.body.cardNumber,
        expiration:req.body.expiration,
        cvv:req.body.cvv
      },
      emailPaypal:req.body.emailPaypal,
      status:req.body.status,
      file:{
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2) // 0.00
      }
    };
    await Seller.findByIdAndUpdate(req.params.id, updateProfile);
    res.status(201).send('Successfully Upgraded Seller!');
  }catch(error) {
    res.status(400).send(error.message);
  }
});

// ELIMINAR un vendedor
router.delete('/:id', async (req, res) => {
  await Seller.findByIdAndRemove(req.params.id);
  res.json({status: 1, mssg: 'Seller Deleted'});
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