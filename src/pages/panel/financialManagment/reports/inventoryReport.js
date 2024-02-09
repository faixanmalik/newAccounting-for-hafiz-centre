import React, { useEffect, useState } from 'react'
import mongoose from "mongoose";
import moment from 'moment/moment';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import JournalVoucher from 'models/JournalVoucher';
import Charts from 'models/Charts';
import { ProSidebarProvider } from 'react-pro-sidebar';
import FullLayout from '@/panel/layouts/FullLayout';
import CreditSalesInvoice from 'models/CreditSalesInvoice';
import SalesInvoice from 'models/SalesInvoice';
import PurchaseInvoice from 'models/PurchaseInvoice';
import DebitNote from 'models/DebitNote';
import CreditNote from 'models/CreditNote';
import ReceiptVoucher from 'models/ReceiptVoucher';
import PaymentVoucher from 'models/PaymentVoucher';
import Expenses from 'models/Expenses';
import Product from 'models/Product';
import { NavItem } from 'reactstrap';
import PaymentMethod from 'models/PaymentMethod';
import Head from 'next/head';

const InventoryReport = ({ userEmail, dbProducts, dbPurchaseInvoice, dbSalesInvoice, dbCreditSalesInvoice }) => {

  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [product, setProduct] = useState('')

  const [filteredProducts, setFilteredProducts] = useState([])

  const [openingStock, setOpeningStock] = useState([])
  const [purchaseStock, setPurchaseStock] = useState([])


  const [addedIds, setAddedIds] = useState(new Set());
  const [salesStock, setSalesStock] = useState([])

  const [newEntry, setNewEntry] = useState([])


  useEffect(() => {

    let filteredProducts = dbProducts.filter((item)=>{
    return item.userEmail === userEmail;
    })
    setFilteredProducts(filteredProducts)

  }, [userEmail])



  const handleChange = (e) => {
    if (e.target.name === 'fromDate') {
      setFromDate(e.target.value)
    }
    else if (e.target.name === 'toDate') {
      setToDate(e.target.value)
    }
    else if (e.target.name === 'product') {
      setProduct(e.target.value)
    }
  }




  const submit = (e)=>{
    e.preventDefault()
    let allVouchers = [];

    allVouchers = allVouchers.concat(dbProducts, dbPurchaseInvoice, dbSalesInvoice, dbCreditSalesInvoice);


    // Data filter
    const filteredOpeningStock = allVouchers.filter(data => {
      return data.userEmail === userEmail && data.type === 'Product' && data.name === product;
    });

    const filteredPurchaseStock = allVouchers
      .filter((data) => data.userEmail === userEmail && data.type === 'PurchaseInvoice')
      .map((obj) => ({
        id: obj._id,
        journalDate: obj.journalDate,
        inputList: obj.inputList.filter((item) => item.product === product)
      }))
      .sort((a, b) => new Date(a.journalDate) - new Date(b.journalDate));



    const filteredSalesStock = allVouchers
      .filter((data) => data.userEmail === userEmail && data.type === 'SalesInvoice')
      .map((obj) => ({
        id: obj._id,
        journalDate: obj.journalDate,
        inputList: obj.inputList.filter((item) => item.products === product)
      }))
      .sort((a, b) => new Date(a.journalDate) - new Date(b.journalDate));
    





    let combinedEntry = {};

    combinedEntry.opening = {
      id:filteredOpeningStock[0]._id,
      qty: parseInt(filteredOpeningStock[0].availableQty),
      rate: parseInt(filteredOpeningStock[0].costPrice),
      amount: parseInt(filteredOpeningStock[0].availableQty * filteredOpeningStock[0].costPrice)
    };


    combinedEntry.purchases = [].concat(...filteredPurchaseStock.map(purchase => {
      return purchase.inputList.map(item => ({
        id:purchase.id,
        qty: parseInt(item.qty),
        rate: parseInt(item.amount),
        amount: parseInt(item.totalAmountPerItem)
      }));
    }));


    combinedEntry.sales = [].concat(...filteredSalesStock.map(sale => {
      return sale.inputList.map(item => ({
        id:sale.id,
        qty: parseInt(item.qty),
        rate: parseInt(item.amount),
        amount: parseInt(item.totalAmountPerItem)
      }));
    }));


    let result = [];
    
    // Push the first entry with the opening details
    result.push({
      opening: combinedEntry.opening,
      purchases: combinedEntry.purchases[0],
      sales: combinedEntry.sales[0]
    });
    
    // Push the subsequent entries with null opening details
    for (let i = 1; i < Math.max(combinedEntry.purchases.length, combinedEntry.sales.length); i++) {
      let entry = {
        opening: {
          qty: null,
          rate: null,
          amount: null
        },
        purchases: combinedEntry.purchases[i] || null,
        sales: combinedEntry.sales[i] || null
      };
      result.push(entry);
    }

    setNewEntry(result)
  }





  // const submit = (e)=>{
  //   e.preventDefault()
  //   let allVouchers = [];

  //   allVouchers = allVouchers.concat(dbProducts, dbPurchaseInvoice, dbSalesInvoice, dbCreditSalesInvoice);

  //   // Data filter
  //   allVouchers.forEach((data) => {

  //     if(data.userEmail === userEmail) {

  //       if(data.type === 'Product' && data.name === product){
  //         setOpeningStock(data)
  //       }
  //       else if (data.type === 'PurchaseInvoice' && !addedIds.has(data.id)) {
  //         setPurchaseStock(prevPurchaseStock => [...prevPurchaseStock, data]);
  //         setAddedIds(prevIds => new Set(prevIds).add(data.id));
  //       }
  //       else if (data.type === 'SalesInvoice' && !addedIds.has(data.id)) {
  //         setSalesStock(prevSalesStock => [...prevSalesStock, data]);
  //         setAddedIds(prevIds => new Set(prevIds).add(data.id));
  //       }
  //       // else if(data.type === 'CreditSalesInvoice'){
  //       //     let journal = data.inputList.filter((newData)=>{

  //       //         let debitAmount = newData.totalAmountPerItem;
  //       //         let debitAccount = data.fromAccount;
  //       //         let creditAmount = newData.amount;
  //       //         let creditAccount = 'Sales';

  //       //         if(account === debitAccount || account === creditAccount){
  //       //             Object.assign(newData, {
  //       //                 coaAccount: account,
  //       //                 account: account,
  //       //                 debit: account === debitAccount ? parseInt(debitAmount) : 0,
  //       //                 debitAccount: account === debitAccount ? debitAccount : '',
  //       //                 credit: account === creditAccount ? parseInt(creditAmount) : 0,
  //       //                 creditAccount: account === creditAccount ? creditAccount : '',
  //       //             });

  //       //             if(fromDate && toDate){
  //       //                 let checkDbDate = data.journalDate? data.journalDate : data.date;
  //       //                 const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
  //       //                 if (dbDate >= fromDate && dbDate <= toDate) {
  //       //                     return newData;
  //       //                 }
  //       //             }
  //       //             else {
  //       //                 return newData;
  //       //             }
  //       //         }

  //       //     });
  //       //     dbAllEntries = dbAllEntries.concat(journal);
  //       // }
  //     }
  //   })

  //   let combinedEntry = {};

  //   combinedEntry.opening = {
  //     id:openingStock._id,
  //     qty: parseInt(openingStock.availableQty),
  //     rate: parseInt(openingStock.costPrice),
  //     amount: parseInt(openingStock.availableQty * openingStock.costPrice)
  //   };


  //   combinedEntry.purchases = [].concat(...purchaseStock.map(purchase => {
  //     return purchase.inputList.map(item => ({
  //       id:purchase._id,
  //       qty: parseInt(item.qty),
  //       rate: parseInt(item.amount),
  //       amount: parseInt(item.totalAmountPerItem)
  //     }));
  //   }));


  //   combinedEntry.sales = [].concat(...salesStock.map(sale => {
  //     return sale.inputList.map(item => ({
  //       id:sale._id,
  //       qty: parseInt(item.qty),
  //       rate: parseInt(item.amount),
  //       amount: parseInt(item.totalAmountPerItem)
  //     }));
  //   }));

      
  //   let result = [];
    
  //   // Push the first entry with the opening details
  //   result.push({
  //     opening: combinedEntry.opening,
  //     purchases: combinedEntry.purchases[0],
  //     sales: combinedEntry.sales[0]
  //   });
    
  //   // Push the subsequent entries with null opening details
  //   for (let i = 1; i < Math.max(combinedEntry.purchases.length, combinedEntry.sales.length); i++) {
  //     let entry = {
  //       opening: {
  //         qty: null,
  //         rate: null,
  //         amount: null
  //       },
  //       purchases: combinedEntry.purchases[i] || null,
  //       sales: combinedEntry.sales[i] || null
  //     };
  //     result.push(entry);
  //   }

  //   setNewEntry(result)
  // }
  

  


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
    <ToastContainer position="bottom-center" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />

    <div className='w-full'>
      <form>
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
                <label htmlFor="product" className="block text-sm font-medium text-gray-700">
                  Product:
                </label>
                <select id="product" name="product" onChange={handleChange} value={product} className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                  <option>select product</option>
                  {filteredProducts.map((item, index) => {
                    return <option key={index} value={item.name}>{item.name}</option>
                  })}
                </select>
              </div>
                <button onClick={(e)=>submit(e)} type='button' className='bg-blue-800 hover:bg-blue-900 text-white px-10 h-10 mt-4 rounded-lg'>Update</button>
            </div>
          </div>
        </div>
      </form>
    </div>

    <div className="md:grid md:grid-cols-1 md:gap-6">
      <div className="md:col-span-1">
        <div className="px-4 mt-4 sm:px-0 flex">
          <h3 className="text-lg mx-auto font-black tracking-wide leading-6 text-blue-800">Inventory Report</h3>
        </div>
      </div>
      <div className="md:col-span-2">
        <form method="POST">
          <div className="overflow-hidden shadow sm:rounded-md">

            <div className="overflow-x-auto shadow-sm">

              <div className='px-2 bg-gray-50'>

                <div className="grid grid-cols-4 gap-4 text-gray-700">
                  <div className="py-3 text-center text-blue-800 border-b-2 border-gray-300 text-base font-bold">Opening</div>
                  <div className="py-3 text-center text-blue-800 border-b-2 border-gray-300 text-base font-bold">Purchases</div>
                  <div className="py-3 text-center text-blue-800 border-b-2 border-gray-300 text-base font-bold">Sales</div>
                  <div className="py-3 text-center text-blue-800 border-b-2 border-gray-300 text-base font-bold">Balance</div>
                </div>
                <div className="grid grid-cols-12 pl-0 pb-3 pt-2 gap-1 text-gray-700 bg-gray-50">
                  <div className="font-bold">Qty</div>
                  <div className="font-bold">Rate</div>
                  <div className="font-bold">Amount</div>

                  <div className="font-bold pl-1">Qty</div>
                  <div className="font-bold">Rate</div>
                  <div className="font-bold">Amount</div>

                  <div className="font-bold pl-2">Qty</div>
                  <div className="font-bold">Rate</div>
                  <div className="font-bold">Amount</div>

                  <div className="font-bold pl-3 text-blue-800">Qty</div>
                  <div className="font-bold text-blue-800">Rate</div>
                  <div className="font-bold text-blue-800">Amount</div>
                </div>
              </div>

              {newEntry.map((item, index)=>{
                
                let openingItems = item.opening;
                let purchasesItems = item.purchases;
                let salesItems = item.sales;

                return <div key={index} className="px-2 text-sm grid bg-white border-b hover:bg-gray-50 grid-cols-12 pl-0 gap-1 text-gray-700">

                <div className="py-3">{openingItems?.qty}</div>
                <div className="py-3">{openingItems?.rate}</div>
                <div className="py-3">{openingItems?.amount}</div>

                <div className="pl-1 py-3">{purchasesItems?.qty}</div>
                <div className="py-3">{purchasesItems?.rate}</div>
                <div className="py-3">{purchasesItems?.amount}</div>

                <div className="py-3 pl-2">{salesItems?.qty}</div>
                <div className="py-3">{salesItems?.rate}</div>
                <div className="py-3">{salesItems?.amount}</div>

                <div className="py-3 pl-3 text-blue-800">Qty</div>
                <div className="py-3 text-blue-800">Rate</div>
                <div className="py-3 text-blue-800">Amount</div>

              </div>
              })}

              {/* <div className='w-full'>

                <div className="grid grid-cols-4 gap-4 text-gray-700">
                  <div className="py-3 text-center text-blue-800 border-b-2 border-gray-300 text-base font-bold">Opening</div>
                  <div className="py-3 text-center text-blue-800 border-b-2 border-gray-300 text-base font-bold">Purchases</div>
                  <div className="py-3 text-center text-blue-800 border-b-2 border-gray-300 text-base font-bold">Sales</div>
                  <div className="py-3 text-center text-blue-800 border-b-2 border-gray-300 text-base font-bold">Balance</div>
                </div>

                <div className='flex mx-auto w-full font-semibold text-lg'> 

                  <table className="w-full text-sm text-left text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="p-3 pl-2">Qty</th>
                        <th scope="col" className="p-3">Rate</th>
                        <th scope="col" className="p-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="p-3 pl-2">100</td>
                        <td className="p-3">200</td>
                        <td className="p-3">300</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <table className="w-full text-sm text-left text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="p-3">Qty</th>
                        <th scope="col" className="p-3">Rate</th>
                        <th scope="col" className="p-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="p-3">100</td>
                        <td className="p-3">200</td>
                        <td className="p-3">300</td>
                      </tr>
                    </tbody>
                  </table>


                  <table className="w-full text-sm text-left text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="p-3">Qty</th>
                        <th scope="col" className="p-3">Rate</th>
                        <th scope="col" className="p-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="p-3">100</td>
                        <td className="p-3">200</td>
                        <td className="p-3">300</td>
                      </tr>
                    </tbody>
                  </table>

                  <table className="w-full text-sm text-left text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="p-3">Qty</th>
                        <th scope="col" className="p-3">Rate</th>
                        <th scope="col" className="p-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b hover:bg-gray-50">
                        <td className="p-3">100</td>
                        <td className="p-3">200</td>
                        <td className="p-3">300</td>
                      </tr>
                    </tbody>
                  </table>

                  

                </div>

              </div> */}

              {/* { newEntry.length === 0  ? <h1 className='text-red-600 text-center text-base my-3'>No data found!</h1> : ''} */}
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
  let dbCharts = await Charts.find()
  let dbCreditSalesInvoice = await CreditSalesInvoice.find()
  let dbSalesInvoice = await SalesInvoice.find()
  let dbPurchaseInvoice = await PurchaseInvoice.find()
  let dbDebitNote = await DebitNote.find()
  let dbCreditNote = await CreditNote.find()
  let dbReceiptVoucher = await ReceiptVoucher.find()
  let dbPaymentVoucher = await PaymentVoucher.find()
  let dbExpensesVoucher = await Expenses.find()
  let dbProducts = await Product.find()
  let dbPaymentMethod = await PaymentMethod.find()

  // Pass data to the page via props
  return {
    props: {
      dbJournalVoucher: JSON.parse(JSON.stringify(dbJournalVoucher)),
      dbCharts: JSON.parse(JSON.stringify(dbCharts)),
      dbCreditSalesInvoice: JSON.parse(JSON.stringify(dbCreditSalesInvoice)),
      dbSalesInvoice: JSON.parse(JSON.stringify(dbSalesInvoice)),
      dbPurchaseInvoice: JSON.parse(JSON.stringify(dbPurchaseInvoice)),
      dbDebitNote: JSON.parse(JSON.stringify(dbDebitNote)),
      dbCreditNote: JSON.parse(JSON.stringify(dbCreditNote)),
      dbReceiptVoucher: JSON.parse(JSON.stringify(dbReceiptVoucher)),
      dbPaymentVoucher: JSON.parse(JSON.stringify(dbPaymentVoucher)),
      dbExpensesVoucher: JSON.parse(JSON.stringify(dbExpensesVoucher)),
      dbProducts: JSON.parse(JSON.stringify(dbProducts)),
      dbPaymentMethod: JSON.parse(JSON.stringify(dbPaymentMethod)),
    }
  }
}

export default InventoryReport