const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const accessPrivateKey = '123';
const refreshPrivateKey = '321';

const signAccessToken = async(userId) => {
    try {

        userId = JSON.stringify(userId);
        
        const payload = {};
        const privateKey = accessPrivateKey;
        const options = {
            expiresIn: '1h',
            audience: userId
        }

        const accessToken = jwt.sign(payload, privateKey, options);
        return Promise.resolve(accessToken);

    } catch(err) { 
        return Promise.reject(err);
    }


}

const verifyAccessToken= async(req,res,next) =>{
    try{
        
        if( !req.headers['authorization'] ) {
            throw createError.Unauthorized('No authorization');
        }

        const accessToken = req.headers['authorization'].split(' ')[1];

        if( !accessToken ) {
            throw createError.Unauthorized('No accessToken');
        }

        const decode = await jwt.verify(accessToken, accessPrivateKey);

        if( !decode ) {
            throw createError.Unauthorized('Invalid accessToken');
        }

        req.body.userId = JSON.parse(decode.aud);
        next();

 } catch (error){

    if( error.name == 'JsonWenTokenError' || error.name == 'TokenExpiredError' )  {
        error = createError.Unauthorized(error.message);
    }
    res.status(error.status || 500).send({
        status: error.status || 500,
        message: error.message
    });
 }
}

const signRefreshToken = async(userId) => {
    try {

        userId = JSON.stringify(userId);
        
        const payload = {};
        const privateKey = refreshPrivateKey;
        const options = {
            expiresIn: '1d',
            audience: userId
        }
        const refreshToken = jwt.sign(payload, privateKey, options);
        return Promise.resolve(refreshToken);

    } catch(err) { 
        return Promise.reject(err);
    }

}

const verifyRefreshToken = async(refreshToken) =>{
    try{
        
        const decode= await jwt.verify(refreshToken, refreshPrivateKey);
        const userId= JSON.parse(decode.aud);
        return Promise.resolve(userId);  

    } catch (err){
    
      return Promise.reject(err);

    }
}
   

module.exports={
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken
}
