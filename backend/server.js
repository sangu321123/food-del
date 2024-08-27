//basic express server
//module type server(mentioned in package.json also ) es6
import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"

//app config//initializing app
const app=express()
const port=4000

//middleware
app.use(express.json())//request passed from frontend to backend
app.use(cors())//access backend from any frontend

//db connection
connectDB();

//api endpoints
app.use("/api/food",foodRouter)
app.use('/images',express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)//this alone needs authenitaction
app.use("/api/order",orderRouter)

//get-http method request data from server
app.get("/",(req,res)=>{
  res.send("API Working")
})

//to run express server
app.listen(port,()=>{
  console.log(`Server started on http://localhost:${port}`)
})
