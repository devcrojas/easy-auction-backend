var express = require('express');
var router = express.Router();
const Login = require('../model/login');
const ResetPassword = require('../model/resetPassword.js');
const jwt = require('jsonwebtoken');


/* GET users listing. */
router.post('/resetPassword/getUserById', async function(req, res, next) {
    try {
        console.log(req.body);
        if (req.body.correoSend !== "") {
          //Validar a la base de datos el usuario y la contraseña
          let user = await Login.aggregate([{ $match: { email: req.body.correoSend} }]);
          if (user.length > 0) {
            //console.log(login);
            delete user[0].password;
            let dateStart = new Date();
            const token = jwt.sign({
                name: user[0].name,
                id: user[0]._id,
                date: dateStart,
                email: user[0].email
              }, process.env.TOKEN_SECRET);

              //Insert BD Token.
              let deleteTokensBefore = await ResetPassword.deleteMany({userId:  user[0]._id});
              let ResetP= await ResetPassword.create({userId: user[0]._id, timestamp: dateStart, JWToken: token});
              //console.log(ResetP);
              res.header('auth-token', token).json({
                error: null,
                data: { token },
                status: 1,
                date: dateStart,
                user
              });
          } else
            res.json({ status: -1, mssg: "Usuario incorrecto!" });
        } else {
          res.json({ status: -1, mssg: "Usuario incorrecto!" });
        }
      } catch (e) {
        console.log(e.message);
        res.json({ status: -1, mssg: "Error - Revisar Log" });
      }
});

/* GET users listing. */
router.post('/resetPassword/validateJWToken', async function(req, res, next) {
  try {
      if (typeof req.body.JWToken !== "undefined") {
          //console.log(req.body);
          let searchToken = await ResetPassword.find({JWToken: req.body.JWToken});
          if(searchToken.length > 0){
            res.json({status: 1, token: searchToken[0]});
          }else{
            res.json({status: -1, mssg: "Token inexistente!"})
          }
      } else {
        res.json({ status: -1, mssg: "No se envió Token!" });
      }
    } catch (e) {
      console.log(e.message);
      res.json({ status: -1, mssg: "Error - Revisar Log" });
    }
});

/* GET users listing. */
router.post('/resetPassword/Apply', async function(req, res, next) {
  try {
      if (typeof req.body.JWToken !== "undefined") {
          //console.log(req.body);
          let searchToken = await ResetPassword.find({JWToken: req.body.JWToken});
          if(searchToken.length > 0){
            
            if(new Date(req.body.date).getTime() == new Date(searchToken[0].timestamp).getTime()){
              if(req.body.id === searchToken[0].userId){
                let updateApply = await Login.findOneAndUpdate({_id: req.body.id}, {password: req.body.password}, {
                  returnOriginal: false
                });
                if(updateApply){
                  let deleteToken = await ResetPassword.deleteOne({JWToken: req.body.JWToken});
                  if(deleteToken)
                    res.json({status: 1, mssg: "Cambio de conttraseña exitoso!"});
                  else
                    res.json({status: -1, mssg: "Error al eliminar el token en la BD"})
                }else{
                  res.json({status: -1, mssg: "Error al modificar la BD"})
                }
              }else{
                res.json({status: -1, mssg: "Usuario Alterado!"})
              }
            }else{
              res.json({status: -1, mssg: "Fecha Alterada!"})
            }
          }else{
            res.json({status: -1, mssg: "Token inexistente!"})
          }
      } else {
        res.json({ status: -1, mssg: "No se envió Token!" });
      }
    } catch (e) {
      console.log(e.message);
      res.json({ status: -1, mssg: "Error - Revisar Log" });
    }
});
module.exports = router;
