const express = require('express');
const router = express.Router();
const Points = require('../model/points');

router.put('/points/:id', async (req, res, next) => {
    try {
        let userPoints = await Points.aggregate([{$match: {user: req.body.user} }]);
        userPoints[0].pts = userPoints[0].pts + req.body.points;
        const upDatePoints = {
            pts: userPoints.pts
        }
        
    } catch {

    }
})