const jwt = require('jsonwebtoken')
const result=require('./result')
const config=require('./config')

function authorizeUser(req,res,next){
    // const url=req.url
    // if(url == '/user/signin' || url=='/user/signup'){
    //     console.log("hiii")
    //     return next()
    // }
    if (req.path.startsWith("/uploads")) {
    return next();
  }
    const publicPaths = ['/user/signin', '/user/signup'];
    if (publicPaths.includes(req.path)) return next();
    const authHeader =req.headers.authorization
    console.log('authHeader',req.headers  )
    if(!authHeader){
        return res.send(result.createResult('Token is missing'));
    }
    const token = authHeader.split(' ')[1];

  if (!token) {
    return res.send(result.createResult('Invalid token format'));
  }

  try {
    const payload = jwt.verify(token, config.Secret);
    req.user_id = payload.user_id;
    console.log("req.userId:::",req.user_id)
    next();
  } catch (ex) {
    return res.send(result.createResult('Invalid token'));
  }
}

module.exports = authorizeUser;