var express = require('express');
var router = express.Router();
const Login = require('../model/login');
const Profile = require('../model/profile')
const jwt = require('jsonwebtoken');

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
/* register */
router.post('/user/register', function (req, res, next) {
  //.......Algoritmo
  //res.send("Respuesta del algorimo")
  let insert = { _id: req.body.email, name: req.body.name, firstName: req.body.firstname, email: req.body.email, password: req.body.password, isAdmin: false }
  var model = new Login(insert);
  model.save(function (err) {
    if (err) return console.log(err);
  });
  //alert("Usuario registrado")
  res.send(insert);
});
/*  */

/* GET home page. */
/*/router.get('/', function (req, res, next) {
  //.......Algoritmo
  //res.send("Respuesta del algorimo")
  res.render('index');
});/*/


router.post("/login", async function (req, res, next) {
  try {
    console.log(req.body);
    if (req.body.email !== "" && req.body.pass !== "") {
      //Validar a la base de datos el usuario y la contraseña
      let login = await Login.aggregate([{ $match: { email: req.body.email, password: req.body.pass } }]);
      /*/if (req.body.user == "crojas" && req.body.pass == "26394")
        res.json({ status: 1, mssg: "Login Exitoso!" });
      else
        res.json({ status: -1, mssg: "Login Fallido!" });/*/

      if (login.length > 0) {
        let profile = await Profile.aggregate([{ $match: { _id: req.body.email } }]);
        console.log("consulta de perfil", profile);
        //console.log(login);

        // create token
        const token = jwt.sign({
          name: login[0].name,
          id: login[0]._id,
          date: new Date(),
          profile: profile[0],
          isAdmin: login[0].isAdmin
        }, process.env.TOKEN_SECRET)

        res.header('auth-token', token).json({
          error: null,
          data: { token }
        });
      } else
        res.json({ status: -1, mssg: "Login Fallido!" });
    } else {
      res.json({ status: -1, mssg: "Login Fallido!" });
    }
  } catch (e) {
    console.log(e.message);
    res.json({ status: -1, mssg: "Error - Revisar Log" });
  }


});

router.post("/getUserByEmail", async function (req, res, next) {
  try {
    console.log(req.body);
    if (req.body.correoSend !== "") {
      //Validar a la base de datos el usuario y la contraseña
      let user = await Login.aggregate([{ $match: { email: req.body.correoSend} }]);
      // console.log(login);
      /*/if (req.body.user == "crojas" && req.body.pass == "26394")
        res.json({ status: 1, mssg: "Login Exitoso!" });
      else
        res.json({ status: -1, mssg: "Login Fallido!" });/*/

      if (user.length > 0) {
        //console.log(login);
        delete user[0].password;
        res.json({status: 1, user});
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


router.get('/books', validateSession(), (req, res) => {
  res.json({ author: "1" });
});

module
  .exports = router;
