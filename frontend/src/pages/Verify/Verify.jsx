import React, { useContext ,useEffect} from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const Verify = () => {
  const [searchParams,setSearchParams]=useSearchParams()
  const success=searchParams.get("success")
  console.log(success)
  const orderId=searchParams.get("orderId")
  const {url}=useContext(StoreContext)
  const navigate=useNavigate()

  const verifyPayment=async(req,res)=>{
    const response=await axios.post(url+"/api/order/verify",{success,orderId})//we are getting from url and sending through req.body
    console.log(success)
    console.log(response.data.success)
    if (response.data.success){
      navigate("/myorders")
      console.log("success")
    }else{
      navigate("/")
      console.log("payment failed")
    }
  }

  useEffect(()=>{
    verifyPayment()
  },[])


  return (
    <div className='verify'>
      <div className='spinner'>

      </div>
      
    </div>
  )
}

export default Verify
