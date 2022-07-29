const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const router = express.Router();

// Models
const Product = require('../model/product');
const Profile = require('../model/profile');
// Service Multer
const multer = require('../middleware/multerProducts')

// Fields
const fields = multer.upload.fields([{ name: 'file', maxCount: 1 }, { name: 'files', maxCount: 5 }])

// Validacion de sesion
validateSession = () => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        //console.log(user);
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };
}


// OBTENER UN SOLO producto
router.get('/:id', validateSession(), async (req, res) => {
  try {
    const getProduct = await Product.findById(req.params.id).populate([
      {path: 'email', model: 'Profile'},
      {path: 'profile', model: 'Profile'}
    ]);
    res.status(200).send(getProduct);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({status: -1, mssg: error.message});
  }
});

// OBTENER TODOS los productos activos (Principal)
router.get('/', async (req, res) => {
  try{
    const getProducts = await Product.find({
      'status': 'active'
    }).populate([
      {path: 'email', model: 'Profile'},
      {path: 'profile', model: 'Profile'}
    ]);
    res.status(200).send(getProducts);
  }catch(error) {
    console.log(error.message);
    res.status(400).json({status: -1, mssg: error.message});
}
});

// OBTENER TODOS los productos
router.get('/all/products', validateSession(), async (req, res) => {
  try{
    const getAllProducts = await Product.find().populate([
      {path: 'email', model: 'Profile'},
      {path: 'profile', model: 'Profile'}
    ]);
    res.status(200).send(getAllProducts);
  }catch(error) {
    console.log(error.message);
    res.status(400).json({status: -1, mssg: error.message});
}
});

// Obtener los productos que publico el usuario de la sesion
router.post('/myproducts', validateSession(), async (req, res) => {
  try{
    if(req.body.email){
      const getMyProducts = await Product.find({
        'email': req.body.email
      }).populate([/* Populate opcional */
        {path: 'email', model: 'Profile'},
        {path: 'profile', model: 'Profile'}
      ]);
      res.status(200).send(getMyProducts);
    }
    if(req.body.profile){
      const getMyProducts = await Product.find({
        'profile': req.body.profile
      }).populate([/* Populate opcional */
        {path: 'email', model: 'Profile'},
        {path: 'profile', model: 'Profile'}
      ]);
      res.status(200).send(getMyProducts);
    }
    
  }catch(error) {
    console.log(error.message);
    res.status(400).json({status: -1, mssg: error.message});
}
});

// Obtener los productos que gano o tiene el usuario
router.post('/closeAuction', validateSession(), async (req, res) => {
  try{
    console.log(req.body);
    var products = {}
    products = await Product.findById(req.body._id);
    await Product.updateOne({_id: req.body._id}, {$set: {offerActivity: true}});
    //No hay ganador
    //console.log(products);
    //var productUpdate = products;
    //console.log((typeof products.price === "undefined"));
    //console.log((typeof req.body.price !== "undefined" && typeof req.body.price.winOffered === "undefined"));
    console.log(products.price.winOffered);
    if(typeof products.price.winOffered === "undefined"){
      await Product.updateOne({_id: req.body._id}, {$set: {status: "inactive"}});
    }else{
      products.profileWin = products.price.winOffered;
      products.status = "purchased";
      products.phase = "";
      await Product.updateOne({_id: req.body._id}, {$set: products});
    }
    //Se valida que la fecha de fin haya culminado,
    //Si culmino, se hace update en profileWin, phase, status y se crea objeto con datos del ganador
    res.status(200).send({status: 1, product: products});
  }catch(error) {
    console.log(error.message);
    res.status(400).json({status: -1, mssg: error.message});
}
});

router.post('/myearnedproducts', validateSession(), async (req, res) => {
  try{
    const getEarnedProducts = await Product.find({
      'profileWin': req.body.profileWin
    }).populate([
      {path: 'email', model: 'Profile'},
      {path: 'profile', model: 'Profile'}
    ]);
    res.status(200).send(getEarnedProducts);
  }catch(error) {
    console.log(error.message);
    res.status(400).json({status: -1, mssg: error.message});
}
});

