const jwt=require("jsonwebtoken");
require("dotenv").config();

const auth=(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1];

    if(!token)
    {
        return res.json({message:"Login First"});
    }

    const key=process.env.key;

    jwt.verify(token,key, function(err,decoded){
        if(err){
            return res.json({message:"Please Login First"})
        }
        const userId=decoded.userId;
        req.userId=userId;
        next();
    })
}

module.exports={auth};