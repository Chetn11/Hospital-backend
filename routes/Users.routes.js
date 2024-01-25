const express=require("express");
const {UserModel}=require("../models/userModel");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const userRouter=express.Router();


userRouter.post("/signup", async function(req,res){
    const{name,email,password,confirm_password}=req.body;

    const user_exist=await UserModel.findOne({email});
    if(user_exist){
        return res.json({message:"User Already exist"});
    }
    else{ 
    if(password!==confirm_password){
        return res.json({message:"Password does not match!"});
    }
    else{
        bcrypt.hash(password,8, async (err,hash)=>{
            await UserModel.create({name,email,password:hash});
            return res.json({message:"Signup Successful !"});
        })
    }
}
    
})

userRouter.post("/login", async function(req,res){
    const{email,password}=req.body;
    const user=await UserModel.findOne({email});

    const hashed_password=user.password;

    const key=process.env.key;
    try {
        bcrypt.compare(password,hashed_password,function(err,result){
            if(!result){
                return res.send({message:"Invalid Credentials"});
            }
            else{
                const token=jwt.sign({userId:user._id},key);
                res.json({message:"login successful",token:token})
            }
        })
    } catch (error) {
        console.log(error)
    }
    
})

module.exports={userRouter}