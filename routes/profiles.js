const express = require('express');

const router = express.Router();

// Profile Model
const Profile = require('../model/profile');
const Login = require('../model/login');
// Service Multer
const multer = require('../middleware/multer')


// OBTENER UN SOLO perfil
router.get('/:id', async (req, res) => {
  try {
    const getProfile = await Profile.findById(req.params.id);
    res.status(200).send(getProfile);
  } catch (error) {
    res.status(400).send('Perfil aun no creado');
  }
});

// OBTENER TODOS los perfile
router.get('/', async (req, res) => {
  try {
    const getProfiles = await Profile.find();

    res.status(200).send(getProfiles);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// AGREGAR un nuevo perfil
router.post('/', multer.upload.single('file'), async (req, res, next) => {
  try {
    const profile = {
      _id: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthday: req.body.birthday,
      address: {
        cpp: req.body.address.cpp,
        street: req.body.address.street,
        suburb: req.body.address.suburb,
        municipaly: req.body.address.municipaly,
        state: req.body.address.state,
      },
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
      status: req.body.status
    };

    if (typeof req.file === "undefined") {
      profile.file = {
        fileName: 'noUserImage.jpg',
        filePath: 'uploads\\noUserImage.jpg',
        fileType: 'image/jpeg',
        fileSize: fileSizeFormatter(8364, 2)
      };
    } else {
      profile.file = {
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2) // 0.00
      };
    }
    /* Pasar la imagen solamente si existe (lo mismo que arriba XD):
    if(req.file && req.file.originalname) {
      profile.file = {
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2) // 0.00
      } 
    } */
    const addProfile = new Profile(profile);
    await addProfile.save();
    res.status(201).send('Profile Successfully Added!');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// ACTUALIZAR perfil
router.put('/:id', multer.upload.single('file'), async (req, res, next) => {
  try{
    //console.log(req.body.profile);
    const updateProfile = {
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      birthday:req.body.birthday,
      address:{
        cpp:req.body.cpp,
        street:req.body.street,
        suburb:req.body.suburb,
        municipaly:req.body.municipaly,
        state:req.body.state,
      },
      phone:req.body.phone,
      email:req.body.email
    };
    
    /* updateProfile.file = {
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2) // 0.00
    }; */
    if(req.file && req.file.originalname) {
      updateProfile.file = {
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2) // 0.00
      } 
    }

    await Profile.findByIdAndUpdate(req.params.id, updateProfile);
    res.status(201).send('Successfully Upgraded Profile!');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// ELIMINAR un perfil
router.delete('/:id', async (req, res) => {
  try {
    await Profile.findByIdAndRemove(req.params.id);
    res.status(200).send('Profile Deleted');
    /* if (Product.findByIdAndRemove(req.params.id) == true)
      res.json({status: 1, mssg: 'Product Deleted'});
    else (Product.findByIdAndRemove(req.params.id) == false)
      res.json({status: -1, mssg: 'Product Not Deleted'}); */
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const dm = decimal || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];
}

module.exports = router;
