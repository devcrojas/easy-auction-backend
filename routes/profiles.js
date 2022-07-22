const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Profile Model
const Profile = require('../model/profile');
// Service Multer
const multer = require('../middleware/multerProfiles')


// OBTENER UN SOLO perfil
router.get('/:id', async (req, res) => {
  try {
    const getProfile = await Profile.findById(req.params.id);
    res.send(getProfile);
    res.status(200);
  } catch (error) {
    res.status(400).json({status: -1, mssg: 'Perfil aun no creado'});
  }
});

// OBTENER TODOS los perfile
router.get('/', async (req, res) => {
  try {
    const getProfiles = await Profile.find();

    res.status(200).send(getProfiles);
  } catch (error) {
    res.status(400).json({status: -1, mssg: error.message});
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
        filePath: 'uploads\\profiles\\noUserImage.jpg',
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
    res.status(400).json({status: -1, mssg: error.message});
  }
});

// ACTUALIZAR perfil
/*router.put('/:id', multer.upload.single('file'), async (req, res, next) => {
   jwt.verify(req.body.token, process.env.TOKEN_SECRET, async (err, user) => {
    if (err) {
      return res.sendStatus(403);
    } else {
      //console.log(user);
      try{
        //console.log(user.profile);
        let token = jwt.decode(req.body.token);
        const updateProfile = {
          firstName:user.profile.firstName,
          lastName:user.profile.lastName,
          birthday:user.profile.birthday,
          address:{
            cpp:user.profile.address.cpp,
            street:user.profile.address.street,
            suburb:user.profile.address.suburb,
            municipaly:user.profile.address.municipaly,
            state:user.profile.address.state
          },
          phone:user.profile.phone,
          email:user.profile.email
        };
    
        await Profile.findByIdAndUpdate(req.params.id, updateProfile);
        const getProfile = await Profile.findById(req.params.id);
        token.profile = getProfile;
        let newToken = jwt.sign(token, process.env.TOKEN_SECRET);
        res.status(201).send(newToken);
      }catch(error) {
        res.status(400).send(error.message);
      }
    }
  });
}); */
router.put('/:id', multer.upload.single('file'), async (req, res, next) => {
  try {
    //console.log(req.body);
    //console.log(user.profile);
    const updateProfile = {
      firstName: req.body.profile.firstName,
      lastName: req.body.profile.lastName,
      birthday: req.body.profile.birthday,
      address: {
        cpp: req.body.profile.address.cpp,
        street: req.body.profile.address.street,
        suburb: req.body.profile.address.suburb,
        municipaly: req.body.profile.address.municipaly,
        state: req.body.profile.address.state
      },
      phone: req.body.profile.phone,
      email: req.body.profile.email
    };

    await Profile.findByIdAndUpdate(req.params.id, updateProfile);
    res.status(200).json({ status: 1, mssg: 'Successfully Upgraded Profile!' });
  } catch (error) {
    res.status(400).json({status: -1, mssg:error.message});
  }
});

// ACTUALIZAR imagen de perfil
router.put('/image/:id', multer.upload.single('file'), async (req, res, next) => {
  //console.log(req.file);
  if (req.file && req.file.originalname) {
    try {
      //console.log(req.body.profile);
      //console.log(user.profile);
      const updateFileProfile = {};
      updateFileProfile.file = {
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2) // 0.00
      }
      await Profile.findByIdAndUpdate(req.params.id, updateFileProfile);
      res.status(201).send('Successfully Upgraded Image Profile!');

      const getProfile = await Profile.findById(req.params.id);
      jwt.sign({ getProfile }, process.env.TOKEN_SECRET, (err, token) => {
        res.json({ token })
      });
    } catch (error) {
      res.status(400).json({status: -1, mssg: error.message});
    }
  } else {
    res.json({ status: -1, mssg: "No se detecto ninguna imagen" });
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
    res.status(400).json({status: -1, mssg: error.message});
  }
});

// Authorization: Bearer <token>
function verifyToken(req, res, next) {
  const headerAuth = req.headers['authorization'];
  if (typeof headerAuth !== "undefined") {
    const token = headerAuth.split(' ')[1];
    req.token = token;
    next();
  } else {
    res.sendStatus(403);
  }
}

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
