const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function(req,res,next) {
    const token = req.headers.authorization;
    if(!token){
        res.status(400).send("No Token Not Authorized!")
    }
    try{
        const verifyToken = token.split(" ")[1];
        const user = jwt.verify(verifyToken,process.env.JWTSECRET)
        if(user.role != "User"){
            return res.status(200).send("No user.. No Authorized")
        }
        req.user = user._id;
        next();
    } catch (err) {
        res.status(400).send("Invalid Token")
    }
}