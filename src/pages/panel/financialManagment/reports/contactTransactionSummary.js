import React, { useEffect, useState } from 'react'
import mongoose from "mongoose";
import moment from 'moment/moment';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Contact from 'models/Contact';
import { ProSidebarProvider } from 'react-pro-sidebar';
import FullLayout from '@/panel/layouts/FullLayout';

import JournalVoucher from 'models/JournalVoucher';
import Charts from 'models/Charts';
import CreditSalesInvoice from 'models/CreditSalesInvoice';
import SalesInvoice from 'models/SalesInvoice';
import PurchaseInvoice from 'models/PurchaseInvoice';
import DebitNote from 'models/DebitNote';
import CreditNote from 'models/CreditNote';
import ReceiptVoucher from 'models/ReceiptVoucher';
import PaymentVoucher from 'models/PaymentVoucher';
import Expenses from 'models/Expenses';

const ContactTransactionSummary = ({ dbExpensesVoucher, dbPaymentVoucher, dbReceiptVoucher, dbDebitNote, dbCreditNote, dbPurchaseInvoice, dbSalesInvoice, dbCreditSalesInvoice, dbJournalVoucher, dbCharts,  dbContacts }) => {

    // Cash Receipt
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('') 
    const [sortBy, setsortBy] = useState('')
    const [contact, setContact] = useState('')
    const [dbAccount, setDbAccount] = useState(false)
    const [newEntry, setNewEntry] = useState([])



    let dbAllEntries = [];
    const submit = ()=>{

        let allVouchers = [];

        if(contact){
            allVouchers = allVouchers.concat(dbExpensesVoucher, dbPaymentVoucher, dbReceiptVoucher, dbDebitNote, dbCreditNote, dbPurchaseInvoice, dbSalesInvoice, dbCreditSalesInvoice, dbJournalVoucher);

            // Data filter
            const dbAll = allVouchers.filter((data) => {
                
                if (data.name === `${contact}`) {

                    if(data.type == 'PaymentVoucher' || data.type == 'ReceiptVoucher'){

                        Object.assign(data, {
                            transactionAmount: data.totalPaid,
                        });

                        if(fromDate && toDate){
                            const dbDate = moment(data.journalDate).format('YYYY-MM-DD')
                            return dbDate >= fromDate && dbDate <= toDate;
                        }
                        else{
                            return data.name;
                        }
                    }
                    else if( data.type == 'PurchaseInvoice' || data.type == 'CreditSalesInvoice' || data.type == 'SalesInvoice' || data.type == 'Expenses' || data.type === 'DebitNote' || data.type === 'CreditNote'){
                        Object.assign(data, {
                            transactionAmount: data.fullAmount,
                        });
    
                        if(fromDate && toDate){
                            const dbDate = moment(data.journalDate).format('YYYY-MM-DD')
                            return dbDate >= fromDate && dbDate <= toDate;
                        }
                        else{
                            return data.name;
                        }
                    }
                    else{
                        Object.assign(data, {
                            transactionAmount: data.totalDebit,
                        });
    
                        if(fromDate && toDate){
                            const dbDate = moment(data.journalDate).format('YYYY-MM-DD')
                            return dbDate >= fromDate && dbDate <= toDate;
                        }
                        else{
                            return data.name;
                        }

                    }
                }
            })
            
            // const dbAll = allVouchers.filter((data) => {
                
            //     if (data.name === `${contact}`) {

            //         if(data.type == 'PaymentVoucher'){

            //             Object.assign(data, {
            //                 debit: 0,
            //                 credit: data.totalPaid,
            //             });

            //             if(fromDate && toDate){
            //                 const dbDate = moment(data.journalDate).format('YYYY-MM-DD')
            //                 return dbDate >= fromDate && dbDate <= toDate;
            //             }
            //             else{
            //                 return data.name;
            //             }
            //         }
            //         else if(data.type == 'CreditSalesInvoice' || data.type == 'SalesInvoice'){
            //             Object.assign(data, {
            //                 credit: data.fullAmount,
            //                 debit: 0
            //             });
            //             if(fromDate && toDate){
            //                 const dbDate = moment(data.journalDate).format('YYYY-MM-DD')
            //                 return dbDate >= fromDate && dbDate <= toDate;
            //             }
            //             else{
            //                 return data.name;
            //             }
            //         }
            //         else if(data.type == 'ReceiptVoucher'){

            //             Object.assign(data, {
            //                 debit: data.totalPaid,
            //                 credit: 0,
            //             });
            //             if(fromDate && toDate){
            //                 const dbDate = moment(data.journalDate).format('YYYY-MM-DD')
            //                 return dbDate >= fromDate && dbDate <= toDate;
            //             }
            //             else{
            //                 return data.name;
            //             }
            //         }
            //         else if(data.type == 'Expenses'){
                        
            //             Object.assign(data, {
            //                 debit: 0,
            //                 credit: data.fullAmount,
            //             });
            //             if(fromDate && toDate){
            //                 const dbDate = moment(data.journalDate).format('YYYY-MM-DD')
            //                 return dbDate >= fromDate && dbDate <= toDate;
            //             }
            //             else{
            //                 return data.name;
            //             }
            //         }
            //         else if(data.type === 'DebitNote'){
            //             Object.assign(data, {
            //                 debit: data.fullAmount,
            //                 credit: 0,
            //             });
    
            //             if(fromDate && toDate){
            //                 const dbDate = moment(data.journalDate).format('YYYY-MM-DD')
            //                 return dbDate >= fromDate && dbDate <= toDate;
            //             }
            //             else{
            //                 return data.name;
            //             }
            //         }
            //         else if(data.type === 'CreditNote'){
            //             Object.assign(data, {
            //                 debit: 0,
            //                 credit: data.fullAmount,
            //             });
    
            //             if(fromDate && toDate){
            //                 const dbDate = moment(data.journalDate).format('YYYY-MM-DD')
            //                 return dbDate >= fromDate && dbDate <= toDate;
            //             }
            //             else{
            //                 return data.name;
            //             }
            //         }
            //         else{
            //             Object.assign(data, {
            //                 debit: data.totalDebit,
            //                 credit: data.totalCredit,
            //             });
    
            //             if(fromDate && toDate){
            //                 const dbDate = moment(data.journalDate).format('YYYY-MM-DD')
            //                 return dbDate >= fromDate && dbDate <= toDate;
            //             }
            //             else{
            //                 return data.name;
            //             }

            //         }
            //     }
            // })
            dbAllEntries = dbAllEntries.concat(dbAll);
        }
        
        // Date filter
        dbAllEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
        setNewEntry(dbAllEntries)
    }







    const handleChange = (e) => {
        if (e.target.name === 'contact') {
            setContact(e.target.value)
        }
        else if (e.target.name === 'fromDate') {
            setFromDate(e.target.value)
        }
        else if (e.target.name === 'toDate') {
            setToDate(e.target.value)
        }
    }
    



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

    
    {/* React tostify */}
    <ToastContainer position="bottom-center" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />

    <div className='w-full'>
        <form method="POST">
            <div className="overflow-idden shadow sm:rounded-md">
                <div className="bg-white px-4 sm:p-3">
                    <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-1">
                            <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">
                                From:
                            </label>
                            <input
                                type="date"
                                onChange={handleChange}
                                name="fromDate"
                                id="fromDate"
                                value={fromDate}
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="col-span-6 sm:col-span-1">
                            <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">
                                To:
                            </label>
                            <input
                                type="date"
                                onChange={handleChange}
                                name="toDate"
                                id="toDate"
                                value={toDate}
                                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                                Contacts:
                            </label>
                            <select id="contact" name="contact" onChange={handleChange} value={contact} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                <option>select contact</option>
                                {dbContacts.map((item) => {
                                    return <option key={item._id} value={item.name}>{item.name}</option>
                                })}
                            </select>
                        </div>
                        <button onClick={submit} type='button' className='bg-blue-800 hover:bg-blue-900 text-white px-10 h-10 mt-4 rounded-lg'>Update</button>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <div className="md:grid md:grid-cols-1 md:gap-6">
        <div className="md:col-span-1">
            <div className="px-4 mt-4 sm:px-0 flex">
                <h3 className="text-lg mx-auto font-black tracking-wide leading-6 text-blue-800">Contact Transaction Summary</h3>
            </div>
        </div>
        <div className="md:col-span-2">
            <form method="POST">
                <div className="overflow-hidden shadow sm:rounded-md">

                    <div className="overflow-x-auto shadow-sm">
                        <table className="w-full text-sm text-left text-gray-500 ">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Voucher No
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody>

                                {/* All Vouchers */}
                                {newEntry.map((item, index) => {

                                    return <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-3">
                                            {item.journalNo ? item.journalNo: item.billNo}
                                        </td>
                                        <td className="px-6 py-3 text-blue-700 font-bold">
                                            {item.name}
                                        </td>
                                        
                                        <td className="px-6 py-3">
                                            {item.date 
                                                ? moment(item.date).utc().format('DD-MM-YYYY')
                                                : moment(item.journalDate).utc().format('DD-MM-YYYY')
                                            }
                                        </td>
                                        <td className="px-6 py-3">
                                            {parseInt(item.transactionAmount).toLocaleString()}
                                        </td>
                                        
                                    </tr>
                                })}
                            </tbody>
                        </table>
                        { newEntry.length === 0  ? <h1 className='text-red-600 text-center text-base my-3'>No data found!</h1> : ''}
                    </div>
                </div>
            </form>
        </div>
    </div>

    </FullLayout>
    </ProSidebarProvider>

    </>
    )
}

