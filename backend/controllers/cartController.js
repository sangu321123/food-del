import userModel from '../models/userModel.js'

//add to cart
const addToCart=async(req,res)=>{
  try{
    const userData=await userModel.findById({_id:req.body.userId})
    const cartData=userData.cartData
    if (!cartData[req.body.itemId]){
      cartData[req.body.itemId]=1
    }else{
      cartData[req.body.itemId]+=1
    }
    await userModel.findByIdAndUpdate(req.body.userId,{cartData})//when u use the same name of field as variable then no need to explicitly mention cartData:cartData
    res.json({success:true,message:"Added to Cart"})

  }catch(error){
    
    console.log(error)
    res.json({success:false,message:"add to cart Error"})
  }
}

//remove from cart
const removeFromCart=async(req,res)=>{
  try{
    const userData=await userModel.findById({_id:req.body.userId})
    const cartData=userData.cartData
    if(cartData[req.body.itemId]>0){
      cartData[req.body.itemId]-=1
    }
    await userModel.findByIdAndUpdate(req.body.userId,{cartData})
    res.json({success:true,message:"Removed from Cart"})


  }catch(error){
    console.log(error)
    res.json({success:false,message:"Error"})
  }
}

//fetch user cart data
const getCart=async(req,res)=>{
  try{
    const userData=await userModel.findById({_id:req.body.userId})
    const cartData=userData.cartData
    res.json({success:true,cartData})

  }catch(error){
    console.log(error)
    res.json({success:false,message:"Error"})
  }

}

export {addToCart,removeFromCart,getCart}