// AGREGAR un nuevo producto
router.post('/', validateSession(), fields, async (req, res, next) => {
  try{
    //Se relaciona el email con la bd de profile y encuentra la coincidencia
    //let sellerObject = await Profile.aggregate([{ $match: { email: req.body.email } }]);
    let filesArray = [];

    const product = {
      nameProduct:req.body.nameProduct, category:req.body.category,
      description:{ material:req.body.material, marca:req.body.marca, dimensions:req.body.dimensions, actualCondition:req.body.actualCondition, observations:req.body.observations },
      price:{ initialP:req.body.initialP, buyNow:req.body.buyNow, offered:req.body.offered },
      auctionDate:{ create:req.body.create, final:req.body.final, initialD:'' },
      adminAuth: '',
      status: 'inactive',
      file:{
        fileName: req.files['file'][0].originalname,
        filePath: req.files['file'][0].path,
        fileType: req.files['file'][0].mimetype,
        fileSize: fileSizeFormatter(req.files['file'][0].size, 2) // 0.00
      },
      profileWin: ''
    };
    if(req.body.email){
      product.email = req.body.email;
    }
    if(req.body.profile){
      product.profile = req.body.profile;
    }
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
    await addProducts.save(function (err) {
      if(err) return console.log(err);
    });
    res.status(201).send('Product Successfully Added!');
  }catch(error) {
    console.log(error.message);
    res.status(400).json({status: -1, mssg: error.message});
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
    
    let update = await Product.updateOne({_id : req.params.id} ,{ $set : updateOfferedProduct});
    res.status(201).json({ status: 1, mssg: 'Successfully Offered Upgraded Product!', update: update } );
  }catch(error) {
    console.log(error.message);
    res.status(400).json({status: -1, mssg: error.message});
  }
});

// Autorizar subasta
router.put('/auctionauth/:id', validateSession(), async (req, res, next) => {
  try{
    const getProductAuth = await Product.findById(req.params.id);
    let dateAuthProd = '';
    const updateAuthProduct = {
      status:req.body.status,
      adminAuth:req.body.adminAuth,
      auctionDate:{ create:getProductAuth.auctionDate.create, final:getProductAuth.auctionDate.final, initialD:req.body.dateAuthProd }
    };
    dateAuthProd = req.body.dateAuthProd;
    let updateAuth = await Product.updateOne({_id : req.params.id} ,{ $set : updateAuthProduct});
    let logProdAuth = await Product.updateOne({_id: req.params.id},{$set : {logAuthProd: {
      status:req.body.status,
      admin: req.body.adminAuth,
      dateStatus: dateAuthProd,
      dateInit: dateAuthProd
    }} });
    console.log(logProdAuth);
    /* console.log({
      "admin": req.body.adminAuth,
      "dateAccept": req.body.auctionDate.acceptance,
      "dateInit": productAuth.auctionDate.initialD
    }); */
    res.status(200).json({ status: 1, mssg: 'Authorized Product!', update: updateAuth } );
  }catch(error) {
    console.log(error.message);
    res.status(401).json({status: -1, mssg: error.message});
  }
});

// Actualizar campo status de algun producto
router.put('/status/:id', validateSession(), async (req, res, next) => {
  try{
    const updateStatusProduct = {
      status:req.body.status
    };
    let update = await Product.updateOne({_id : req.params.id} ,{ $set : updateStatusProduct});
    res.status(200).json({ status: 1, mssg: 'Successfully Status Upgraded Product!', update: update } );
  }catch(error) {
    console.log(error);
    res.status(401).json({status: -1, mssg: error.message});
  }
});

/* // Actualizar fase y estatus de algun producto en ENTREGA
router.put('/phaseproduct/:id', validateSession(), async (req, res, next) => {
  try{
    const updateDeliveryProduct = {
      status:req.body.status,
      phase:req.body.phase
    };
    let update = await Product.updateOne({_id : req.params.id} ,{ $set : updateDeliveryProduct});
    res.status(200).json({ status: 1, mssg: 'Successfully Phase Upgraded Product!', update: update } );
  }catch(error) {
    console.log(error);
    res.status(401).json({status: -1, mssg: error.message});
  }
}); */

