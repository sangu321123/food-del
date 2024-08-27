import React, { useEffect, useState } from 'react'
import './Add.css'
import {assets} from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
const Add = ({url}) => {
  
  const [image,setImage]=useState(false);
  //refer this concept in youtube for multiple inputs in form we can't be creating useState for each field 
  const [data,setData]=useState({
    name:"",
    description:"",
    price:"",
    category:"Salad"
    
  })
  const onChangeHandler=(e)=>{
    const name=e.target.name//name is set using name attribute in input tag
    const value=e.target.value//value keeps on changing in input tags for each event//this value has been set to default initially
    setData((data)=>({...data,[name]:value}))
  }
  /*//to check
  useEffect(()=>{
    console.log(data)
  },[data])//called everytime the dependency array value changes*/

  const onSubmitHandler=async (event)=>{
    event.preventDefault();//to prevent page refreshing on submission
    const formData=new FormData()
    formData.append("name",data.name)
    formData.append("description",data.description)
    formData.append("price",data.price)
    formData.append("category",data.category)
    formData.append("image",image)
    //to make api calls to the endpoints
    const response=await axios.post(`${url}/api/food/add`,formData)
    if (response.data.success){
      //reset form
      setData({
        name:"",
        description:"",
        price:"",
        category:"Salad"
        
      })
      setImage(false)
      toast.success(response.data.message)
    }else{
      toast.error(response.data.message)
    }

  }

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image? URL.createObjectURL(image) :assets.upload_area} alt="" />
          </label>
          <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" hidden required />
        </div>
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input onChange={onChangeHandler} type="text" name='name' value={data.name} placeholder='Type here' />
        </div>
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea onChange={onChangeHandler} value={data.description}   name="description" rows="6" placeholder='Write content here'></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select onChange={onChangeHandler} value={data.category}  name="category" >
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product price</p>
            <input onChange={onChangeHandler} value={data.price} type="number"  name='price' placeholder='$20'/>
          </div>
        </div>
        <button type='submit' className='add-btn'>ADD</button>
      </form>
      
      
    </div>
  )
}


export default Add
