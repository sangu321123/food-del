//api 
import foodModel from "../models/foodModel.js";
import fs from 'fs'//file system prebuilt in  node.js


//add food item
const addFood=async(req,res)=>{
  let image_filename=`${req.file.filename}`
  const food=new foodModel({
    name:req.body.name,
    description:req.body.description,
    price:req.body.price,
    category:req.body.category,
    image:image_filename
  })
  try{
    await food.save();
    res.json({success:true,message:"Food Added"})
  }catch(error){
    console.log(error)
    res.json({success:false,message:"Error"})
  }
}

//add food list
const listFood=async(req,res)=>{
  try{
    const foods=await foodModel.find({})//returns all documents in the collection
    res.json({success:true,data:foods})
  }catch(error){
    console.log(error)
    res.json({success:false,message:"Error"})
  }
}

//removeFood
const removeFood=async(req,res)=>{
  try{
    const food=await foodModel.findById(req.body.id)
    fs.unlink(`uploads/${food.image}`,()=>{})//callback added
    //food model's image prop has imagefilename 
    await foodModel.findByIdAndDelete(req.body.id)
    res.json({success:true,message:"Food removed"})
  }catch(error){
    console.log(error)
    res.json({success:false,message:"Error"})
  }
}


export {addFood,listFood,removeFood}