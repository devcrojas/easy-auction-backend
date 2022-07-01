const express = require('express');

const router = express.Router();

// Profile Model
const Profile = require('../model/profile');
// Service Multer
const multer = require('../middleware/multer')


// OBTENER UN SOLO perfil
router.get('/:id', async (req, res) => {
  const getProfile = await Profile.findById(req.params.id);
  res.json(getProfile);
});

// OBTENER TODOS los perfile
router.get('/', async (req, res) => {
  try{
    const getProfile = await Profile.find();
    res.status(200).send(getProfile);
  }catch(error) {
    res.status(400).send(error.message);
  }
});

// AGREGAR un nuevo perfil
router.post('/', multer.upload.single('file'), async (req, res, next) => {
  try{
    const addProfile = new Profile({
      firstName:req.body.firstName,
      lastName:req.body.lastName,
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
    await addProfile.save();
    res.status(201).send('Profile Successfully Added!');
  }catch(error) {
    res.status(400).send(error.message);
  }
});

// ACTUALIZAR perfil
router.put('/:id', multer.upload.single('file'), async (req, res, next) => {
  try{
    const updateProfile = {
      firstName:req.body.firstName,
      lastName:req.body.lastName,
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
    await Profile.findByIdAndUpdate(req.params.id, updateProfile);
    res.status(201).send('Successfully Upgraded Profile!');
  }catch(error) {
    res.status(400).send(error.message);
  }
});

// ELIMINAR un perfil
router.delete('/:id', async (req, res) => {
  await Profile.findByIdAndRemove(req.params.id);
  res.json({status: 1, mssg: 'Profile Deleted'});
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
