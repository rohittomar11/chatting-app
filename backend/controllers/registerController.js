import User from "../models/User.js";
import bcrypt from "bcrypt";
export const registerUser=async(req,res)=>{
    try{
 const{email,name,password}=req.body;
 const existEmail= await User.findOne({email});
 if(existEmail){
   return res.status(400).json({message:"user already exists"});
 }
 else{
    const hashPassword= await bcrypt.hash(password,10);
    const newUser=await User.create({
        name,
        email,
        password:hashPassword,
    })
   
    return res.status(200).json({message:"user register successfully",userid:newUser._id})
 }
}
catch(error){
 return res.status(400).json({ message:error.message});
}
}