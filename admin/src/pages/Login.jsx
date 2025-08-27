import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { DoctorContext } from '../context/DoctorContext'


const Login = () => {
  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('aToken');
    if (storedToken) {
      navigate('/admin'); 
    }
  }, [navigate]);

  const { setAToken, backendUrl } = useContext(AdminContext)
  const {setDToken} = useContext(DoctorContext )

  const onSubmitHandler = async (e) => {
  e.preventDefault();

  try {
    if (state === 'Admin') {
      const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password });
      console.log("Backend response:", data);

      if (data.success) {
        localStorage.setItem('aToken', data.aToken);
        setAToken(data.aToken);
        console.log('Token set:', data.aToken);
        toast.success("Admin login successful!");
        navigate('/admin-dashboard');
        
      } else {
        toast.error(data.message || "Invalid credentials");
      }

    } else if (state === 'Doctor') {
      const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password });

      if (data.success) {
        localStorage.setItem('dToken', data.token);
        setDToken(data.token)
        console.log(data.token)
        toast.success("Doctor login successful!");
        navigate('/doctor-dashboard');
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    }

  } catch (error) {
    console.error(error);
    toast.error("Something went wrong. Check console.");
  }
};


  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl gap-3 text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'>
          <span className='text-[#5f6FFF]'> {state} </span> Login
        </p>
        <div className='w-full'>
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className='border border-[#DADADA] rounded w-full p-2 mt-1'
            type='email'
            required
          />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className='border border-[#DADADA] rounded w-full p-2 mt-1'
            type='password'
            required
          />
        </div>
        <button className='bg-[#5F6FFF] text-white w-full py-2 rounded-md text-base'>Login</button>
        {state === 'Admin' ? (
          <p>
            Doctor Login?{' '}
            <span
              className='text-[#5F6FFF] underline cursor-pointer'
              onClick={() => setState('Doctor')}
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{' '}
            <span
              className='text-[#5F6FFF] underline cursor-pointer'
              onClick={() => setState('Admin')}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  )
}

export default Login
