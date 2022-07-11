const express = require('express');
const router = express.Router();
const Points = require('../model/points');
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

router.get('/:id', validateSession(), async (req, res, next) => {
    try {
        let userPoints = await Points.aggregate([{$match: {user: req.params.id} }]);
        //console.log(userPoints);
        if(userPoints.length === 0){
            let insert = await Points.create({user: req.params.id, pts: 0});
            console.log(insert);
            res.json([{user: req.params.id, pts: 0}]);
        }else
            res.json(userPoints);
        
    } catch (e){
        console.log(e);
        res.json({status:-1, err: e.message})
    }
});

router.post('/addPoints', validateSession(), async (req, res, next) => {
    try {
        let userPoints = await Points.aggregate([{$match: {user: req.body.userId} }]);

        let updatePoints = await Points.updateOne({user: req.body.userId},{$set : {pts: (userPoints[0].pts + req.body.pts)} },{upsert: true});
        
        //console.log(userPoints);
        res.json({status: 1, resp: updatePoints, pts: (userPoints[0].pts + req.body.pts)});
        
    } catch (e){
        console.log(e);
        res.json({status:-1, err: e.message})
    }
})

module.exports = router;