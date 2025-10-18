const jwt = require("jsonwebtoken");
const {User} = require("../models/user.model")


const protect = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){

        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.DHA_CONNECT_JWT_SECRET);
            const user = await User.findById(decoded._id).select("-password");

            if(!user){
                return res.status(404).json({success: false, message: "Authentication Failed"});
            }
            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({success: false, message: "Token Failed. Login Again"});
        }
    }else{
            return res.status(401).json({success: false, message: "No Token Available. Please Login"})
    }
}

module.exports = {
    protect
}