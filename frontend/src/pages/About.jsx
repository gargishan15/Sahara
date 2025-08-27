import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

     <div className='text-center text-2xl pt-10 text-gray-500'>
      <p>ABOUT <span className='text-gray-700 font-medium '>US</span></p>
     </div>

     <div className='my-10 flex flex-col md:flex-row gap-12'>
      <img  className="w-full md:max-w-[360px] "src={assets.about_image} alt="" />
      <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
        <p>Welcome to Sahara Health, your reliable partner in delivering accessible and efficient healthcare solutions. At Sahara, we recognize the difficulties patients often face while booking doctor appointments, finding the right specialists, and keeping track of their medical history. Our platform is designed to simplify these challenges, ensuring that you can manage your healthcare needs with ease and confidence.</p>
        <p>Sahara Health is dedicated to innovation in medical technology. We continuously work to improve our platform by integrating advanced tools and user-friendly features that enhance patient experience. From booking consultations to managing prescriptions and follow-ups, Sahara ensures a smooth and secure process for every user.</p>
        <b className='text-gray-800'> Our Vision</b>
        <p>At Sahara Health is to transform the way patients connect with healthcare providers. We aspire to create a unified digital healthcare ecosystem where access to quality medical care is just a few clicks away. By bridging the gap between patients and doctors, Sahara empowers you to take charge of your health anytime, anywhere.</p>
      </div>
     </div>

    </div>
  )
}

export default About