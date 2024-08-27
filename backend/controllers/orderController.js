import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import Stripe from "stripe"
import "dotenv/config"

const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)


//to place order from frontend
const placeOrder=async(req,res)=>{
  const frontendUrl="http://localhost:5173"
  try{
    const  newOrder=new orderModel({
      userId:req.body.userId,
      items:req.body.items,
      amount:req.body.amount,
      address:req.body.address
    })

    await newOrder.save()
    //to clear user's cart
    await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}})

    //necessary for stripe payment
    const line_items=req.body.items.map((item)=>({
      price_data:{
        currency:"usd",
        product_data:{
          name:item.name
        },
        unit_amount:item.price*100//in stripe u have to mention the amount in smallest unit of currency(1usd=100cents)
      },
      quantity:item.quantity
    }))
    line_items.push({
      price_data:{
        currency:"usd",
        product_data:{
          name:"Delivery Charges"
        },
        unit_amount:2*100
      },
      quantity:1
    })

    //session creation
    const session= await stripe.checkout.sessions.create({
      line_items:line_items,
      mode:'payment',
      success_url:`${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url:`${frontendUrl}/verify?success=false&orderId=${newOrder._id}`
    })
    res.json({success:true,session_url:session.url})

  }catch(error){
    console.log(error)
    res.json({success:false,message:error})
  }

}

const verifyOrder=async(req,res)=>{
  const {orderId,success}=req.body //remember that url dood
  try{
    if (success==="true"){
      await orderModel.findByIdAndUpdate(orderId,{payment:true})
      res.json({success:true,message:"Paid"})
    }else{
      await orderModel.findByIdAndDelete(orderId)
      res.json({success:false,message:"Not Paid"})
    }

  }catch(error){
    console.log(error)
    res.json({success:false,message:"Error"})
  }

}

//to display userOrders in front end
const userOrders=async(req,res)=>{
  try{
    const orders=await orderModel.find({userId:req.body.userId})
    
    res.json({success:true,data:orders,id:req.body.userId})

  }catch(error){
    console.log(error)
    res.json({success:false,message:"Error"})
  }
}
//listing orders for admin panel
const listOrders=async(req,res)=>{
  try{
    const orders=await orderModel.find({})//fetches all
    res.json({success:true,data:orders})
  }catch(error){
    console.log(error)
    res.json({success:false,message:"Error"})
  }
}
//api for updating order status
const updateStatus=async(req,res)=>{
  try{
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
    res.json({success:true,message:"Status Updated"})
  }catch(error){
    console.log(error)
    res.json({success:false,message:"Error"})
  }
}


export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}