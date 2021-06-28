var express = require('express');
const createError = require('http-errors');
const {
  signAccessToken,
  verifyAccessToken, 
  signRefreshToken, 
  verifyRefreshToken } = require('../helpers/jwt.helper');
const User = require('../models/user.model');
  
var router = express.Router();

router.post('/register', async (req, res) => {
  try{

    let userBody= req.body;
    const hasUser= await User.findOne({ email: userBody.email});

    if( hasUser){
      throw createError.Conflict('This email already exists!');
    }

    const newUser = new User({
      name: userBody.name,
      email:userBody.email,
      password: userBody.password,
      tickets: []
    });

    const savedUser = await newUser.save();
    const accessToken = await signAccessToken(savedUser._id);
    const refreshToken = await signRefreshToken(savedUser._id);
    res.send({
      accessToken,
      refreshToken,
      user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email
      }
    });

  } catch(err) {

    res.status(err.status || 500).send({
      status:err.status || 500,
      message: err.message
    });

  }
});

router.post('/login', async (req, res) => {
    try{

      let userBody= req.body;
      const hasUser= await User.findOne({ email: userBody.email, password: userBody.password });

      if( !hasUser){
        throw createError.badRequest('Wrong email or password');

      }

      const accessToken = await signAccessToken(hasUser._id);
      const refreshToken = await signRefreshToken(hasUser._id);
      res.send({
        accessToken,
        refreshToken,
        user: {
            id: hasUser._id,
            name: hasUser.name,
            email: hasUser.email
        }
      });
     
    } catch(err) {

      res.status(err.status || 500).send({
        status:err.status || 500,
        message: err.message
      });

    }
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/refreshToken', async(req, res) =>{
  try{

    const oldRefreshToken = req.body.refreshToken;
    if( !oldRefreshToken){
      throw createHttpError.Forbidden('No refreshToken');
    }

    const userId = await verifyRefreshToken(oldRefreshToken);

    const accessToken = await signAccessToken(userId);
    const refreshToken = await signRefreshToken(userId);

    res.send({accessToken, refreshToken });

  } catch(err){

    console.log(err);
    err = createError.Forbidden('Invalid refreshToken');
   
    res.status(err.status ||500).send({
      status:err.status || 500,
      message: err.message
    });

  }
});


router.get('/me', verifyAccessToken, async(req,res) => {
  try{

    const userId = req.body.userId;
    const userInfo= await userId.findOne({ _id: userId }).select("name email");
    if( !userInfo){
      throw createError.NotFound('No user found!');
    }

    res.send(userInfo);

  } catch(err){

    console.log(err);
    err=createError.Forbidden('Invalid refreshment');
   
    res.status(err.status ||500).send({
      status:err.status || 500,
      message: err.message
    });

  }
});

module.exports = router;
