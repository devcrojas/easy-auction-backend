const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const Points = require('../model/points');
const Product = require('../model/product');



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

// Offer Model
const Offer = require('../model/offer');

// OBTENER UNA SOLA oferta
router.get('/:id', async (req, res) => {
  try {
    const getOffer = await Offer.findById(req.params.id).populate([
      { path: 'profile', model: 'Profile' },
      { path: 'product', model: 'Product' }
    ]);
    res.status(200).send(getOffer);
  } catch (error) {
    res.status(400).json({ status: -1, mssg: error.message });
  }
});

// OBTENER TODAS las ofertas
router.get('/', async (req, res) => {
  try {
    const getReviews = await Offer.find().populate([
      { path: 'profile', model: 'Profile' },
      { path: 'product', model: 'Product' }
    ]);
    res.status(200).send(getReviews);
  } catch (error) {
    res.status(400).json({ status: -1, mssg: error.message });
  }
});

// AGREGAR oferta
router.post('/apply', validateSession(), async (req, res) => {
  //console.log(req.body);
  try {
    /*/const offer = {
      offer:req.body.offer,
      profile:req.body.profile
    };
  
    const addOffer = new Offer(offer);
    await addOffer.save();/*/
    let userPoints = await Points.aggregate([{ $match: { user: req.user.id } }]);
    let productId = req.body.product._id;
    let offered = req.body.offered;
    let productUpdate = await Product.findById(productId);
    //Valida si tiene saldo suficiente...
    if (offered <= userPoints[0].pts) {
      console.log("Saldo Suficiente");
      //Valida que elproducto no tenga actividad de otro usuario para evitar errores.
      if (typeof productUpdate.offerActivity === "undefined" || productUpdate.offerActivity === false) {
        //Preparando para update
        delete productUpdate._id;
        //Se modifica la actividad a true para evitar que otros usuarios intenten ofertar.
        productUpdate.offerActivity = true;
        let upd = await Product.updateOne({ _id: productId }, { $set: { offerActivity: true } });
        console.log("Bloqueando producto");
        console.log(upd);

        //agregar offered a producto.
        if (typeof req.body.product.price.offered === "undefined" || req.body.product.price.offered < offered) {
          let log = { date: new Date(), offered: offered, user: req.user.id };
          let logPoints = { date: new Date(), decrement: offered, user: req.user.id, beforeDecrement: userPoints[0].pts, afterDecrement: (userPoints[0].pts-offered) };
          productUpdate.price.offered = offered;
          //let updOffered = await Product.updateOne({ _id: productId }, { $set: { "price.offered": offered } });
          //Agregar log de offered a producto.
          productUpdate.price.logOffered = log;
          //let updLogOffered = await Product.updateOne({ _id: productId }, { $set: { "price.logOffered": log } });
          //Restar puntos y agregar log de decremento y actualizar BD
          userPoints[0].pts -= offered;
          userPoints[0].logsDecrement.push(logPoints);
          let updDecrement = await Points.updateOne({_id: userPoints[0]._id}, {$set: userPoints[0]});
          //Desbloqueando producto
          productUpdate.offerActivity = false;
          let upd = await Product.updateOne({ _id: productId }, { $set: productUpdate});
           //Primer funcion
          res.status(201).json({ status: 1, mssg: "La oferta se colocó exitosamente.", points: userPoints[0], product:productUpdate  });
        } else {
          res.status(201).json({ status: -1, mssg: "Tu oferta es menor a la última oferta del producto." });
        }
      } else {
        //No permite el cambio
        console.log("Se esta ejecutando un cambio...");
        res.status(201).json({ status: -1, mssg: "Hay alguien mas ofertando intenta mas tarde.." });

      }
    } else {
      console.log("Saldo Insuficiente");
      res.status(201).json({ status: -1, mssg: "Saldo Insuficiente." });
    }
    //console.log(userPoints);
    //console.log(productUpdate.offerActivity);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: -1, mssg: error.message });
  }
});

// ACTUALIZAR una nueva oferta
router.put('/:id', async (req, res) => {
  try {
    const updateOffer = {
      offer: req.body.offer,
      profile: req.body.profile
    };
    await Offer.findByIdAndUpdate(req.params.id, updateOffer);
    res.status(201).send('Successfully Upgraded Offer!');
    /* if (Product.findByIdAndUpdate(req.params.id, newProduct) == true)
      res.json({status: 1, mssg: 'Product Updated'});
    else (Product.findByIdAndUpdate(req.params.id, newProduct) == false)
      res.json({status: -1, mssg: 'Product Not Updated'}); */
  } catch (error) {
    res.status(400).json({ status: -1, mssg: error.message });
  }
});

// ELIMINAR oferta
router.delete('/:id', async (req, res) => {
  try {
    await Offer.findByIdAndRemove(req.params.id);
    res.status(200).send('Offer Deleted');
    /* if (Product.findByIdAndRemove(req.params.id) == true)
      res.json({status: 1, mssg: 'Product Deleted'});
    else (Product.findByIdAndRemove(req.params.id) == false)
      res.json({status: -1, mssg: 'Product Not Deleted'}); */
  } catch (error) {
    res.status(400).json({ status: -1, mssg: error.message });
  }
});

module.exports = router;
/* FIN 1.2 */