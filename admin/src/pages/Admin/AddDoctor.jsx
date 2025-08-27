import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import {toast}  from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {
  const [docImage, setDocImage] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState(' 1 Year')
  const [fees, setFees] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [about, setAbout] = useState('')
  

  const handleFileChange = (e) => {
    setDocImage(e.target.files[0])
  }

  const {backendUrl, aToken} = useContext(AdminContext) 

  const onsubmitHandler = async (e) => {
    e.preventDefault()

    try{
      if(!docImage){
        return toast.error('Please upload a doctor image')
      }
     const formData = new FormData()

     formData.append('image', docImage)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)     
      formData.append('experience', experience)
      formData.append('fees', Number(fees))  
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({line1: address1, line2: address2}))
      formData.append('about', about)

      formData.forEach((value,key)=>{
        console.log(`${key} : ${value}`)
        })

        const {data} = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, { headers: { aToken } })


      if(data.success){
        toast.success(data.message)
        setDocImage(false)
        setName('')           
        setEmail('')
        setPassword('')
        setAbout('')  
        setFees('')
        setDegree('')
        setAddress1('')
        setAddress2('')
      } else {
        toast.error(data.message)
        
      }

    } catch(err) {
      toast.error('Something went wrong, please try again later');
      console.error(err);
    }
  }

  return (
    <form onSubmit={onsubmitHandler} className='m-5 w-full'>
      <p className='mb-3 text-lg font-medium'>Add Doctor</p>

      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
        
        
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor="doc-img">
            <img
              className='w-16 h-16 object-cover bg-gray-100 rounded-full cursor-pointer'
              src={docImage ? URL.createObjectURL(docImage) : assets.upload_area}
              alt="Doctor Upload"
            />
          </label>
          <input  type="file" id='doc-img' hidden onChange={handleFileChange} />
          <p>Upload Doctor <br />Picture</p>
        </div>

        <div className='flex flex-col lg:flex-row flex-wrap items-start gap-10 text-gray-600'>

          <div className='w-full lg:flex-1 flex flex-col gap-1'>
            <p>Doctor Name</p>
            <input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder='Name' required className='border rounded px-3 py-2 outline-none' />
          </div>

          <div className='w-full lg:flex-1 flex flex-col gap-1'>
            <p>Doctor Email</p>
            <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder='Email' required className='border rounded px-3 py-2 outline-none' />
          </div>

          <div className='w-full lg:flex-1 flex flex-col gap-1'>
            <p>Doctor Password</p>
            <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder='Password' required className='border rounded px-3 py-2 outline-none' />
          </div>

          <div className='w-full lg:flex-1 flex flex-col gap-1'>
            <p>Experience</p>
            <select onChange={(e)=>setExperience(e.target.value)} value={experience} className='border rounded px-3 py-2 outline-none'>
              {[...Array(10)].map((_, i) => (
                <option key={i} value={`${i + 1} Year`}>{i + 1} Year</option>
              ))}
            </select>
          </div>

          <div className='w-full lg:flex-1 flex flex-col gap-1'>
            <p>Fees</p>
            <input onChange={(e)=>setFees(e.target.value)} value={fees} type="number" placeholder='Fees' required className='border rounded px-3 py-2 outline-none' />
          </div>

          <div className='w-full lg:flex-1 flex flex-col gap-1'>
            <p>Speciality</p>
            <select onChange={(e)=>setSpeciality(e.target.value)} value={speciality} className='border rounded px-3 py-2 outline-none'>
              <option value="General physician">General physician</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatricians">Pediatricians</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
            </select>
          </div>

          <div className='w-full lg:flex-1 flex flex-col gap-1'>
            <p>Education</p>
            <input onChange={(e)=>setDegree(e.target.value)} value={degree} type="text" placeholder='Education' required className='border rounded px-3 py-2 outline-none' />
          </div>

          <div className='w-full lg:flex-1 flex flex-col gap-1'>
            <p>Address</p>
            <input onChange={(e)=>setAddress1(e.target.value)} value={address1} type="text" placeholder='Address 1' required className='border rounded px-3 py-2 outline-none mb-2' />
            <input onChange={(e)=>setAddress2(e.target.value)} value={address2} type="text" placeholder='Address 2' required className='border rounded px-3 py-2 outline-none' />
          </div>

          <div className='w-full flex flex-col gap-1'>
            <p>About</p>
            <textarea onChange={(e)=>setAbout(e.target.value)} value={about} placeholder='Write about Doctor' rows={5} required className='border rounded px-3 py-2 outline-none'></textarea>
          </div>

          <div className='w-full'>
            <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
              Add Doctor
            </button>
          </div>

        </div>
      </div>
    </form>
  )
}

export default AddDoctor
