import React from 'react'
import Head from 'next/head';
import Link from 'next/link'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


import {
  Card,
  CardBody,
  CardFooter,
  Checkbox,
} from "@material-tailwind/react";
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { FaFacebookF } from 'react-icons/fa';


function Login() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  

  const submit = async (e) => {
    e.preventDefault()
    
    // fetch the data from form to makes a file in local system
    const data = { email, password };

    let res = await fetch(`/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    let response = await res.json()

    if (response.success === true) {
      toast.success(response.message , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });

      if(response.businessName){
        localStorage.setItem('myUser', JSON.stringify({token: response.token, email: response.email, businessName:response.businessName, department:response.department, role: response.role}))
      }
      else{
        localStorage.setItem('myUser', JSON.stringify({token: response.token, email: response.email, name: response.name, department:response.department }))
      }
      setTimeout(() => {
        router.push(`/panel`);
      }, 1500);
    }
    else{
      toast.error(response.message , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
    }
  }

  const handleChange = (e) => {
    if (e.target.name === 'email') {
      setEmail(e.target.value)
    }
    else if (e.target.name === 'password') {
      setPassword(e.target.value)
    }
  }


return (
  <>
    <Head>
      <title>Login_EjaratPro</title>
      <meta name="description" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
    </Head>
    {/* React tostify */}
    <ToastContainer position="bottom-center" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable theme="light" />

    <div className='my-20'>
      <div className='flex justify-center'>
        <Card className="w-9/12">

          <div className='flex'>

            <div className='w-full pt-10'>
              <h1 className='text-black text-center font-bold'>Sign In</h1>          
              <div className="flex justify-center space-x-3 pt-3 mx-3">

                <button>
                  <BsGoogle className='text-5xl cursor-pointer p-[7px] border border-gray-600 rounded-full transition duration-200 shadow-sm hover:shadow-md '/>
                </button>
                <button>
                  <BsGithub className='text-5xl cursor-pointer p-[7px] border border-gray-600 rounded-full transition duration-200 shadow-sm hover:shadow-md '/>
                </button>
                <button>
                  <FaFacebookF className='text-5xl cursor-pointer p-[7px] border border-gray-600 rounded-full transition duration-200 shadow-sm hover:shadow-md '/>
                </button>
              </div>

              <CardBody className="flex flex-col gap-3 pt-7">

                <input onChange={handleChange} value={email} name="email" id='email' type="email" placeholder='abc@example.com' className="bg-gray-100 bg-opacity-50 resize-none text-gray-700 outline-none border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 rounded-lg px-3 py-2 text-sm w-full transition-colors duration-200 ease-in-out" />
                <input onChange={handleChange} value={password} name="password" id='password' type="password" placeholder='############' className="mt-2 bg-gray-100 bg-opacity-50 resize-none text-gray-700 outline-none border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 rounded-lg px-3 py-2 text-sm w-full transition-colors duration-200 ease-in-out" />

                <div className="-ml-2.5">
                  <Checkbox color="blue" label="Remember Me"/>
                </div>
              </CardBody>
              <CardFooter className="pt-0 pb-10 flex flex-col justify-center">
                <button onClick={(e)=>submit(e)} className='bg-blue-800 hover:bg-blue-900 mb-2 font-bold tracking-wider text-white px-14 py-2 rounded-lg'>SIGN IN</button>
              </CardFooter>
            </div>

            <div className='rounded-r-xl w-full bg-gradient-to-r from-blue-500 to-blue-900 flex justify-center text-white rounded-l-[8rem]'>
              <div className='my-auto'>
                <CardBody className="flex flex-col gap-2 items-center">
                  <h1 className='text-center font-bold'>Hello, Friend!</h1>          
                  <h1 className='w-10/12 text-center text-sm text-gray-50 font-semibold'>Welcome to our community! Join us by creating your account on this signup page. It's quick and easy. Just provide your name, email, a unique username, and a secure password to get started. We can't wait to have you on board!</h1>          
                </CardBody>
                <CardFooter className="pt-0 flex justify-center">
                  <Link href={'/signup'} className='no-underline bg-transparent border border-white mb-2 font-bold tracking-wider text-white px-14 py-2 rounded-lg'>SIGN UP</Link>
                </CardFooter>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>


  </>
)
}

export default Login