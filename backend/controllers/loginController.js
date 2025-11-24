import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const loginUser=async(req,res)=>{
    try{
const{email,password}=req.body;
const user= await User.findOne({email});
if(!user){
    return res.status(400).json({message:"email or password not found"});
}
const userPassword= await bcrypt.compare(password,user.password);
if(!userPassword){
   return res.status(400).json({message:"email or password not found" })
}
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
return res.status(200).json({
    message:"user login succesfully",
    token,
    name:user.name,
    userId:user._id,
    email:user.email
})
    }
    catch(error){
        return res.status(500).json({message:error.message});
    }

}


