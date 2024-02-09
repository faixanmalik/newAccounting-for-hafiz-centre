import React, {Fragment, useEffect, useRef, useState} from 'react'
import mongoose from "mongoose";
import moment from 'moment/moment';
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Menu, Dialog, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlusCircle, AiOutlinePrinter } from 'react-icons/ai';
import dbSalesInvoice from 'models/SalesInvoice';
import Contact from 'models/Contact';
import Charts from 'models/Charts';
import { ProSidebarProvider } from 'react-pro-sidebar';
import FullLayout from '@/panel/layouts/FullLayout';
import Employees from 'models/Employees';
import Product from 'models/Product';
import TaxRate from 'models/TaxRate';
import Project from 'models/Project';
import ReactToPrint from 'react-to-print';
import PaymentType from 'models/PaymentMethod';
import PaymentMethod from 'models/PaymentMethod';
import Head from 'next/head';


  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const SalesInvoice = ({ userEmail, dbVouchers, dbProducts, dbPaymentMethod, dbContacts, dbTaxRate, dbProject }) => {
    
    const [open, setOpen] = useState(false)
    const [id, setId] = useState('')
    const [selectedIds, setSelectedIds] = useState([]);

    const [filteredInvoices, setFilteredInvoices] = useState([])
    const [filteredTaxRate, setFilteredTaxRate] = useState([])
    const [filteredProduct, setFilteredProduct] = useState([])
    const [filteredContacts, setFilteredContacts] = useState([])
    const [filteredPaymentMethod, setFilteredPaymentMethod] = useState([])


    const [isOpenSaveChange, setIsOpenSaveChange] = useState(true)

    // authentications
    const [isAdmin, setIsAdmin] = useState(false)

    function handleRowCheckboxChange(e, id) {
      if (e.target.checked) {
        setSelectedIds([...selectedIds, id]);
      } else {
        setSelectedIds(selectedIds.filter(rowId => rowId !== id));
      }
    }

    useEffect(() => {

      let filteredInvoices = dbVouchers.filter((item)=>{
        return item.userEmail === userEmail;
      })
      setFilteredInvoices(filteredInvoices)

      let filteredContacts = dbContacts.filter((item)=>{
        return item.userEmail === userEmail;
      })
      setFilteredContacts(filteredContacts)

      let filteredPaymentMethod = dbPaymentMethod.filter((item)=>{
        return item.userEmail === userEmail;
      })
      setFilteredPaymentMethod(filteredPaymentMethod)

      let filteredTaxRate = dbTaxRate.filter((item)=>{
        return item.userEmail === userEmail;
      })
      setFilteredTaxRate(filteredTaxRate)

      let filteredProduct = dbProducts.filter((item)=>{
        return item.userEmail === userEmail;
      })
      setFilteredProduct(filteredProduct)

      const myUser = JSON.parse(localStorage.getItem('myUser'))
      if(myUser.department === 'Admin'){
        setIsAdmin(true)
      }

    }, [userEmail])


    // JV
    const [journalNo, setJournalNo] = useState('')

    // Date
    const today = new Date().toISOString().split('T')[0];
    const [journalDate, setJournalDate] = useState(today)
  
    const [memo, setMemo] = useState('')
    const [attachment, setAttachment] = useState('')
    const [name, setName] = useState('')
    const [phoneNo, setPhoneNo] = useState(0)
    const [email, setEmail] = useState('')
    const [city, setCity] = useState('')
    const [receivedBy, setReceivedBy] = useState('')
    const [project, setProject] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [fullAmount, setFullAmount] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const [discount, setDiscount] = useState('')

    // JV
    const [inputList, setInputList] = useState([
      { journalNo, date: journalDate, products: '', qty: '', desc:'', amount:'', taxRate:'', taxAmount:'', totalAmountPerItem:'', discount: discount},
      { journalNo, date: journalDate, products: '', qty: '', desc:'', amount:'', taxRate:'', taxAmount:'', totalAmountPerItem:'', discount: discount},
    ]);

    // JV
    const handleChange = (e) => {
      if(e.target.name === 'journalDate'){
        setJournalDate(e.target.value)
      }
      else if(e.target.name === 'dueDate'){
        setDueDate(e.target.value)
      }
      else if(e.target.name === 'project'){
        setProject(e.target.value)
      }
      else if(e.target.name === 'receivedBy'){
        setReceivedBy(e.target.value)
      }
      else if(e.target.name === 'city'){
        setCity(e.target.value)
      }
      else if(e.target.name === 'email'){
        setEmail(e.target.value)
      }
      else if(e.target.name === 'phoneNo'){
        setPhoneNo(e.target.value)
      }
      else if(e.target.name === 'journalNo'){
        setJournalNo(e.target.value)
      }
      else if(e.target.name === 'memo'){
        setMemo(e.target.value)
      }
      else if(e.target.name === 'attachment'){
        setAttachment(e.target.value)
      }
      else if(e.target.name === 'type'){
        setType(e.target.value)
      }
      else if(e.target.name === 'name'){
        setName(e.target.value)
        const newData = dbContacts.filter(item => item.name === e.target.value);
        if(newData.length > 0){
          setEmail(newData[0].email)
          setPhoneNo(newData[0].phoneNo)
          setCity(newData[0].city)
          setReceivedBy(newData[0].streetreceivedBy)
        }
        else{
          setEmail('')
          setPhoneNo('')
          setCity('')
          setReceivedBy('')
        }
      }
      else if(e.target.name === 'fullAmount'){
        setFullAmount(e.target.value)
      }
      else if(e.target.name === 'discount'){
        setDiscount(e.target.value)
        setTotalAmount((fullAmount) - e.target.value)
      }
      else if(e.target.name === 'totalAmount'){
        setTotalAmount(e.target.value)
      }
    }

    // JV
    const submit = async(e)=>{
      e.preventDefault()
      
      inputList.forEach(item => {
        item.date = journalDate;
      });

      // fetch the data from form to makes a file in local system
      const data = { userEmail, phoneNo, email, discount, city, fromAccount:receivedBy, receivedBy, project, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, totalAmount, attachment, path:'SalesInvoice' };

      let res = await fetch(`/api/addEntry`, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      let response = await res.json()

      if (response.success === true) {
        window.location.reload();
      }
      else {
        toast.error(response.message , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
      }
    }

    // JV
    const addLines = () => {
      setInputList([...inputList,
        {journalNo:journalNo, products:'', desc:'', qty: '', amount:'', taxRate:'', taxAmount:'', totalAmountPerItem:'',  discount: discount},
      ])
    }

    const delLines = (indexToDelete) => {
      const updatedInputList = [...inputList];
      updatedInputList.splice(indexToDelete, 1);
      setInputList(updatedInputList);
    };

    // JV
    const change = (e, index) => {
      const values = [...inputList];
      values[index][e.target.name] = e.target.value;

      if (e.target.name === 'amount') {
        const amount = parseFloat(e.target.name === 'amount' ? e.target.value : values[index].amount);
        const qty = parseFloat(e.target.name === 'qty' ? e.target.value : values[index].qty);
        
        const totalAmount = amount * qty;
        values[index].totalAmountPerItem = isNaN(totalAmount) ? 0 : totalAmount;
        setInputList(values);
      } else {
        setInputList(values);
      }


      // Full Amount
      var fullAmount = 0;
      for (let index = 0; index < inputList.length; index++) {
        fullAmount += parseInt(inputList[index].amount) * parseInt(inputList[index].qty);
      }
      setFullAmount(fullAmount);

      // total Amount
      setTotalAmount(fullAmount);
    }

    const editEntry = async(id)=>{
      setOpen(true)

      const data = { id, phoneNo, discount, email, city, fromAccount:receivedBy, receivedBy, project, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, totalAmount, attachment, path:'SalesInvoice' };
      
      let res = await fetch(`/api/editEntry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      let response = await res.json()
      
      if (response.success === true) {
        window.location.reload();
      }
      else {
        toast.error(response.message , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
      }
    }

    const delEntry = async()=>{

      const data = { selectedIds , path: 'SalesInvoice' };
      let res = await fetch(`/api/delEntry`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      let response = await res.json()

      if (response.success === true) {
        window.location.reload();
      }
      else {
        toast.error(response.message , { position: "bottom-center", autoClose: 1000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
      }
    }

    const getData = async (id) =>{
      
      setIsOpenSaveChange(false)
      setOpen(true)

      const data = { id, path: 'SalesInvoice' };
      let res = await fetch(`/api/getDataEntry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      let response = await res.json()

      if (response.success === true){
        const dbJournalDate = moment(response.data.journalDate).utc().format('YYYY-MM-DD')
        const dbDueDate = moment(response.data.dueDate).utc().format('YYYY-MM-DD')
        
        setId(response.data._id)
        setJournalDate(dbJournalDate)
        setJournalNo(response.data.journalNo)
        setInputList(response.data.inputList)
        setMemo(response.data.memo)
        setName(response.data.name)
        setAttachment(response.data.attachment.data)
        setFullAmount(response.data.fullAmount)
        setDiscount(response.data.discount)
        setTotalAmount(response.data.totalAmount)
        setPhoneNo(response.data.phoneNo)
        setName(response.data.name)
        setEmail(response.data.email)
        setCity(response.data.city)
        setProject(response.data.project)
        setReceivedBy(response.data.receivedBy)
        setDueDate(dbDueDate)
      }
    }

    // For print
    const componentRef = useRef();
    const speceficComponentRef = useRef();

  return (
    <>
    <ProSidebarProvider>
    <style jsx global>{`
        footer {
          display: none;
        }
        header {
          display: none;
        }
      `}</style>
    <FullLayout>

    <Head>
      <title>{process.env.NEXT_PUBLIC_BRANDNAME}</title>
      <meta name="description" content="Generated by erp system" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>


    {/* React tostify */}
    <ToastContainer position="bottom-center" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light"/>

    <div className="mt-10 sm:mt-0">
      <div className="md:grid md:grid-cols-1 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0 flex">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Sales Invoices</h3>
            <button 
              onClick={()=>{
                setOpen(true)
                setId('')
                setJournalDate(today)

                setJournalNo(`SI-${filteredInvoices.length === 0 || !filteredInvoices[filteredInvoices.length - 1].journalNo
                  ? filteredInvoices.length + 1
                  : parseInt(filteredInvoices[filteredInvoices.length - 1].journalNo.slice(3)) + 1}`)


                setInputList([
                  {journalNo : `SI-${filteredInvoices.length === 0 || !filteredInvoices[filteredInvoices.length - 1].journalNo
                    ? filteredInvoices.length + 1
                    : parseInt(filteredInvoices[filteredInvoices.length - 1].journalNo.slice(3)) + 1}`,
                    
                    discount: discount, date: journalDate, products:'', desc:'', qty: '', amount:'', taxRate:'', taxAmount:'', totalAmountPerItem:'' },
                ])
                setMemo('')
                setAttachment('')
                setFullAmount(0)
                setTotalAmount(0)
                setPhoneNo(0)
                setDiscount(0)
                setName('')
                setReceivedBy('')
                setEmail('')
                setCity('')
                setProject('')
                setReceivedBy('')
                setDueDate('')
                setIsOpenSaveChange(true)
              }} 
              className={`${isAdmin === false ? 'cursor-not-allowed': ''} ml-auto bg-blue-800 hover:bg-blue-900 text-white px-14 py-2 rounded-lg`} disabled={isAdmin === false}>
              New
            </button>
          </div>
        </div>
        <div className="mt-2 md:col-span-2 md:mt-0">
        <div className='flex'>
            <button onClick={delEntry}
              className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2`} disabled={isAdmin === false}
              >
                Delete
              <AiOutlineDelete className='text-lg ml-2'/>
            </button>

            <ReactToPrint
              trigger={()=>{
                return <button 
                  type='button'
                  className={`${isAdmin === false ? 'cursor-not-allowed': ''} text-blue-800 flex hover:text-white border-2 border-blue-800 hover:bg-blue-800 font-semibold rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2`} disabled={isAdmin === false}>
                  Print All
                  <AiOutlinePrinter className='text-lg ml-2'/>
                </button>
              }}
              content={() => componentRef.current}
              documentTitle='Sales Invoices'
              pageStyle='print'
            />
          </div>
          <form method="POST">
            <div className="overflow-hidden shadow sm:rounded-md">
              
              <div className="overflow-x-auto shadow-sm">
                <table ref={componentRef} className="w-full text-sm text-left text-gray-500 ">
                  <thead className="text-xs text-gray-700 uppercase bg-[#e9ecf7]">
                    <tr>
                      <th scope="col" className="p-4">
                        <div className="flex items-center">
                          <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        </div>
                      </th>
                      <th scope="col" className="p-1">
                          Inv No
                      </th>
                      <th scope="col" className="p-1">
                          Date
                      </th>
                      <th scope="col" className="p-1">
                          Name
                      </th>
                      <th scope="col" className="p-1">
                          Received By
                      </th>
                      <th scope="col" className="p-1">
                          Total Amount
                      </th>
                      
                      <th scope="col" className="p-1">
                        View/Edit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((item, index)=>{
                    return <tr key={index} className="bg-white border-b hover:bg-gray-50">
                      <td className="w-4 p-4">
                        <div className="flex items-center">
                          <input id="checkbox-table-search-1" type="checkbox" onChange={e => handleRowCheckboxChange(e, item._id)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        </div>
                      </td>
                      <td className="p-1">
                        <div className='text-sm text-black font-semibold'>{item.journalNo}</div>
                      </td>
                      <td className="p-1">
                        <div className='text-sm'>{moment(item.journalDate).utc().format('D MMM YYYY')}</div>
                      </td>
                      <td className="p-1">
                        <div className='text-sm'>{item.name}</div>
                      </td>
                      <td className="p-1">
                        <div className='text-sm'>{item.receivedBy}</div>
                      </td>
                      <td className="p-1">
                        <div className='text-sm text-black font-semibold'>{parseInt(item.totalAmount).toLocaleString()}</div>
                      </td>
                      <td className="flex items-center px-3 mr-5 py-4 space-x-4">
                        <button type='button' onClick={()=>{getData(item._id)}} 
                            className={`${isAdmin === false ? 'cursor-not-allowed': ''} font-medium text-blue-600 dark:text-blue-500 hover:underline`} disabled={isAdmin === false}>
                            <AiOutlineEdit className='text-lg'/>
                          </button>
                      </td>
                          
                    </tr>})}
                    
                  </tbody>
                </table>
                { filteredInvoices.length === 0  ? <h1 className='text-red-600 text-center text-base my-3'>No data found!</h1> : ''}
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>

    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={()=>{setOpen(false)}}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95" enterTo="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 md:scale-100" leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
              <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-6xl">
                <div className="relative flex w-full items-center overflow-hidden bg-white px-3 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <button type='button' className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-6 lg:right-8" onClick={() => setOpen(false)}>
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <div className='w-full'>
                    <form method="POST" onSubmit={submit}>
                      <div className="overflow-hidden shadow sm:rounded-md">
                        <div ref={speceficComponentRef} className="bg-white px-4 py-5">

                          <div className='flex space-x-4 mb-14'>

                            <div className="w-full">
                              <label htmlFor="journalDate" className="block text-sm font-medium text-gray-700">
                              Journal Date:
                              </label>
                              <input 
                                type="date"
                                onChange={handleChange}
                                name="journalDate"
                                id="journalDate"
                                value={journalDate}
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>

                            <div className="w-full">
                              <label htmlFor="journalNo" className="block text-sm font-medium text-gray-700">
                                Journal No:
                              </label>
                              <input
                                type="text"
                                name="journalNo"
                                value={journalNo}
                                id="journalNo"
                                className="mt-1 cursor-not-allowed p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                readOnly
                              />
                            </div>
                          </div>

                          <div className='flex space-x-4 mb-14'>
                            <div className="w-full">
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name:
                              </label>
                              <select id="name" name="name" onChange={ handleChange } value={name} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                <option value=''>select contacts</option>
                                {filteredContacts.map((item, index)=>{
                                  return <option key={index} value={item.name}>{item.name} - {item.type}
                                  </option>
                                })}
                              </select>
                            </div>

                            

                            <div className="w-full">
                              <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700">
                                Phone No:
                              </label>
                              <input
                                type="number"
                                onChange={handleChange}
                                name="phoneNo"
                                value={phoneNo}
                                id="phoneNo"
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                            
                            <div className="w-full">
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email:
                              </label>
                              <input
                                type="text"
                                onChange={handleChange}
                                name="email"
                                value={email}
                                id="email"
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>

                            <div className="w-full">
                              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                City:
                              </label>
                              <input
                                type="text"
                                onChange={handleChange}
                                name="city"
                                value={city}
                                id="city"
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>

                            <div className="w-full">
                              <label htmlFor="project" className="block text-sm font-medium text-gray-700">
                                Project:
                              </label>
                            
                              <select id="project" name="project" onChange={ handleChange } value={project} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                <option value=''>select project</option>
                                {dbProject.map((item, index)=>{
                                  return <option key={index} value={item.name}>{item.name}</option>
                                })}
                              </select>
                            </div>

                          </div>


                          <div className='flex space-x-4 mb-14'>
                        
                            <div className="w-full">
                              <label htmlFor="receivedBy" className="block text-sm font-medium text-gray-700">
                                Received By:
                              </label>
                              
                              <select id="receivedBy" name="receivedBy" onChange={ handleChange } value={receivedBy} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                <option value=''>select received By</option>
                                {filteredPaymentMethod.map((item, index)=>{
                                  return <option key={index} value={item.paymentType}>{item.paymentType}</option>
                                })}
                              </select>
                            </div>

                            <div className="w-1/2">
                              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                              Due Date:
                              </label>
                              <input 
                              type="date"
                              onChange={handleChange}
                              name="dueDate"
                              id="dueDate"
                              value={dueDate}
                              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              required
                              />
                            </div>

                          </div>



                            <div className='flex space-x-4 my-10'>

                                <table className="w-full text-sm text-left text-gray-500 ">
                                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                      <th scope="col" className="p-2">
                                          Products
                                      </th>
                                      <th scope="col" className="p-2">
                                          Description 
                                      </th>
                                      <th scope="col" className="p-2">
                                          Qty
                                      </th>
                                      <th scope="col" className="p-2">
                                          Amount
                                      </th>
                                      <th scope="col" className="p-2">
                                          Total
                                      </th>
                                      <th scope="col" className="p-2">
                                          Add/Del
                                      </th>
                                    </tr>
                                  </thead>
                                
                                  <tbody >
                                  {inputList.map(( inputList , index)=>{
                                    return <tr key={index} className="bg-white text-black border-b hover:bg-gray-50">
                                    
                                      <td className="p-2 w-1/5">
                                        <select id="products" name="products" onChange={ e => change(e, index) } value={inputList.products} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                          <option value=''>select product</option>
                                          {filteredProduct.map((item, index)=>{
                                            return <option key={index} value={item.name}>{item.name}</option>
                                          })}
                                        </select>
                                      </td>
                                      <td className="p-2">
                                        <input
                                          type="text"
                                          onChange={ e=> change(e, index) }
                                          value={ inputList.desc }
                                          name="desc"
                                          id="desc"
                                          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                      </td>

                                      <td className="p-2">
                                        <input
                                          type="number"
                                          onChange={ e=> change(e, index) }
                                          value={ inputList.qty }
                                          name="qty"
                                          id="qty"
                                          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                      </td>
                                      <td className="p-2">
                                        <input
                                          type="number"
                                          onChange={ e=> change(e, index) }
                                          value={ inputList.amount }
                                          name="amount"
                                          id="amount"
                                          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                      </td>

                                      <td className="p-2">
                                        <input
                                          type="number"
                                          value = { inputList.totalAmountPerItem }
                                          name="totalAmountPerItem"
                                          id="totalAmountPerItem"
                                          className="mt-1 p-2 cursor-not-allowed block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                          readOnly
                                          />
                                      </td>
                                      <td className="p-1 flex items-center mt-[18px]">
                                        <button type='button' className='mx-auto' onClick={addLines}><AiOutlinePlusCircle className='text-xl text-green-600'/></button>
                                        <button type='button' className='mx-auto'><AiOutlineDelete onClick={()=>index != 0 && delLines(index)} className='text-xl text-red-700'/></button>
                                      </td>

                                    </tr>})}
                                      
                                  </tbody>
                                </table>
                        
                          </div>
                        
                          <div className='bg-gray-100'>
                            <div className='flex flex-col ml-auto mr-10 space-y-2 w-1/3 py-3 mt-20'>
                              <div className="flex items-center">
                                <label htmlFor="fullAmount" className="block w-full text-sm font-medium text-gray-700">
                                  Total Amount:
                                </label>
                                <input
                                  type="number"
                                  value = { fullAmount }
                                  name="fullAmount"
                                  id="fullAmount"
                                  className="mt-1 p-2 cursor-not-allowed block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  readOnly
                                />
                              </div>
                              
                              <div className="flex items-center">
                                <label htmlFor="discount" className="block w-full text-sm font-medium text-gray-700">
                                  Discount:
                                </label>
                                <input
                                  type="number"
                                  value = { discount }
                                  onChange={handleChange}
                                  name="discount"
                                  id="discount"
                                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                              <div className="flex items-center">
                                <label htmlFor="totalAmount" className="block w-full text-sm font-medium text-gray-700">
                                  Total Amount:
                                </label>
                                <input
                                  type="number"
                                  value = { totalAmount }
                                  name="totalAmount"
                                  id="totalAmount"
                                  className="mt-1 cursor-not-allowed p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  readOnly
                                />
                              </div>
                              
                            </div>
                          </div>

                          <div className=" mt-14">
                            <label htmlFor="memo" className="block text-sm font-medium text-gray-700">
                              Memo:
                            </label>
                            <textarea cols="30" rows="4" type="text"
                                name="memo"
                                onChange={handleChange}
                                id="memo"
                                value={memo}
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            </textarea>
                          </div>
                            
                          {/* <div className="mt-7">
                            <label htmlFor="attachment" className="block text-sm font-medium text-gray-700">
                                Attachment:
                            </label>
                            <input
                                type="file"
                                onChange={handleChange}
                                name="attachment"
                                value={attachment}
                                id="attachment"
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                multiple
                            />
                          </div> */}

                        </div>
                        <div className="bg-gray-50 space-x-3 px-4 py-3 text-right sm:px-6">

                        <ReactToPrint
                            trigger={()=>{
                              return <button 
                                type="button"
                                className='inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                                Print
                                <AiOutlinePrinter className='text-lg ml-2'/>
                              </button>
                            }}
                            content={() => speceficComponentRef.current}
                            documentTitle='Sales Invoice'
                            pageStyle='print'
                          />

                          <button type='button' onClick={()=>{editEntry(id)}} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Save Changes</button>
                          {isOpenSaveChange && <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Save</button>}
                        </div>
                      </div>
                    </form>
                  </div>

                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>

    </FullLayout>
    </ProSidebarProvider>

    </>
  )
}



export async function getServerSideProps() {
  if (!mongoose.connections[0].readyState){
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI)
  }
  let dbVouchers = await dbSalesInvoice.find()
  let dbContacts = await Contact.find()
  let dbEmployees = await Employees.find()
  let dbProducts = await Product.find()
  let dbTaxRate = await TaxRate.find()
  let dbPaymentMethod = await PaymentMethod.find()
  let dbProject = await Project.find()

  // Pass data to the page via props
  return {
    props: {
      dbVouchers: JSON.parse(JSON.stringify(dbVouchers)),
      dbContacts: JSON.parse(JSON.stringify(dbContacts)), 
      dbProducts: JSON.parse(JSON.stringify(dbProducts)), 
      dbTaxRate: JSON.parse(JSON.stringify(dbTaxRate)), 
      dbPaymentMethod: JSON.parse(JSON.stringify(dbPaymentMethod)), 
      dbEmployees: JSON.parse(JSON.stringify(dbEmployees)), 
      dbProject: JSON.parse(JSON.stringify(dbProject)), 
    }
  }
}   
export default SalesInvoice