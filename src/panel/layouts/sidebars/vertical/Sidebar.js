import { React, Fragment, useState, useEffect } from 'react'
import Logo from "../../logo/Logo";
import { useRouter } from "next/router";
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Menu, MenuItem, SubMenu, Sidebar } from 'react-pro-sidebar';

import { AiOutlineCloseCircle, AiOutlineContacts, AiOutlineUser } from 'react-icons/ai'
import { BiHomeAlt, BiUserCheck } from 'react-icons/bi'
import { MdOutlineInventory2, MdPayment, MdProductionQuantityLimits} from 'react-icons/md'
import {IoPieChartSharp, IoBusinessOutline} from 'react-icons/io5'
import {HiOutlineCash, HiOutlineDocumentReport, HiOutlineReceiptTax} from 'react-icons/hi'


import {BsBank} from 'react-icons/bs'
import {FiUserPlus, FiUsers} from 'react-icons/fi'
import {RiBankCardLine} from 'react-icons/ri'
import {FaUserFriends} from 'react-icons/fa'





const Sidebar2 = ({ showMobilemenu }) => {

  const router = useRouter();
  const location = router.pathname;
  const [open, setOpen] = useState(false)

  const [isOwner, setisOwner] = useState(false)

  useEffect(() => {
    let myUser = JSON.parse(localStorage.getItem("myUser"));
    if(myUser && myUser.role === 'super admin'){
      setisOwner(true)
    }
  }, [])
  

  return (
    <div className="w-full">
      <div className="py-[17px] flex justify-center">
        <Logo className/>
        <button className="text-2xl ml-6 items-center lg:hidden" onClick={showMobilemenu} >
          <AiOutlineCloseCircle />
        </button>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={setOpen}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95" enterTo="opacity-100 translate-y-0 md:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 md:scale-100" leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95">
                <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-5xl">

                  <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                    <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-6 lg:right-8" onClick={() => setOpen(false)}>
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <div className="relative mt-6 w-full overflow-x-auto shadow-sm">
                      <table className="w-full text-sm text-left text-gray-500 ">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3">
                              Business Setup
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Purchase Invoice
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Sales Invoice
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Reports
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          <tr className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-2">
                              <a href={'/panel/businessSetup/chartsOfAccount'} className='no-underline text-gray-500 font-medium text-base'>Charts of Accounts</a>
                            </td>
                            <td className="px-6 py-2">
                              <a href={'/panel/purchaseModule/purchaseInvoice'} className='no-underline text-gray-500 font-medium text-base'>Purchase Invoice</a>
                            </td>
                            <td className="px-6 py-2">
                              <a href={'/panel/salesModule/salesInvoice'} className='no-underline text-gray-500 font-medium text-base'>Sales Invoice</a>
                            </td>
                            <td className="px-6 py-2">
                              <a href={'/panel/financialManagment/reports/generalLedger'} className='no-underline text-gray-500 font-medium text-base'>General Ledger</a>
                            </td>
                          </tr>

                          <tr className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-2">
                              <a href={'/panel/businessSetup/taxRate'} className='no-underline text-gray-500 font-medium text-base'>Tax Rate</a>
                            </td>
                            <td className="px-6 py-2">
                              <a href={'/panel/purchaseModule/paymentVoucher'} className='no-underline text-gray-500 font-medium text-base'>Payment Voucher</a>
                            </td>
                            <td className="px-6 py-2">
                              <a href={'/panel/salesModule/creditSalesInvoice'} className='no-underline text-gray-500 font-medium text-base'>Credit Sales Invoice</a>
                            </td>
                            <td className="px-6 py-2">
                              <a href={'/panel/financialManagment/reports/trialBalance'} className='no-underline text-gray-500 font-medium text-base'>Trial Balance</a>
                            </td>
                          </tr>


                          <tr className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-2">
                              <a href={'/panel/businessSetup/contactList'} className='no-underline text-gray-500 font-medium text-base'>Contact List</a>
                            </td>
                            <td className="px-6 py-2">
                              <a href={'/panel/purchaseModule/debitNote'} className='no-underline text-gray-500 font-medium text-base'>Debit Note</a>
                            </td>
                            <td className="px-6 py-2">
                              <a href={'/panel/salesModule/receiptVoucher'} className='no-underline text-gray-500 font-medium text-base'>Receipt Voucher</a>
                            </td>
                            <td className="px-6 py-2">
                              <a href={'/panel/financialManagment/reports/profitAndLoss'} className='no-underline text-gray-500 font-medium text-base'>Profit and Loss</a>
                            </td>
                          </tr>

                          <tr className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-2">
                              <a href={'/panel/businessSetup/productAndServices'} className='no-underline text-gray-500 font-medium text-base'>Product and Services</a>
                            </td>
                            <td className="px-6 py-2">
                              <a href={'/panel/purchaseModule/expenses'} className='no-underline text-gray-500 font-medium text-base'>Expenses</a>
                            </td>
                            <td className="px-6 py-2">
                              <a href={'/panel/salesModule/creditNote'} className='no-underline text-gray-500 font-medium text-base'>Credit Note</a>
                            </td>
                            <td className="px-6 py-2">
                              <a href={'/panel/financialManagment/reports/balanceSheet'} className='no-underline text-gray-500 font-medium text-base'>Balance Sheet</a>
                            </td>
                          </tr>

                          <tr className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-2">
                              <a href={'/panel/businessSetup/bankAccount'} className='no-underline text-gray-500 font-medium text-base'>Bank Account</a>
                            </td>
                            <td className="px-6 py-2"></td>
                            <td className="px-6 py-2">
                              <a href={'/panel/salesModule/journalVoucher'} className='no-underline text-gray-500 font-medium text-base'>Journal Voucher</a>
                            </td>
                            <td className="px-6 py-2">
                              <a href={'/panel/financialManagment/reports/contactTransactionSummary'} className='no-underline text-gray-500 font-medium text-base'>Contact Transaction</a>
                            </td>
                          </tr>

                          <tr className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-2">
                              <a href={'/panel/businessSetup/paymentMethod'} className='no-underline text-gray-500 font-medium text-base'>Payment Method</a>
                            </td>
                            <td className="px-6 py-2"></td>
                            <td className="px-6 py-2"></td>
                            <td className="px-6 py-2"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="pt-1 mt-2">

      <Sidebar width='250px'>
      <Menu className='bg-white'>
        <div className='justify-center flex mb-2'>
          <button onClick={() => { setOpen(true) }} className='bg-blue-800 hover:bg-blue-900 mb-2 font-medium text-white px-24 py-2 rounded-lg'>New</button>
        </div>
        
        <Menu>
          <MenuItem icon={<BiHomeAlt className='text-lg'/>} className={ location === '/panel' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'} href="/panel" >
            Dashboard
          </MenuItem>
    
          <SubMenu label="User Managment" icon={<AiOutlineUser className='text-lg'/>}>
            <MenuItem href="/panel/userManagment/addRole" icon={<BiUserCheck className='text-lg'/>} className={ location === '/panel/userManagment/addRole' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Add Role
            </MenuItem>
            {isOwner === true && <MenuItem href="/panel/userManagment/clients" icon={<FaUserFriends className='text-lg'/>} className={ location === '/panel/userManagment/clients' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Clients
            </MenuItem>}
          </SubMenu>

          <SubMenu label="Business Setup" icon={<IoBusinessOutline className='text-lg'/>}>
            <MenuItem href="/panel/businessSetup/chartsOfAccount" icon={<IoPieChartSharp className='text-lg'/>} className={ location === '/panel/businessSetup/chartsOfAccount' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Charts of Accounts
            </MenuItem>
            <MenuItem href="/panel/businessSetup/taxRate" icon={<HiOutlineReceiptTax className='text-lg'/>} className={ location === '/panel/businessSetup/taxRate' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Tax Rate
            </MenuItem>
            <MenuItem href="/panel/businessSetup/contactList" icon={<AiOutlineContacts className='text-lg'/>} className={ location === '/panel/businessSetup/contactList' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Contact List
            </MenuItem>
            <MenuItem href="/panel/businessSetup/bankAccount" icon={<BsBank className='text-lg'/>} className={ location === '/panel/businessSetup/bankAccounts' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Bank Accounts
            </MenuItem>
            <MenuItem href="/panel/businessSetup/paymentMethod" icon={<MdPayment className='text-lg'/>} className={ location === '/panel/businessSetup/paymentMethod' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Payment Method
            </MenuItem>
          </SubMenu>

          <SubMenu label="Inventory Module" icon={<MdOutlineInventory2 className='text-lg'/>}>
            
            <MenuItem href="/panel/inventoryModule/productAndServices" icon={<MdProductionQuantityLimits className='text-lg'/>} className={ location === '/panel/businessSetup/productAndServices' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Products
            </MenuItem>
            
          </SubMenu>


          <SubMenu label="Purchase Module" icon={<RiBankCardLine className='text-lg'/>}>

            <MenuItem href="/panel/purchaseModule/purchaseInvoice" icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/purchaseModule/purchaseOrder' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Purchase Invoice
            </MenuItem>
            <MenuItem href="/panel/purchaseModule/paymentVoucher" icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/purchaseModule/paymentVoucher' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Payment voucher
            </MenuItem>
            <MenuItem href="/panel/purchaseModule/debitNote" icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/purchaseModule/debitNote' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Debit Note
            </MenuItem>
            <MenuItem href="/panel/purchaseModule/expenses" icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/purchaseModule/expenses' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Expenses
            </MenuItem>

          </SubMenu>

          <SubMenu label="Sales Module" icon={<RiBankCardLine className='text-lg'/>}>

            <MenuItem href="/panel/salesModule/salesInvoice" icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/salesModule/salesInvoice' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Sales Invoice
            </MenuItem>
            <MenuItem href="/panel/salesModule/creditSalesInvoice" icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/salesModule/creditSalesInvoice' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Credit Sales Invoice
            </MenuItem>
            <MenuItem href="/panel/salesModule/receiptVoucher" icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/salesModule/receiptVoucher' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Receipt Voucher
            </MenuItem>
            <MenuItem href="/panel/salesModule/creditNote" icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/salesModule/creditNote' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Credit Note
            </MenuItem>
            <MenuItem href="/panel/salesModule/journalVoucher" icon={<HiOutlineCash className='text-lg'/>} className={ location === '/panel/salesModule/journalVoucher' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Journal Voucher
            </MenuItem>
          </SubMenu>
          
          <SubMenu label="Reports" icon={<HiOutlineDocumentReport className='text-lg'/>}>
            <MenuItem href="/panel/financialManagment/reports/generalLedger" icon={<HiOutlineDocumentReport className='text-lg'/>} className={ location === '/panel/financialManagment/reports/generalLedger' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              General Ledger
            </MenuItem>
            <MenuItem href="/panel/financialManagment/reports/trialBalance" icon={<HiOutlineDocumentReport className='text-lg'/>} className={ location === '/panel/financialManagment/reports/trialBalance' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Trial Balance
            </MenuItem>
            <MenuItem href="/panel/financialManagment/reports/profitAndLoss" icon={<HiOutlineDocumentReport className='text-lg'/>} className={ location === '/panel/financialManagment/reports/profitAndLoss' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Profit And Loss
            </MenuItem>
            <MenuItem href="/panel/financialManagment/reports/balanceSheet" icon={<HiOutlineDocumentReport className='text-lg'/>} className={ location === '/panel/financialManagment/reports/balanceSheet' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Balance Sheet
            </MenuItem>
            <MenuItem href="/panel/financialManagment/reports/contactTransactionSummary" icon={<HiOutlineDocumentReport className='text-lg'/>} className={ location === '/panel/financialManagment/reports/contactTransactionSummary' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Contact Transaction
            </MenuItem>
          </SubMenu>

          <SubMenu label="Payroll" icon={<FiUserPlus className='text-lg'/>}>
            <MenuItem href="/panel/payroll/employees" icon={<FiUsers className='text-lg'/>} className={ location === '/panel/payroll/employees' ?  'text-indigo-700 bg-zinc-50 font-medium' : 'text-gray-600 font-medium'}>
              Employees
            </MenuItem>
          </SubMenu>
          
        </Menu>
      </Menu>
      </Sidebar>


      </div>
    </div>
  );
};



export default Sidebar2;