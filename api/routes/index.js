var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectID;
const { verifyAccessToken } = require('../helpers/jwt.helper');

const User = require('../models/user.model');


router.get('/tickets', verifyAccessToken, async (req, res, next) => {
  try {
    
    const userId = req.body.userId;

    const userData = await User.findOne({ _id: userId });
    res.send(userData.tickets);

  } catch (error) {
    res.status(error.status || 500).send({
      status:error.status || 500,
      message: error.message
    });
  }
});



router.post('/tickets', verifyAccessToken, async (req, res, next) => {

  try {
    const { date, name, email, userId } = req.body;
  
    if (!date || !name || !email) {
      return res.status(400).json({
        message: 'Journey date, Name and email are required',
      });
    } else {
      let userTickets = await User.findOne({ _id: userId });
      userTickets.tickets.push({
        name: name,
        email: email,
        date: date
      });

      userTickets = await userTickets.save();
      res.send(userTickets);
    }

  } catch (error) {
    
    res.status(error.status || 500).send({
      status:error.status || 500,
      message: error.message
    });

  }

});

// const payload = { date, name, email, userId };
// req.collection.insertOne(payload)
//   .then(result => res.json(result.ops[0]))
//   .catch(error => res.status(400).json({ 
//     message: 'No tickets available on this date' 
//   }));
// });


router.delete('/tickets/:id', verifyAccessToken, async (req, res, next) => {
  try {
    const userId  = req.body.userId;
    const ticketId = req.params.id;
    
    let userTickets = await User.findOne({ _id: userId });
    userTickets.tickets = userTickets.tickets.filter( obj => obj._id != ticketId );

    userTickets = await userTickets.save();
    res.send(userTickets.tickets);
    
  } catch (error) {
    
    res.status(error.status || 500).send({
      status:error.status || 500,
      message: error.message
    });

  }
});

module.exports = router;