// ACTUALIZAR a nuevo producto
router.put('/:id', validateSession(), fields, async (req, res, next) => {
  try{
    const getProductData = await Product.findById(req.params.id);
    const imgPath = getProductData.file.filePath;
    const imgs = getProductData.files;
    //console.log(imgPath);
    //console.log(imgs[0].filePath); /* Debuggear con TryCatch */
    /*
    if(imgs[3]){
      console.log("Si se puede leer.");
    } else{
      console.log("No se puede leer.");
    }
    */

    //Se relaciona el email con la bd de profile y encuentra la coincidencia
    //let sellerObject = await Profile.aggregate([{ $match: { email: req.body.email } }]);
    let filesArray = [];

    const updateProduct = {
      nameProduct:req.body.nameProduct, category:req.body.category,
      description:{ material:req.body.material, marca:req.body.marca, dimensions:req.body.dimensions, actualCondition:req.body.actualCondition, observations:req.body.observations },
      price:{ initialP:req.body.initialP, buyNow:req.body.buyNow, offered:req.body.offered },
      auctionDate:{ create:req.body.create, final:req.body.final, initialD:'' },
    };
    if (req.files['file'] && req.files['file'][0]) {
      const reqImg = req.files['file'][0];
      updateProduct.file = {
        fileName: reqImg.originalname,
        filePath: reqImg.path,
        fileType: reqImg.mimetype,
        fileSize: fileSizeFormatter(reqImg.size, 2) // 0.00
      };
      try {
        fs.unlinkSync(imgPath);
      } catch (error) {
        console.log(error.message);
      }
    }
    if(req.files['files']) {
      //console.log(req.files['files']);
      const reqImgs = req.files['files'];
      let i = 0;
      reqImgs.forEach(element => {
        const image = {
          fileName: element.originalname,
          filePath: element.path,
          fileType: element.mimetype,
          fileSize: fileSizeFormatter(element.size, 2)
        }
        if(image !== imgs[i]){
          //console.log("Si no es la misma imagen " + i + " anterior.");
          filesArray.push(image);
          try {
            fs.unlinkSync(imgs[i].filePath);
          } catch (error) {
            console.log(error.message);
          }
          i++;
          //console.log("Se cambio exitosamente la imagen " + i + ".");
          //console.log(image);
        } else {
          //console.log("Si si es la misma imagen " + i + " anterior.");
          filesArray.push(imgs[i]);
        }
      });
      // Para borrar las imagenes que faltaron
      let numFiles = reqImgs.length;
      //console.log(reqImgs.length);
      for (let n = numFiles; n < 5; n++) {
        //console.log("Posicion del array: " + n);
        if(imgs[n]){
          //console.log("Se borrara la imagen en la posicion " + n + " del array.") /* Imagen (n+1) del files */
          try {
            fs.unlinkSync(imgs[n].filePath);
            //console.log("Se borro exitosamente la imagen " + (n+1) + " (del producto antes de esta actualizacion).");
          } catch (error) {
            console.log(error.message);
          }
        }
      }
      
      updateProduct.files = filesArray;
      //console.log(filesArray);
    }
    
    await Product.findByIdAndUpdate(req.params.id, updateProduct);
    /* if(Product.findByIdAndUpdate(req.params.id, updateProduct)){
      console.log("Se puede actualizar correctamente.");
    } */
    res.status(201).send('Successfully Upgraded Product!');
  }catch(error) {
    console.log(error.message);
    res.status(400).json({status: -1, mssg: error.message});
  }
});

// ELIMINAR un producto
router.delete('/:id', validateSession(), async (req, res) => {
  try {
    const getProdData = await Product.findById(req.params.id);
    const imgPath = getProdData.file.filePath;
    const imgs = getProdData.files;
    
    await Product.findByIdAndRemove(req.params.id);
    try {
      fs.unlinkSync(imgPath);
    } catch (error) {
      console.log(error.message);
    }
    imgs.forEach(deleted => {
      try {
        fs.unlinkSync(deleted.filePath);
      } catch (error) {
        console.log(error.message);
      }
    });
    /* //Manera 2
    for (let n = 0; n < imgs.length; n++) {
      //console.log("Posicion: " + n);
      try {
        fs.unlinkSync(imgs[n].filePath);
      } catch (error) {
        console.log(error.message);
      }
    } */
    res.status(200).send('Product Deleted');
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

/* FIN 1.60 */