export async function getServerSideProps() {
    if (!mongoose.connections[0].readyState) {
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGO_URI)
    }
    let dbJournalVoucher = await JournalVoucher.find()
    let dbContacts = await Contact.find()

    let dbCreditSalesInvoice = await CreditSalesInvoice.find()
    let dbSalesInvoice = await SalesInvoice.find()
    let dbPurchaseInvoice = await PurchaseInvoice.find()
    let dbDebitNote = await DebitNote.find()
    let dbCreditNote = await CreditNote.find()
    let dbReceiptVoucher = await ReceiptVoucher.find()
    let dbPaymentVoucher = await PaymentVoucher.find()
    let dbExpensesVoucher = await Expenses.find()


    // Pass data to the page via props
    return {
        props: {
            dbJournalVoucher: JSON.parse(JSON.stringify(dbJournalVoucher)),
            dbContacts: JSON.parse(JSON.stringify(dbContacts)),

            dbCreditSalesInvoice: JSON.parse(JSON.stringify(dbCreditSalesInvoice)),
            dbSalesInvoice: JSON.parse(JSON.stringify(dbSalesInvoice)),
            dbPurchaseInvoice: JSON.parse(JSON.stringify(dbPurchaseInvoice)),
            dbDebitNote: JSON.parse(JSON.stringify(dbDebitNote)),
            dbCreditNote: JSON.parse(JSON.stringify(dbCreditNote)),
            dbReceiptVoucher: JSON.parse(JSON.stringify(dbReceiptVoucher)),
            dbPaymentVoucher: JSON.parse(JSON.stringify(dbPaymentVoucher)),
            dbExpensesVoucher: JSON.parse(JSON.stringify(dbExpensesVoucher)),
        }
    }
}

export default ContactTransactionSummary