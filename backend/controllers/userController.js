import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"//to create authentication
import bcrypt from "bcrypt"
import validator from "validator"
import 'dotenv/config'

const createToken=(id)=>{
  return jwt.sign({id},process.env.JWT_SECRET)
}

//login user
const loginUser=async(req,res)=>{
  const {email,password}=req.body
  try{
    const user=await userModel.findOne({email})
    if (!user){
      return res.json({success:false,message:"User doesn't exist"})
    }

    const match=await bcrypt.compare(password,user.password)
    if (!match){
      return res.json({success:false,message:"Invalid creddentials"})
    }
    const token=createToken(user._id)
    res.json({success:true,token})

  }catch(error){
    console.log(error)
    res.json({succes:false,message:"Error"})
  }

}



//register user
const registerUser=async(req,res)=>{
  //checking if user already exists
  const {name,email,password}=req.body
  try{
    const exists= await userModel.findOne({email})
    if (exists){
      //include return to stop the process there itself
      return res.json({success:false,message:"User already exists"})
    }

    //validating email forma
    if (!validator.isEmail(email)){
      return res.json({success:false,message:"Please enter a valid email"})

    }
    //validating a strong password
    if (password.length<8){
      return res.json({success:false,message:"Please enter a strong password"})
    }

    //hashing user password
    const salt=await bcrypt.genSalt(10)//5-15(15 takes more time)
    const hashedPassword=await bcrypt.hash(password,salt)

    const newUser=new userModel({
      name:name,
      email:email,
      password:hashedPassword,

    })
    const user=await newUser.save();
    const token=createToken(user._id);
    return res.json({success:true,token})
  }catch(error){
    console.log(error)
    res.json({success:false,message:"Error"})
  }
}

export {loginUser , registerUser}

