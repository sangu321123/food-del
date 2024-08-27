import mongoose from "mongoose";

export const connectDB=async()=>{
  mongoose.connect('mongodb+srv://greatstack:Jothi*123@cluster0.37fwm.mongodb.net/?retryWrites=true&w=majority&appName=food-del').then(console.log("DB Connected"))
}