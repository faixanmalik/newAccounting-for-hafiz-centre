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


function Signup() {
  const router = useRouter()

  useEffect(() => {
    if(localStorage.getItem("token")){
      router.push('/panel')
    }
  }, [])

  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmpassword, setConfirmpassword] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [industry, setIndustry] = useState('')
  const [country, setCountry] = useState('')
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')


  let days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
  let months = ['january', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  let countries = [ "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", 
    "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", 
    "North Macedonia", "Norway", "Oman", "Pakistan","Palau",    "Panama",    "Papua New Guinea",    "Paraguay",    "Peru",    "Philippines",    "Poland",    "Portugal",    "Qatar",    "Romania",    "Russia",    "Rwanda",    "Saint Kitts and Nevis",    "Saint Lucia",    "Saint Vincent and the Grenadines",    "Samoa",    "San Marino",    "Sao Tome and Principe",    "Saudi Arabia",    "Senegal",    "Serbia",    "Seychelles",    "Sierra Leone",    "Singapore",    "Slovakia",    "Slovenia",    "Solomon Islands",    "Somalia",    "South Africa",    "South Sudan",    "Spain",    "Sri Lanka",    "Sudan",    "Suriname",    "Sweden",    "Switzerland",    "Syria",    "Taiwan",    "Tajikistan",    "Tanzania",    "Thailand",    "Timor-Leste",    "Togo",    "Tonga",    "Trinidad and Tobago",    "Tunisia",    
    "Turkey","Turkmenistan","Tuvalu", "Uganda",    "Ukraine",    "United Arab Emirates",    "United Kingdom",    "United States of America",    "Uruguay",    "Uzbekistan",    "Vanuatu",    "Venezuela",    "Vietnam",    "Yemen",    "Zambia",    "Zimbabwe"
  ]
  

  const submit = async (e) => {
    e.preventDefault() 

    // fetch the data from form to makes a file in local system
    const data = { firstname, lastname, email, password, confirmpassword, businessName, country, industry, day,  month };

    if( password !== confirmpassword ){
      document.getElementById('checkPassword').innerHTML = "Your Password is not Match!"
    }
    else{
      document.getElementById('checkPassword').innerHTML = ""
      let res = await fetch(`/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      let response = await res.json();
      if (response.success === true) {
        toast.success(response.message , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
        setTimeout(() => {
          router.push(`/login`);
        }, 1500);
      }
      else{
        toast.error(response.message , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
      }
    }
  }

  const handleChange = (e) => {
    if (e.target.name === 'firstname') {
      setFirstname(e.target.value)
    }
    else if (e.target.name === 'lastname') {
      setLastname(e.target.value)
    }
    else if (e.target.name === 'email') {
      setEmail(e.target.value)
    }
    else if (e.target.name === 'password') {
      setPassword(e.target.value)
    }
    else if (e.target.name === 'confirmpassword') {
      setConfirmpassword(e.target.value)
    }
    else if(e.target.name === 'businessName'){
      setBusinessName(e.target.value)
    }
    else if(e.target.name === 'country'){
      setCountry(e.target.value)
    }
    else if(e.target.name === 'industry'){
      setIndustry(e.target.value)
    }
    else if(e.target.name === 'day'){
      setDay(e.target.value)
    }
    else if(e.target.name === 'month'){
      setMonth(e.target.value)
    }
  }


return (
  <>
    <Head>
      <title>Signup_EjaratPro</title>
      <meta name="description" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
    </Head>
    {/* React tostify */}
    <ToastContainer position="bottom-center" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable theme="light" />

    <div className='my-20'>
      <div className='flex justify-center'>
        <Card className="w-9/12">

          <div className='flex'>

            <div className='w-full pt-10'>
              <h1 className='text-black text-center font-bold'>Sign Up</h1>          
              
              <CardBody className="flex flex-col gap-3 py-7">

                <div className='flex space-x-2'>
                  <input type="text" onChange={handleChange} value={firstname} className="bg-gray-100 bg-opacity-50 w-full rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 p-2 resize-none leading-6 transition-colors duration-200 ease-in-out" name="firstname" placeholder="First Name"/>
                  <input type="text" onChange={handleChange} value={lastname} className="bg-gray-100 bg-opacity-50 w-full rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 p-2 resize-none leading-6 transition-colors duration-200 ease-in-out" name="lastname" placeholder="Last Name"/>
                </div>

                <input type="text" onChange={handleChange} value={businessName} className="bg-gray-100 bg-opacity-50 w-full rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 p-2 resize-none leading-6 transition-colors duration-200 ease-in-out" name="businessName" placeholder="Business Name"/>
                {/* <input type="text" onChange={handleChange} value={industry} className="bg-gray-100 bg-opacity-50 w-full rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 p-2 resize-none leading-6 transition-colors duration-200 ease-in-out" name="industry" placeholder="Industry"/> */}

                {/* <select
                  onChange={handleChange}
                  value={country}
                  id="country"
                  name="country"
                  className="bg-gray-100 bg-opacity-50 w-full rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-400 p-2 resize-none leading-6 transition-colors duration-200 ease-in-out"
                >
                  <option>select country</option>
                    {countries.map((item,index)=>{
                      return <option key={index} value={item}>{item}</option>
                    })}
                </select> */}

                {/* <div className='flex space-x-4'>
                  <select
                    onChange={handleChange}
                    value={day}
                    id="day"
                    name="day"
                    placeholder='Last day of your financial year:'
                    className="bg-gray-100 bg-opacity-50 w-10/12 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-400 p-2 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  >
                    <option>Last day of financial year</option>
                      {days.map((item,index)=>{
                        return <option key={index} value={item}>{item}</option>
                      })}
                  </select>

                  <select
                    onChange={handleChange}
                    value={month}
                    id="month"
                    name="month"
                    className="bg-gray-100 bg-opacity-50 w-1/2 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-400 p-2 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  >
                    <option>month</option>
                      {months.map((item, index)=>{
                        return <option key={index} value={item}>{item}</option>
                      })}
                  </select>

                </div> */}
              
                <input onChange={handleChange} value={email} name="email" id='email' type="email" placeholder='abc@example.com' className="bg-gray-100 bg-opacity-50 resize-none text-gray-700 outline-none border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 rounded-lg px-3 py-2 text-sm w-full transition-colors duration-200 ease-in-out" />
                <input onChange={handleChange} value={password} name="password" id='password' type="password" placeholder='############' className=" bg-gray-100 bg-opacity-50 resize-none text-gray-700 outline-none border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 rounded-lg px-3 py-2 text-sm w-full transition-colors duration-200 ease-in-out" />
                <input onChange={handleChange} value={confirmpassword} name="confirmpassword" id='confirmpassword' type="password" placeholder='############' className="bg-gray-100 bg-opacity-50 resize-none text-gray-700 outline-none border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 rounded-lg px-3 py-2 text-sm w-full transition-colors duration-200 ease-in-out" />
                <h1 id="checkPassword" className='text-sm text-red-600 '></h1>

                
                <button onClick={(e)=>submit(e)} className='bg-blue-800 hover:bg-blue-900 mb-2 font-bold tracking-wider text-white px-14 py-2 rounded-lg'>SIGN UP</button>

              </CardBody>

              {/* <CardFooter className="pt-0 pb-10 flex flex-col justify-center">
                <button onClick={(e)=>submit(e)} className='bg-blue-800 hover:bg-blue-900 mb-2 font-bold tracking-wider text-white px-14 py-2 rounded-lg'>SIGN UP</button>
              </CardFooter> */}
            </div>

            <div className='rounded-r-xl w-full bg-gradient-to-r from-blue-500 to-blue-900 flex justify-center text-white rounded-l-[8rem]'>
              <div className='my-auto'>
                <CardBody className="flex flex-col gap-2 items-center">
                  <h1 className='text-center font-bold'>Hello, Friend!</h1>          
                  <h1 className='w-10/12 text-center text-sm text-gray-50 font-semibold'>Welcome to our community! Join us by creating your account on this signup page. It's quick and easy. Just provide your name, email, a unique username, and a secure password to get started. We can't wait to have you on board!</h1>          
                </CardBody>
                <CardFooter className="pt-0 flex justify-center">
                  <Link href={'/login'} className='no-underline bg-transparent border border-white mb-2 font-bold tracking-wider text-white px-14 py-2 rounded-lg'>SIGN IN</Link>
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

export default Signup