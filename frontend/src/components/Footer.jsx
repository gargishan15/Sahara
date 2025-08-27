import React from 'react'
import { assets } from '../assets/assets'
import logo from '../assets/logo3.png'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

          <div>
             <img className='mb-5 w-72 h-35'  src={logo} alt="" />
             <p className='w-full md:w-2/3 text-gray-600 leading-6'> We are committed to delivering quality healthcare by connecting you with experienced and trusted doctors. Book appointments easily and manage your health with convenience from anywhere.</p>
          </div>

          <div>
             <p className='text-xl font-medium mb-5'> COMPANY</p>
             <ul className='flex flex-col gap-2 text-gray-600'>
                <li>Home</li>
                <li>About Us</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
             </ul>
          </div>

          <div>
              <p className='text-xl font-medium mb-5'>GET IN TOUCH</p> 
              <ul className='flex flex-col gap-2 text-gray-600'>
                <li>+91 97608 XXXXX </li>
                <li>sahara@gmail.com</li>
              </ul>
          </div>

        </div>
        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2025@ Sahara - All Rights Reserved.</p>
        </div>
    </div>
  )
}

export default Footer