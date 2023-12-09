import React, { useEffect, useState } from 'react'
import mongoose from "mongoose";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import JournalVoucher from 'models/JournalVoucher';
import Charts from 'models/Charts';
import moment from 'moment';
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
import PaymentMethod from 'models/PaymentMethod';
import Head from 'next/head';


const ProfitAndLoss = ({ userEmail, dbPaymentMethod, dbProducts, dbExpensesVoucher, dbPaymentVoucher, dbReceiptVoucher, dbDebitNote, dbCreditNote, dbPurchaseInvoice, dbSalesInvoice, dbCreditSalesInvoice, dbJournalVoucher, dbCharts  }) => {

    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')

    const [grossProfit, setGrossProfit] = useState(0);
    const [profitFromOperations, setProfitFromOperations] = useState(0)
    const [profitBeforeTax, setProfitBeforeTax] = useState(0)
    
    const [fDate, setFDate] = useState('')
    const [tDate, setTDate] = useState('')

    const [filteredCharts, setFilteredCharts] = useState([])
    const [sortedDbCharts, setSortedDbCharts] = useState([])
    

    useEffect(() => {
        submit()
    }, [])

    useEffect(() => {

        let filteredCharts = dbCharts.filter((item)=>{
        return item.userEmail === userEmail;
        })
        setFilteredCharts(filteredCharts)
    
    }, [userEmail])
    

    let balance = [];
    const submit = ()=>{

        if(fromDate && toDate){
            setFDate(moment(fromDate).format('D MMM YYYY'))
            setTDate(moment(toDate).format('D MMM YYYY'))
        }


        filteredCharts.forEach(element => {

            let dbAllEntries = [];
            let allVouchers = [];
    
            let account = element.accountName;
    
            allVouchers = allVouchers.concat(dbProducts, dbExpensesVoucher, dbPaymentVoucher, dbReceiptVoucher, dbDebitNote, dbCreditNote, dbPurchaseInvoice, dbSalesInvoice, dbCreditSalesInvoice, dbJournalVoucher);
    
            // Data filter
            const dbAll = allVouchers.filter((data) => {             
    
                if(data.userEmail === userEmail) {
    
                    if(data.type === 'Product'){
                        let calculateDebitAmount = data.availableQty * data.costPrice;
                        let debitAmount = calculateDebitAmount;
                        let creditAmount = 0;
                        let debitAccount = 'Stock';
                        let creditAccount = '';
    
                        // if(account === debitAccount || account === creditAccount){
                        //     Object.assign(data, {
                        //         coaAccount: account,
                        //         journalNo: data.code,
                        //         product: data.name,
                        //         debit: account === debitAccount ? parseInt(debitAmount) : 0,
                        //         debitAccount: account === debitAccount ? debitAccount : '',
                        //         credit: account === creditAccount ? parseInt(creditAmount) : 0,
                        //         creditAccount: account === creditAccount ? creditAccount : '',
                        //     });
    
                        //     if(fromDate && toDate){
                        //         let checkDbDate = data.journalDate? data.journalDate : data.date;
                        //         const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                        //         if (dbDate >= fromDate && dbDate <= toDate) {
                        //             return data;
                        //         }
                        //     }
                        //     else {
                        //         return data;
                        //     }
                        // }
    
                    }
                    else if(data.type === 'PurchaseInvoice'){
                        let journal = data.inputList.filter((newData)=>{
                            
                            let debitAmount = newData.totalAmountPerItem;
                            let creditAmount = newData.amount;
                            let debitAccount = 'Purchases';
                            let creditAccount = 'Accounts Payable';
        
                            if(account === debitAccount || account === creditAccount){
                                Object.assign(newData, {
                                    coaAccount: account,
                                    debit: account === debitAccount ? parseInt(debitAmount) : 0,
                                    debitAccount: account === debitAccount ? debitAccount : '',
                                    credit: account === creditAccount ? parseInt(creditAmount) : 0,
                                    creditAccount: account === creditAccount ? creditAccount : '',
                                });
        
                                if(fromDate && toDate){
                                    let checkDbDate = data.journalDate? data.journalDate : data.date;
                                    const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                                    if (dbDate >= fromDate && dbDate <= toDate) {
                                        return newData;
                                    }
                                }
                                else {
                                    return newData;
                                }
                            }
                        })
                        dbAllEntries = dbAllEntries.concat(journal);
                    }
                    else if(data.type === 'ReceiptVoucher'){
                        
                        let journal = data.inputList.filter((newData)=>{
        
                            let dbAccount = newData.paidBy;
                            let dbFromAccount = dbPaymentMethod.filter((item)=>{
                                return item.chartsOfAccount === account && item.paymentType === dbAccount;
                            });
        
                            let linkedAccountCOA;
        
                            if (dbFromAccount.length > 0) {
                                linkedAccountCOA = dbFromAccount[0].chartsOfAccount;
                            }
        
                            let debitAmount = newData.paid;
                            let creditAmount = newData.paid;
                            let debitAccount = linkedAccountCOA;
                            let creditAccount = 'Accounts Receivable';
        
                            if(account === debitAccount || account === creditAccount){
                                Object.assign(newData, {
                                    coaAccount: account,
                                    account: account,
                                    debit: account === debitAccount ? parseInt(debitAmount) : 0,
                                    debitAccount: account === debitAccount ? debitAccount : '',
                                    credit: account === creditAccount ? parseInt(creditAmount) : 0,
                                    creditAccount: account === creditAccount ? creditAccount : '',
                                });
        
                                if(fromDate && toDate){
                                    let checkDbDate = data.journalDate? data.journalDate : data.date;
                                    const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                                    if (dbDate >= fromDate && dbDate <= toDate) {
                                        return newData;
                                    }
                                }
                                else {
                                    return newData;
                                }
                            }
                        })
                        dbAllEntries = dbAllEntries.concat(journal);
                    }
                    else if(data.type === 'PaymentVoucher'){
        
                        let dbAccount = data.fromAccount;
                        let dbFromAccount = dbPaymentMethod.filter((item)=>{
                            return item.chartsOfAccount === account && item.paymentType === dbAccount;
                        });
    
                        
        
                        let linkedAccountCOA;
        
                        if (dbFromAccount.length > 0) {
                            linkedAccountCOA = dbFromAccount[0].chartsOfAccount;
                        }
        
                        let debitAmount = data.totalPaid;
                        let debitAccount = 'Accounts Payable';
                        let creditAmount = data.totalPaid;
                        let creditAccount = linkedAccountCOA;
        
                        if(account === debitAccount || account === creditAccount){
                            Object.assign(data, {
                                coaAccount: account,
                                account: account,
                                debit: account === debitAccount ? parseInt(debitAmount) : 0,
                                debitAccount: account === debitAccount ? debitAccount : '',
                                credit: account === creditAccount ? parseInt(creditAmount) : 0,
                                creditAccount: account === creditAccount ? creditAccount : '',
                            });
        
                            if(fromDate && toDate){
                                let checkDbDate = data.journalDate? data.journalDate : data.date;
                                const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                                if (dbDate >= fromDate && dbDate <= toDate) {
                                    return data;
                                }
                            }
                            else {
                                return data;
                            }
                        }
                    }
                    else if(data.type === 'DebitNote'){
                        
                        let journal = data.inputList.filter((newData)=>{
        
                            let debitAmount = newData.amount;
                            let creditAmount = newData.totalAmountPerItem;
                            let debitAccount = 'Accounts Payable';
                            let creditAccount = 'Purchase Return';
        
                            if(account === debitAccount || account === creditAccount){
                                Object.assign(newData, {
                                    coaAccount: account,
                                    account: account,
                                    debit: account === debitAccount ? parseInt(debitAmount) : 0,
                                    debitAccount: account === debitAccount ? debitAccount : '',
                                    credit: account === creditAccount ? parseInt(creditAmount) : 0,
                                    creditAccount: account === creditAccount ? creditAccount : '',
                                });
        
                                if(fromDate && toDate){
                                    let checkDbDate = data.journalDate? data.journalDate : data.date;
                                    const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                                    if (dbDate >= fromDate && dbDate <= toDate) {
                                        return newData;
                                    }
                                }
                                else {
                                    return newData;
                                }
                            }
                        })
                        dbAllEntries = dbAllEntries.concat(journal);
                        
                    }
                    else if(data.type === 'CreditNote'){
                        let debitAmount = data.fullAmount;
                        let creditAmount = data.totalAmount;
                        let debitAccount = 'Sales Return';
                        let creditAccount = 'Accounts Receivable';
        
                        if(account === debitAccount || account === creditAccount){
                            Object.assign(data, {
                                coaAccount: account,
                                account: account,
                                debit: account === debitAccount ? parseInt(debitAmount) : 0,
                                debitAccount: account === debitAccount ? debitAccount : '',
                                credit: account === creditAccount ? parseInt(creditAmount) : 0,
                                creditAccount: account === creditAccount ? creditAccount : '',
                            });
        
                            if(fromDate && toDate){
                                let checkDbDate = data.journalDate? data.journalDate : data.date;
                                const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                                if (dbDate >= fromDate && dbDate <= toDate) {
                                    return data;
                                }
                            }
                            else {
                                return data;
                            }
                        }
                    }
                    else if(data.type === 'Expenses'){
                        let journal = data.inputList.filter((newData)=>{
        
        
                            let dbAccount = data.paidBy;
                            let dbFromAccount = dbPaymentMethod.filter((item)=>{
                                return item.chartsOfAccount === account && item.paymentType === dbAccount;
                            });
        
                            let linkedAccountCOA;
        
                            if (dbFromAccount.length > 0) {
                                linkedAccountCOA = dbFromAccount[0].chartsOfAccount;
                            }
        
        
        
                            let debitAmount = newData.totalAmountPerItem;
                            let debitAccount = newData.accounts;
                            let creditAmount = newData.amount;
                            let creditAccount = linkedAccountCOA;
                            
                            if(account === debitAccount || account === creditAccount){
                                Object.assign(newData, {
                                    coaAccount: account,
                                    account: account,
                                    debit: account === debitAccount ? parseInt(debitAmount) : 0,
                                    debitAccount: account === debitAccount ? debitAccount : '',
                                    credit: account === creditAccount ? parseInt(creditAmount) : 0,
                                    creditAccount: account === creditAccount ? creditAccount : '',
                                });
        
                                if(fromDate && toDate){
                                    let checkDbDate = data.journalDate? data.journalDate : data.date;
                                    const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                                    if (dbDate >= fromDate && dbDate <= toDate) {
                                        return newData;
                                    }
                                }
                                else {
                                    return newData;
                                }
                            }
                        })
                        dbAllEntries = dbAllEntries.concat(journal);
                    }
                    else if(data.type === 'SalesInvoice'){
                        let journal = data.inputList.filter((newData)=>{
                            
                            let dbAccount = data.fromAccount;
                            let dbFromAccount = dbPaymentMethod.filter((item)=>{
                                return item.chartsOfAccount === account && item.paymentType === dbAccount;
                            });
    
                            let linkedAccountCOA;
    
                            if (dbFromAccount.length > 0) {
                                linkedAccountCOA = dbFromAccount[0].chartsOfAccount;
                            }
                            
                            let debitAmount = newData.totalAmountPerItem;
                            let debitAccount = linkedAccountCOA;
                            
                            let creditAmount = newData.amount;
                            let creditAccount = 'Sales';
                            
                            if(account === debitAccount || account === creditAccount){
    
                                Object.assign(newData, {
                                    coaAccount: account,
                                    account: account,
                                    debit: account === debitAccount ? parseInt(debitAmount) : 0,
                                    debitAccount: account === debitAccount ? debitAccount : '',
                                    credit: account === creditAccount ? parseInt(creditAmount) : 0,
                                    creditAccount: account === creditAccount ? creditAccount : '',
                                });
    
                                
                                if(fromDate && toDate){
                                    let checkDbDate = data.journalDate? data.journalDate : data.date;
                                    const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                                    if (dbDate >= fromDate && dbDate <= toDate) {
                                        return newData;
                                    }
                                }
                                else {
                                    return newData;
                                }
                            }
                        })
                        dbAllEntries = dbAllEntries.concat(journal);
                    }
                    else if(data.type === 'CreditSalesInvoice'){
                        let journal = data.inputList.filter((newData)=>{
        
                            let debitAmount = newData.totalAmountPerItem;
                            let debitAccount = data.fromAccount;
                            let creditAmount = newData.amount;
                            let creditAccount = 'Sales';
        
                            if(account === debitAccount || account === creditAccount){
                                Object.assign(newData, {
                                    coaAccount: account,
                                    account: account,
                                    debit: account === debitAccount ? parseInt(debitAmount) : 0,
                                    debitAccount: account === debitAccount ? debitAccount : '',
                                    credit: account === creditAccount ? parseInt(creditAmount) : 0,
                                    creditAccount: account === creditAccount ? creditAccount : '',
                                });
        
                                if(fromDate && toDate){
                                    let checkDbDate = data.journalDate? data.journalDate : data.date;
                                    const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                                    if (dbDate >= fromDate && dbDate <= toDate) {
                                        return newData;
                                    }
                                }
                                else {
                                    return newData;
                                }
                            }
        
                        });
                        dbAllEntries = dbAllEntries.concat(journal);
                    }
                    else{
                        let journal = data.inputList.filter((newData)=>{
        
                            let debitAmount = newData.debit && newData.debit;
                            let debitAccount = newData.debit && newData.account;
                            
                            let creditAmount = newData.credit && newData.credit;
                            let creditAccount = newData.credit && newData.account;
        
                            
                            if(account === debitAccount || account === creditAccount){
        
                                Object.assign(newData, {
                                    coaAccount: account,
                                    account: account,
                                    debit: account === debitAccount ? parseInt(debitAmount) : 0,
                                    debitAccount: account === debitAccount ? debitAccount : '',
                                    credit: account === creditAccount ? parseInt(creditAmount) : 0,
                                    creditAccount: account === creditAccount ? creditAccount : '',
                                });
        
                                if(fromDate && toDate){
                                    let checkDbDate = data.journalDate? data.journalDate : data.date;
                                    const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                                    if (dbDate >= fromDate && dbDate <= toDate) {
                                        return newData;
                                    }
                                }
                                else {
                                    return newData;
                                }
                            }
        
                        });
                        dbAllEntries = dbAllEntries.concat(journal);
                    }
    
                    if(data.fullTax > 0){
                        if(data.type === 'CreditNote' || data.type === 'DebitNote'){
                            let debitAmount = data.fullTax;
                            let debitAccount = 'Tax Payable';
                            let creditAmount = 0;
                            let creditAccount = 'Tax Payable';
    
                            if(account === debitAccount || account === creditAccount){
                                Object.assign(data, {
                                    coaAccount: account,
                                    account: account,
                                    debit: account === debitAccount ? parseInt(debitAmount) : 0,
                                    debitAccount: account === debitAccount ? debitAccount : '',
                                    credit: account === creditAccount ? parseInt(creditAmount) : 0,
                                    creditAccount: account === creditAccount ? creditAccount : '',
                                });
    
                                if(fromDate && toDate){
                                    let checkDbDate = data.journalDate? data.journalDate : data.date;
                                    const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                                    if (dbDate >= fromDate && dbDate <= toDate) {
                                        return data;
                                    }
                                }
                                else {
                                    return data;
                                }
                            }
                        }
                        else if(account !== null && account !== ""){
                            let debitAmount = 0;
                            let debitAccount = 'Tax Payable';
                            let creditAmount = data.fullTax;
                            let creditAccount = 'Tax Payable';
    
                            if(account === debitAccount || account === creditAccount){
                                Object.assign(data, {
                                    coaAccount: account,
                                    account: account,
                                    debit: account === debitAccount ? parseInt(debitAmount) : 0,
                                    debitAccount: account === debitAccount ? debitAccount : '',
                                    credit: account === creditAccount ? parseInt(creditAmount) : 0,
                                    creditAccount: account === creditAccount ? creditAccount : '',
                                });
                                if(fromDate && toDate){
                                    let checkDbDate = data.journalDate? data.journalDate : data.date;
                                    const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                                    if (dbDate >= fromDate && dbDate <= toDate) {
                                        return data;
                                    }
                                }
                                else {
                                    return data;
                                }
                            }
    
                        }
    
                    }
                    if(data.discount > 0){
                        
                        let debitAmount = data.discount;
                        let debitAccount = 'Sales Discount';
                        let creditAmount = 0;
                        let creditAccount = 'Sales Discount';
    
                        if(account === debitAccount || account === creditAccount){
                            Object.assign(data, {
                                coaAccount: account,
                                account: account,
                                debit: account === debitAccount ? parseInt(debitAmount) : 0,
                                debitAccount: account === debitAccount ? debitAccount : '',
                                credit: account === creditAccount ? parseInt(creditAmount) : 0,
                                creditAccount: account === creditAccount ? creditAccount : '',
                            });
    
                            if(fromDate && toDate){
                                let checkDbDate = data.journalDate? data.journalDate : data.date;
                                const dbDate = moment(checkDbDate).format('YYYY-MM-DD')
                                if (dbDate >= fromDate && dbDate <= toDate) {
                                    return data;
                                }
                            }
                            else {
                                return data;
                            }
                        }
                    }
                }
            })
    
            dbAllEntries = dbAllEntries.concat(dbAll);
    
            
            // Date filter
            dbAllEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
              
    
            // Balance
            let result = [];
            if(dbAllEntries.length > 0){
                const initalCreditEntry = parseInt(dbAllEntries[0].credit);
                let initialBalance = initalCreditEntry;
                
                for (let index = 0; index < dbAllEntries.length; index++) {
    
                    const currentCreditEntry = parseInt(dbAllEntries[index].credit);
                    const currentDebitEntry = parseInt(dbAllEntries[index].debit);
                    
                    if(index <= 0){
                        let totalBalance;
    
                        if(element.account === 'Incomes' || element.account === 'Equity' || element.account === 'Liabilities'){
                            totalBalance = currentCreditEntry - currentDebitEntry;
                        }
                        else{
                            totalBalance = currentDebitEntry - currentCreditEntry;
                        }
    
                        initialBalance = totalBalance;
                        result.push(totalBalance)
                    }
                    else{
                        let totalBalance;
                        if(element.account === 'Incomes' || element.account === 'Equity' || element.account === 'Liabilities'){
                            totalBalance = initialBalance + currentCreditEntry - currentDebitEntry;
                        }
                        else{
                            totalBalance = initialBalance + currentDebitEntry - currentCreditEntry;
                        }
                        
                        initialBalance = totalBalance;
                        result.push(totalBalance);
                    }
                }
            }
    
            balance.push(result);
        });

        
        
        ProfitLossBalance()
        
        filteredCharts.forEach((element, index) => {
            if(element.accountName === 'Sales Return' || element.accountName === 'Sales Discount' || element.accountName === 'Purchase Return'){
                let number = balance[index][balance[index].length-1]
                if(number){
                    let convertIntoNegative = number * -1;
                    Object.assign(element, {
                        pnlBalance: convertIntoNegative ? convertIntoNegative : 0,
                    });
                }
                else{
                    let convertIntoNegative = 0 * -1;
                    Object.assign(element, {
                        pnlBalance: convertIntoNegative ? convertIntoNegative : 0,
                    });
                }
            }
            else{
                Object.assign(element, {
                    pnlBalance: balance[index][balance[index].length-1] ? balance[index][balance[index].length-1] : 0,
                });
            }
        });

        const nameOrder = ['Revenue', 'Other Income', 'Discount', 'Cost of sales', 'Administration Expenses', 'Distribution Expenses', 'Finance Cost'];
        const sortedAndFilteredDbCharts = filteredCharts
        .filter(item => nameOrder.includes(item.subAccount))
        .sort((a, b) => nameOrder.indexOf(a.subAccount) - nameOrder.indexOf(b.subAccount));

        setSortedDbCharts(sortedAndFilteredDbCharts)
    }

    
    const ProfitLossBalance = async()=>{
            
        let administrationArray = [];
        let salesArray = [];
        let discountArray = [];
        let costOfGoodsSoldArray = [];
        let distributionExpensesArray = [];
        let financeCostArray = [];

        {filteredCharts.map((item,index) => {
            if(item.subAccount === 'Revenue' || item.subAccount === 'Other Income'){
                let sales = balance[index] && balance[index][balance[index].length-1]
                if(sales){
                    salesArray.push(sales)
                }
                else{
                    salesArray.push(0)
                }
            }
            if(item.subAccount === 'Discount'){
                let discount = balance[index] && balance[index][balance[index].length-1]
                if(discount){
                    discountArray.push(discount)
                }
                else{
                    discountArray.push(0)
                }
            }
            else if(item.subAccount === 'Cost of sales'){
                let costOfGoodsSold = balance[index] && balance[index][balance[index].length-1]
                if(costOfGoodsSold){
                    costOfGoodsSoldArray.push(costOfGoodsSold)
                }
                else{
                    costOfGoodsSoldArray.push(0)
                }
            }
            else if(item.subAccount === 'Administration Expenses'){
                let administrationExpenses = balance[index] && balance[index][balance[index].length-1]
                if(administrationExpenses){
                    administrationArray.push(administrationExpenses)
                }
                else{
                    administrationArray.push(0)
                }
            }
            else if(item.subAccount === 'Distribution Expenses'){
                let distributionExpenses = balance[index] && balance[index][balance[index].length-1]
                if(distributionExpenses){
                    distributionExpensesArray.push(distributionExpenses)
                }
                else{
                    distributionExpensesArray.push(0)
                }
            }
            else if(item.subAccount === 'Finance Cost'){
                let financeCost = balance[index] && balance[index][balance[index].length-1]
                if(financeCost){
                    financeCostArray.push(financeCost)
                }
                else{
                    financeCostArray.push(0)
                }
            }
        })
        
    
        

        // individual Calculate
        let salesSum = 0;
        salesArray.forEach(element => {
            salesSum += parseInt(element)
        });

        let costOfGoodsSoldSum = 0;
        costOfGoodsSoldArray.forEach(element => {
            costOfGoodsSoldSum += parseInt(element)
        });

        let discountSum = 0;
        discountArray.forEach(element => {
            discountSum += parseInt(element)
        });

        let administrationSum = 0;
        administrationArray.forEach(element => {
            administrationSum += parseInt(element)
        });

        let distributionSum = 0;
        distributionExpensesArray.forEach(element => {
            distributionSum += parseInt(element)
        });


        let financeCostSum = 0;
        financeCostArray.forEach(element => {
            financeCostSum += parseInt(element)
        });

        // Total calculate
        let sales = parseInt(salesSum)
        let discount = parseInt(costOfGoodsSoldSum) + parseInt(discountSum)
        setGrossProfit(sales - discount)

        let expenses =  parseInt(administrationSum) + parseInt(distributionSum)
        setProfitFromOperations( (sales - discount) - expenses)
        
        setProfitBeforeTax( ( sales - discount) -
        expenses - parseInt(financeCostSum) )
        
    }}



    const handleChange = (e) => {
        if (e.target.name === 'fromDate') {
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
    <Head>
      <title>{process.env.NEXT_PUBLIC_BRANDNAME}</title>
      <meta name="description" content="Generated by erp system" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    {/* React tostify */}
    <ToastContainer position="bottom-center" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />

    <div className='w-full'>
        <form method="POST">
            <div className="overflow-idden shadow sm:rounded-md">
                <div className="bg-white px-4 sm:p-3">
                    <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-2">
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
                        <div className="col-span-6 sm:col-span-2">
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
                        <button onClick={submit} type='button' className='bg-blue-800 hover:bg-blue-900 text-white px-10 h-10 mt-4 rounded-lg'>Update</button>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <div className="md:grid md:grid-cols-1 md:gap-6">
        <div className="md:col-span-1">
            <div className="px-4 mt-4 sm:px-0 flex">
                <h3 className="text-lg mx-auto font-black tracking-wide leading-6 text-blue-800">
                    Profit & Loss Summary
                    {fDate && tDate &&
                        <span className='text-sm ml-1'>({fDate} to {tDate})</span>
                    }
                </h3>
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
                                        Account Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Account
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Amount
                                    </th>
                                </tr>
                            </thead>


                    
                            
                            {/* All Vouchers */}
                            {sortedDbCharts.map((item,index) => {

                                const administrationIndex = sortedDbCharts.findIndex((obj) => obj.subAccount === 'Administration Expenses');
                                const financeIndex = sortedDbCharts.findIndex((obj) => obj.subAccount === 'Finance Cost');

                                let lastIndex = -1;

                                for (let i = sortedDbCharts.length - 1; i >= 0; i--) {
                                    if (sortedDbCharts[i].subAccount === 'Finance Cost') {
                                        lastIndex = i;
                                        break;
                                    }
                                }
                                
                            return <tbody key={index}>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-3 font-semibold">
                                        {item.accountName}
                                    </td>
                                    <td className="px-6 py-3 text-black font-semibold">
                                        {item.subAccount}
                                    </td>
                                    {item.pnlBalance > 0 
                                    ? <td className="px-6 py-3 text-blue-700 font-bold">
                                        {item.pnlBalance}
                                    </td>
                                    : <td className="px-6 py-3 text-red-700 font-bold">
                                        {item.pnlBalance}
                                    </td>
                                    }
                                </tr>

                            
                                {index === administrationIndex - 1
                                ? <tr className="flex float-right -mr-96 bg-slate-100 px-4 py-3 sm:px-6">
                                    <td className={`text-sm font-bold ${grossProfit > 0 ? 'text-green-700' : 'text-red-700' } -mr-32`}>Gross {grossProfit > 0 ? 'Profit' : 'loss'}:
                                        <span className='font-bold ml-1'>${ grossProfit.toLocaleString() }</span>
                                    </td>
                                </tr>: ''}


                                {index === financeIndex - 1
                                ? <tr className="flex float-right -mr-96 bg-slate-100 px-4 py-3 sm:px-6">
                                    <td className={`text-sm font-bold ${profitFromOperations > 0 ? 'text-green-700' : 'text-red-700' } -mr-32`}>{profitFromOperations > 0 ? 'Profit' : 'loss'} From Operations:
                                        <span className='font-bold ml-1'>${ profitFromOperations.toLocaleString() }</span>
                                    </td>
                                </tr>: ''}


                                {index === lastIndex
                                ? <tr className="flex float-right -mr-96 bg-slate-100 px-4 py-3 sm:px-6">
                                    <td className={`text-sm font-bold ${profitBeforeTax > 0 ? 'text-green-700' : 'text-red-700'  } -mr-32`}>Net {profitBeforeTax > 0 ? 'Profit' : 'loss'}:
                                        <span className='font-bold ml-1'>${ profitBeforeTax.toLocaleString() }</span>
                                    </td>
                                </tr>: ''}

                            </tbody>
                            })}

                        </table>

                        { sortedDbCharts.length === 0  ? <h1 className='text-red-600 text-center text-base my-3'>No data found!</h1> : ''}
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

export default ProfitAndLoss