// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Contact from 'models/Contact';
import Charts from '../../../models/Charts'
import moment from 'moment';
import Product from 'models/Product';
import BankAccount from 'models/BankAccount';
import JournalVoucher from 'models/JournalVoucher';
import Employees from 'models/Employees';
import Role from 'models/Role';
import CreditSalesInvoice from 'models/CreditSalesInvoice';
import PurchaseInvoice from 'models/PurchaseInvoice';
import TaxRate from 'models/TaxRate';
import DebitNote from 'models/DebitNote';
import CreditNote from 'models/CreditNote';
import SalesInvoice from 'models/SalesInvoice';
import Expenses from 'models/Expenses';
import PaymentMethod from 'models/PaymentMethod';
import User from 'models/User';


export default async function handler(req, res) {

    if (req.method == 'POST'){

        const { path } = req.body;
        
        if(path === 'chartsOfAccounts'){

            const { accountCode, accountName, account, balance , asof, desc, subAccount } = req.body;

            let dbChart = await Charts.findOne({"accountCode": accountCode})
        

            if(dbChart){
                if( accountName == dbChart.accountName && account == dbChart.account && balance == dbChart.balance && desc == dbChart.desc &&  subAccount == dbChart.subAccount){
                        res.status(400).json({ success: false, message: "Already In Charts of accounts!" }) 
                    }
                    else{
                        let editChart =  await Charts.findOneAndUpdate({accountCode: dbChart.accountCode}, {accountName : accountName , account : account , balance : balance , asof : asof , desc : desc , subAccount : subAccount})
                        res.status(200).json({ success: true, message: "Update Successfully!", editChart }) 
                    }
                }
            else{
                res.status(400).json({ success: false, message: "Cannot change Account Code!" }) 
            }
        }
        else if (path === 'contactList'){

            const { id, name, type,  email, phoneNo, country, streetAddress, city, state, zip,
                 taxRigNo, paymentMethod, terms , openingBalance, date  } = req.body;

            let dbContact = await Contact.findById(id)

            if(dbContact){
                if( name === dbContact.name && type === dbContact.type && email === dbContact.email &&  phoneNo === dbContact.phoneNo &&  country === dbContact.country &&  streetAddress === dbContact.streetAddress && city === dbContact.city && state === dbContact.state && zip === dbContact.zip && taxRigNo === dbContact.taxRigNo && paymentMethod === dbContact.paymentMethod && terms === dbContact.terms && openingBalance === dbContact.openingBalance){
                    res.status(400).json({ success: false, message: "Already In Charts of accounts!" }) 
                }
                else{
                    let editContact =  await Contact.findByIdAndUpdate(id, {name : name , type : type , email : email ,phoneNo : phoneNo , country : country , streetAddress : streetAddress, city : city , state : state , zip : zip, taxRigNo : taxRigNo , paymentMethod : paymentMethod , terms : terms, openingBalance : openingBalance, date: date })
                    res.status(200).json({ success: true, message: "Update Successfully!", editContact }) 
                }
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }
        else if (path === 'productAndServices'){
            const { id, code, name, linkAccount, desc } = req.body;
            let dbProduct = await Product.findById(id)

            if(dbProduct){
                if( code === dbProduct.code && name === dbProduct.name && linkAccount === dbProduct.linkAccount && desc === dbProduct.desc ){
                    res.status(400).json({ success: false, message: "Already found!" }) 
                }
                else{
                    let editProduct =  await Product.findByIdAndUpdate(id, { code: code, name: name, linkAccount: linkAccount, desc:desc})
                    res.status(200).json({ success: true, message: "Update Successfully!", editProduct }) 
                }
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }
        else if (path === 'bankAccount'){
            const { id,  bankBranch, accountNo, accountType, accountDesc, accountTitle, 
                chartsOfAccount,  borrowingLimit } = req.body;
            let dbBank = await BankAccount.findById(id)

            if(dbBank){
                if( bankBranch === dbBank.bankBranch && accountNo === dbBank.accountNo && accountType === dbBank.accountType && accountDesc === dbBank.accountDesc && accountTitle === dbBank.accountTitle && chartsOfAccount === dbBank.chartsOfAccount && borrowingLimit === dbBank.borrowingLimit ){

                    res.status(400).json({ success: false, message: "Already found!" }) 
                }
                else{
                    await BankAccount.findByIdAndUpdate(id, { bankBranch: bankBranch, accountNo: accountNo, accountType: accountType, accountDesc: accountDesc, accountTitle:accountTitle , chartsOfAccount: chartsOfAccount,  borrowingLimit: borrowingLimit })
                    res.status(200).json({ success: true, message: "Update Successfully!" }) 
                }
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }
        else if(path === 'PaymentMethod'){

            const { id, paymentType, chartsOfAccount } = req.body;

            let dbData = await PaymentMethod.findById(id)

            if(dbData){
                if( paymentType == dbData.paymentType && chartsOfAccount == dbData.chartsOfAccount){
                        res.status(400).json({ success: false, message: "Already found!" }) 
                    }
                else{
                    await PaymentMethod.findByIdAndUpdate(id, {  paymentType: paymentType, chartsOfAccount : chartsOfAccount})
                    res.status(200).json({ success: true, message: "Update Successfully!" }) 
                }
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }
        else if (path === 'journalVoucher'){
            const { id, totalDebit, totalCredit, inputList , name, desc, memo, journalDate, journalNo, attachment } = req.body;

            let dbData = await JournalVoucher.findById(id)

            let dbInputList = dbData.inputList;

            // check req.body input List
            var account = 0;
            var credit = 0;
            var debit = 0;
            for (let index = 0; index < inputList.length; index++) {
                account = inputList[index].account;
                credit += parseInt(inputList[index].credit);
                debit += parseInt(inputList[index].debit);
            }


            // check database input List
            var dbAccount = 0;
            var dbCredit = 0;
            var dbDebit = 0;
            for (let index = 0; index < dbInputList.length; index++) {
                dbAccount = dbInputList[index].account;
                dbCredit += parseInt(dbInputList[index].credit);
                dbDebit += parseInt(dbInputList[index].debit);
            }

            if(dbData){
                const dbDate = moment(dbData.journalDate).utc().format('YYYY-MM-DD')
                
                if( 
                    memo === dbData.memo 
                    
                    //Input list 
                    && account === dbAccount 
                    && credit === dbCredit 
                    && debit === dbDebit

                    && journalDate === dbDate
                    && journalNo === dbData.journalNo
                    && desc === dbData.desc 
                    && name === dbData.name 
                    && totalDebit === dbData.totalDebit
                    && totalCredit === dbData.totalCredit
                    ){
                    res.status(400).json({ success: false, message: "Already found!" }) 
                }
                else{
                    await JournalVoucher.findByIdAndUpdate(id, { totalDebit:totalDebit , totalCredit:totalCredit,  inputList:inputList, name:name, desc:desc,  memo:memo, journalDate:journalDate, journalNo : journalNo, attachment : attachment})
                    res.status(200).json({ success: true, message: "Update Successfully!" }) 
                }
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }
        else if (path === 'employees'){
            const { id, name, fatherName, dob, email, cnic,  phoneNo, citizenship, gender, 
                maritalStatus, designation, department, workShift, workHour, employmentMode, 
                payPolicy, basicPay, paymentMode, status, hireDate, siteName, joiningDate, 
                country, streetAddress, city, state, zip } = req.body;

            let dbData = await Employees.findById(id)

            if(dbData){
                const dbDob = moment(dbData.dob).utc().format('YYYY-MM-DD')
                const dbHireDate = moment(dbData.hireDate).utc().format('YYYY-MM-DD')
                const dbJoiningDate = moment(dbData.joiningDate).utc().format('YYYY-MM-DD')

                
                if( name === dbData.name  && fatherName === dbData.fatherName  && zip === dbData.zip  && state === dbData.state  && city === dbData.city  && streetAddress === dbData.streetAddress  && country === dbData.country  && joiningDate === dbJoiningDate  && siteName === dbData.siteName  && hireDate === dbHireDate  && status === dbData.status  && paymentMode === dbData.paymentMode  && basicPay === dbData.basicPay  && payPolicy === dbData.payPolicy  && employmentMode === dbData.employmentMode  && workHour === dbData.workHour  && workShift === dbData.workShift  && department === dbData.department  && designation === dbData.designation  
                    && maritalStatus === dbData.maritalStatus && dob === dbDob  && email === dbData.email  && cnic === dbData.cnic  && phoneNo === dbData.phoneNo  && citizenship === dbData.citizenship  && gender === dbData.gender){
                    res.status(400).json({ success: false, message: "Already found!" }) 
                }
                else{
                    await Employees.findByIdAndUpdate(id, {  name: name, fatherName : fatherName, zip : zip, state : state, city : city, streetAddress : streetAddress, country : country, joiningDate : joiningDate , siteName : siteName, hireDate : hireDate, status : status, paymentMode : paymentMode, basicPay : basicPay, payPolicy : payPolicy, employmentMode : employmentMode , workHour : workHour, workShift : workShift, department : department, designation : designation, 
                        maritalStatus : maritalStatus, dob : dob, email : email, cnic : cnic, phoneNo : phoneNo, citizenship : citizenship, gender : gender})
                    res.status(200).json({ success: true, message: "Update Successfully!" }) 
                }
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }
        else if(path === 'addRole'){

            const { id, roleName, roleDesc } = req.body;

            let dbData = await Role.findById(id)

            if(dbData){
                if( roleName == dbData.roleName && roleDesc == dbData.roleDesc){
                        res.status(400).json({ success: false, message: "Already found!" }) 
                    }
                else{
                    await Role.findByIdAndUpdate(id, {  roleName: roleName, roleDesc : roleDesc})
                    res.status(200).json({ success: true, message: "Update Successfully!" }) 
                }
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }



        // Credit Sale Invoice
        else if (path === 'CreditSalesInvoice'){
            const { id,  phoneNo, email, city, address, reference, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, fullTax, totalAmount, attachment } = req.body;

            let editEntry = await CreditSalesInvoice.findById(id)

            let dbInputList = editEntry.inputList;

            // check req.body input List
            var products = 0;
            var amount = 0;
            var taxAmount = 0;
            var totalAmountPerItem = 0;
            var desc = 0;
            for (let index = 0; index < inputList.length; index++) {
                products = inputList[index].products;
                amount += parseInt(inputList[index].amount);
                taxAmount += parseInt(inputList[index].taxAmount);
                totalAmountPerItem += parseInt(inputList[index].totalAmountPerItem);
                desc = inputList[index].desc;
            }


            // check database input List
            var dbProducts = 0;
            var dbAmount = 0;
            var dbTaxAmount = 0;
            var dbTotalAmountPerItem = 0;
            var dbDesc = 0;
            for (let index = 0; index < dbInputList.length; index++) {
                dbProducts = dbInputList[index].products;
                dbAmount += parseInt(dbInputList[index].amount);
                dbTaxAmount += parseInt(dbInputList[index].taxAmount);
                dbTotalAmountPerItem += parseInt(dbInputList[index].totalAmountPerItem);
                dbDesc = dbInputList[index].desc;
            }

            if(editEntry){
                const dbDate = moment(editEntry.journalDate).utc().format('YYYY-MM-DD')
                const dbDueDate = moment(editEntry.dueDate).utc().format('YYYY-MM-DD')
                if( 
                    //Input list 
                    products === dbProducts 
                    && amount === dbAmount
                    && taxAmount === dbTaxAmount
                    && totalAmountPerItem === dbTotalAmountPerItem
                    && desc === dbDesc

                    && journalDate === dbDate
                    && dueDate === dbDueDate
                    && journalNo === editEntry.journalNo
                    && phoneNo === editEntry.phoneNo
                    && email === editEntry.email
                    && city === editEntry.city
                    && fullAmount === editEntry.fullAmount
                    && fullTax === editEntry.fullTax
                    && totalAmount === editEntry.totalAmount
                    && address === editEntry.address
                    && reference === editEntry.reference
                    && memo === editEntry.memo 
                    && name === editEntry.name 
                    ){
                    res.status(400).json({ success: false, message: "Already found!" }) 
                }
                else{
                    await CreditSalesInvoice.findByIdAndUpdate(id, 
                        {   dueDate:dueDate , phoneNo:phoneNo,email:email , city:city, fullAmount:fullAmount, 
                            fullTax:fullTax, totalAmount:totalAmount,address:address,
                            reference:reference, inputList:inputList,name:name, 
                            memo:memo,journalDate:journalDate, journalNo : journalNo, 
                            attachment : attachment
                        })
                    res.status(200).json({ success: true, message: "Update Successfully!" }) 
                }
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }











        // purchase Invoice
        else if (path === 'PurchaseInvoice'){
            const { id,  phoneNo, email, discount, amountPaid, amountReceived, billStatus, city, address, reference, dueDate, inputList, name,  memo, journalDate, billNo, fullAmount, fullTax, totalAmount, attachment } = req.body;

            let editEntry = await PurchaseInvoice.findById(id)

            let dbInputList = editEntry.inputList;

            // check req.body input List
            var products = 0;
            var amount = 0;
            var taxAmount = 0;
            var totalAmountPerItem = 0;
            var desc = 0;
            for (let index = 0; index < inputList.length; index++) {
                products = inputList[index].products;
                amount += parseInt(inputList[index].amount);
                taxAmount += parseInt(inputList[index].taxAmount);
                totalAmountPerItem += parseInt(inputList[index].totalAmountPerItem);
                desc = inputList[index].desc;
            }


            // check database input List
            var dbProducts = 0;
            var dbAmount = 0;
            var dbTaxAmount = 0;
            var dbTotalAmountPerItem = 0;
            var dbDesc = 0;
            for (let index = 0; index < dbInputList.length; index++) {
                dbProducts = dbInputList[index].products;
                dbAmount += parseInt(dbInputList[index].amount);
                dbTaxAmount += parseInt(dbInputList[index].taxAmount);
                dbTotalAmountPerItem += parseInt(dbInputList[index].totalAmountPerItem);
                dbDesc = dbInputList[index].desc;
            }

            if(editEntry){
                const dbDate = moment(editEntry.journalDate).utc().format('YYYY-MM-DD')
                const dbDueDate = moment(editEntry.dueDate).utc().format('YYYY-MM-DD')
                if( 
                    //Input list 
                    products === dbProducts 
                    && amount === dbAmount
                    && taxAmount === dbTaxAmount
                    && totalAmountPerItem === dbTotalAmountPerItem
                    && desc === dbDesc

                    && journalDate === dbDate
                    && dueDate === dbDueDate
                    && billNo === editEntry.billNo
                    && discount === editEntry.discount
                    && amountPaid === editEntry.amountPaid
                    && amountReceived === editEntry.amountReceived
                    && billStatus === editEntry.billStatus
                    && phoneNo === editEntry.phoneNo
                    && email === editEntry.email
                    && city === editEntry.city
                    && fullAmount === editEntry.fullAmount
                    && fullTax === editEntry.fullTax
                    && totalAmount === editEntry.totalAmount
                    && address === editEntry.address
                    && reference === editEntry.reference
                    && memo === editEntry.memo 
                    && name === editEntry.name 
                    ){
                    res.status(400).json({ success: false, message: "Already found!" }) 
                }
                else{
                    await PurchaseInvoice.findByIdAndUpdate(id, 
                        {   dueDate:dueDate , phoneNo:phoneNo,email:email , city:city, fullAmount:fullAmount, 
                            fullTax:fullTax, totalAmount:totalAmount,address:address,
                            reference:reference, inputList:inputList,name:name, 
                            memo:memo,journalDate:journalDate, billNo : billNo, 
                            discount:discount,amountPaid:amountPaid, amountReceived : amountReceived, 
                            billStatus : billStatus, attachment : attachment,
                        })
                    res.status(200).json({ success: true, message: "Update Successfully!" }) 
                }
            }   
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }


        else if(path === 'TaxRate'){

            const { id, name, taxRate, chartsOfAccount } = req.body;

            let dbData = await TaxRate.findById(id)

            if(dbData){
                if( name == dbData.name && taxRate == dbData.taxRate && chartsOfAccount == dbData.chartsOfAccount ){
                    res.status(400).json({ success: false, message: "Already found!" }) 
                }
                else{
                    await TaxRate.findByIdAndUpdate(id, {  name: name, taxRate : taxRate, chartsOfAccount : chartsOfAccount, })
                    res.status(200).json({ success: true, message: "Update Successfully!" }) 
                }
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }

        



        // Debit Note Invoice
        else if (path === 'DebitNote'){
            const { id,  phoneNo, email, project, city, address, reference, accuralDate, inputList, name,  memo, journalDate, billNo, fullAmount, fullTax, totalAmount, attachment } = req.body;

            let editEntry = await DebitNote.findById(id)

            let dbInputList = editEntry.inputList;

            // check req.body input List
            var products = 0;
            var amount = 0;
            var taxAmount = 0;
            var totalAmountPerItem = 0;
            var desc = 0;
            for (let index = 0; index < inputList.length; index++) {
                products = inputList[index].products;
                amount += parseInt(inputList[index].amount);
                taxAmount += parseInt(inputList[index].taxAmount);
                totalAmountPerItem += parseInt(inputList[index].totalAmountPerItem);
                desc = inputList[index].desc;
            }


            // check database input List
            var dbProducts = 0;
            var dbAmount = 0;
            var dbTaxAmount = 0;
            var dbTotalAmountPerItem = 0;
            var dbDesc = 0;
            for (let index = 0; index < dbInputList.length; index++) {
                dbProducts = dbInputList[index].products;
                dbAmount += parseInt(dbInputList[index].amount);
                dbTaxAmount += parseInt(dbInputList[index].taxAmount);
                dbTotalAmountPerItem += parseInt(dbInputList[index].totalAmountPerItem);
                dbDesc = dbInputList[index].desc;
            }

            if(editEntry){
                const dbDate = moment(editEntry.journalDate).utc().format('YYYY-MM-DD')
                const dbAccuralDate = moment(editEntry.accuralDate).utc().format('YYYY-MM-DD')
                if( 
                    //Input list 
                    products === dbProducts 
                    && amount === dbAmount
                    && taxAmount === dbTaxAmount
                    && totalAmountPerItem === dbTotalAmountPerItem
                    && desc === dbDesc

                    && journalDate === dbDate
                    && accuralDate === dbAccuralDate
                    && billNo === editEntry.billNo
                    && project === editEntry.project
                    && phoneNo === editEntry.phoneNo
                    && email === editEntry.email
                    && city === editEntry.city
                    && fullAmount === editEntry.fullAmount
                    && fullTax === editEntry.fullTax
                    && totalAmount === editEntry.totalAmount
                    && address === editEntry.address
                    && reference === editEntry.reference
                    && memo === editEntry.memo 
                    && name === editEntry.name 
                    ){
                    res.status(400).json({ success: false, message: "Already found!" }) 
                }
                else{
                    await DebitNote.findByIdAndUpdate(id, 
                        {   accuralDate:accuralDate , phoneNo:phoneNo,email:email , city:city, fullAmount:fullAmount, 
                            fullTax:fullTax, totalAmount:totalAmount,address:address,
                            reference:reference, inputList:inputList,name:name, 
                            memo:memo,journalDate:journalDate, billNo : billNo, 
                            attachment : attachment,
                            project : project
                        })
                    res.status(200).json({ success: true, message: "Update Successfully!" }) 
                }
            }   
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }

        // Credit Note
        else if (path === 'CreditNote'){
            const { id,  phoneNo, email, city, address, project, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, fullTax, totalAmount, attachment } = req.body;

            let editEntry = await CreditNote.findById(id)

            let dbInputList = editEntry.inputList;

            // check req.body input List
            var products = 0;
            var amount = 0;
            var taxAmount = 0;
            var totalAmountPerItem = 0;
            var desc = 0;
            for (let index = 0; index < inputList.length; index++) {
                products = inputList[index].products;
                amount += parseInt(inputList[index].amount);
                taxAmount += parseInt(inputList[index].taxAmount);
                totalAmountPerItem += parseInt(inputList[index].totalAmountPerItem);
                desc = inputList[index].desc;
            }


            // check database input List
            var dbProducts = 0;
            var dbAmount = 0;
            var dbTaxAmount = 0;
            var dbTotalAmountPerItem = 0;
            var dbDesc = 0;
            for (let index = 0; index < dbInputList.length; index++) {
                dbProducts = dbInputList[index].products;
                dbAmount += parseInt(dbInputList[index].amount);
                dbTaxAmount += parseInt(dbInputList[index].taxAmount);
                dbTotalAmountPerItem += parseInt(dbInputList[index].totalAmountPerItem);
                dbDesc = dbInputList[index].desc;
            }

            if(editEntry){
                const dbDate = moment(editEntry.journalDate).utc().format('YYYY-MM-DD')
                const dbDueDate = moment(editEntry.dueDate).utc().format('YYYY-MM-DD')
                if( 
                    //Input list 
                    products === dbProducts 
                    && amount === dbAmount
                    && taxAmount === dbTaxAmount
                    && totalAmountPerItem === dbTotalAmountPerItem
                    && desc === dbDesc

                    && journalDate === dbDate
                    && dueDate === dbDueDate
                    && journalNo === editEntry.journalNo
                    && phoneNo === editEntry.phoneNo
                    && email === editEntry.email
                    && city === editEntry.city
                    && fullAmount === editEntry.fullAmount
                    && fullTax === editEntry.fullTax
                    && totalAmount === editEntry.totalAmount
                    && address === editEntry.address
                    && project === editEntry.project
                    && memo === editEntry.memo 
                    && name === editEntry.name 
                    ){
                    res.status(400).json({ success: false, message: "Already found!" }) 
                }
                else{
                    await CreditNote.findByIdAndUpdate(id, 
                        {   dueDate:dueDate , phoneNo:phoneNo,email:email , city:city, fullAmount:fullAmount, 
                            fullTax:fullTax, totalAmount:totalAmount,address:address,
                            project:project, inputList:inputList,name:name, 
                            memo:memo,journalDate:journalDate, journalNo : journalNo, 
                            attachment : attachment
                        })
                    res.status(200).json({ success: true, message: "Update Successfully!" }) 
                }
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }


        // Sales Invoice
        else if (path === 'SalesInvoice'){

            const { id,  phoneNo, email, city, fromAccount, receivedBy, project, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, fullTax, totalAmount, attachment } = req.body;

            let editEntry = await SalesInvoice.findById(id)

            let dbInputList = editEntry.inputList;

            // check req.body input List
            var products = 0;
            var amount = 0;
            var taxAmount = 0;
            var totalAmountPerItem = 0;
            var desc = 0;
            for (let index = 0; index < inputList.length; index++) {
                products = inputList[index].products;
                amount += parseInt(inputList[index].amount);
                taxAmount += parseInt(inputList[index].taxAmount);
                totalAmountPerItem += parseInt(inputList[index].totalAmountPerItem);
                desc = inputList[index].desc;
            }


            // check database input List
            var dbProducts = 0;
            var dbAmount = 0;
            var dbTaxAmount = 0;
            var dbTotalAmountPerItem = 0;
            var dbDesc = 0;
            for (let index = 0; index < dbInputList.length; index++) {
                dbProducts = dbInputList[index].products;
                dbAmount += parseInt(dbInputList[index].amount);
                dbTaxAmount += parseInt(dbInputList[index].taxAmount);
                dbTotalAmountPerItem += parseInt(dbInputList[index].totalAmountPerItem);
                dbDesc = dbInputList[index].desc;
            }

            if(editEntry){
                const dbDate = moment(editEntry.journalDate).utc().format('YYYY-MM-DD')
                const dbDueDate = moment(editEntry.dueDate).utc().format('YYYY-MM-DD')
                if( 
                    //Input list 
                    products === dbProducts 
                    && amount === dbAmount
                    && taxAmount === dbTaxAmount
                    && totalAmountPerItem === dbTotalAmountPerItem
                    && desc === dbDesc

                    && journalDate === dbDate
                    && dueDate === dbDueDate
                    && journalNo === editEntry.journalNo
                    && phoneNo === editEntry.phoneNo
                    && email === editEntry.email
                    && city === editEntry.city
                    && fullAmount === editEntry.fullAmount
                    && fullTax === editEntry.fullTax
                    && totalAmount === editEntry.totalAmount
                    && receivedBy === editEntry.receivedBy
                    && fromAccount === editEntry.fromAccount
                    && project === editEntry.project
                    && memo === editEntry.memo 
                    && name === editEntry.name 
                    ){
                    res.status(400).json({ success: false, message: "Already found!" }) 
                }
                else{
                    await SalesInvoice.findByIdAndUpdate(id, 
                        {   dueDate:dueDate , phoneNo:phoneNo,email:email , city:city, fullAmount:fullAmount, 
                            fullTax:fullTax, totalAmount:totalAmount,fromAccount:fromAccount,
                            project:project, inputList:inputList,name:name, 
                            memo:memo,journalDate:journalDate, journalNo : journalNo, 
                            receivedBy : receivedBy,
                            attachment : attachment,
                        })
                    res.status(200).json({ success: true, message: "Update Successfully!" }) 
                }
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }



        // Expenses Invoice
        else if (path === 'Expenses'){

            const { id,  phoneNo, email, city, fromAccount, paidBy, project, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, fullTax, totalAmount, attachment } = req.body;

            let editEntry = await Expenses.findById(id)

            let dbInputList = editEntry.inputList;

            // check req.body input List
            var accounts = 0;
            var amount = 0;
            var taxAmount = 0;
            var totalAmountPerItem = 0;
            var desc = 0;
            for (let index = 0; index < inputList.length; index++) {
                accounts = inputList[index].accounts;
                amount += parseInt(inputList[index].amount);
                taxAmount += parseInt(inputList[index].taxAmount);
                totalAmountPerItem += parseInt(inputList[index].totalAmountPerItem);
                desc = inputList[index].desc;
            }


            // check database input List
            var dbAccounts = 0;
            var dbAmount = 0;
            var dbTaxAmount = 0;
            var dbTotalAmountPerItem = 0;
            var dbDesc = 0;
            for (let index = 0; index < dbInputList.length; index++) {
                dbAccounts = dbInputList[index].accounts;
                dbAmount += parseInt(dbInputList[index].amount);
                dbTaxAmount += parseInt(dbInputList[index].taxAmount);
                dbTotalAmountPerItem += parseInt(dbInputList[index].totalAmountPerItem);
                dbDesc = dbInputList[index].desc;
            }

            if(editEntry){
                const dbDate = moment(editEntry.journalDate).utc().format('YYYY-MM-DD')
                const dbDueDate = moment(editEntry.dueDate).utc().format('YYYY-MM-DD')
                if( 
                    //Input list 
                    accounts === dbAccounts 
                    && amount === dbAmount
                    && taxAmount === dbTaxAmount
                    && totalAmountPerItem === dbTotalAmountPerItem
                    && desc === dbDesc

                    && journalDate === dbDate
                    && dueDate === dbDueDate
                    && journalNo === editEntry.journalNo
                    && phoneNo === editEntry.phoneNo
                    && email === editEntry.email
                    && city === editEntry.city
                    && fullAmount === editEntry.fullAmount
                    && fullTax === editEntry.fullTax
                    && totalAmount === editEntry.totalAmount
                    && paidBy === editEntry.paidBy
                    && fromAccount === editEntry.fromAccount
                    && project === editEntry.project
                    && memo === editEntry.memo 
                    && name === editEntry.name 
                    ){
                    res.status(400).json({ success: false, message: "Already found!" }) 
                }
                else{
                    await Expenses.findByIdAndUpdate(id, 
                        {   dueDate:dueDate , phoneNo:phoneNo,email:email , city:city, fullAmount:fullAmount, 
                            fullTax:fullTax, totalAmount:totalAmount,fromAccount:fromAccount,
                            project:project, inputList:inputList,name:name, 
                            memo:memo,journalDate:journalDate, journalNo : journalNo, 
                            paidBy : paidBy,
                            attachment : attachment,
                        })
                    res.status(200).json({ success: true, message: "Update Successfully!" }) 
                }
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }

        else if(path === 'clients'){

            const { id, businessName, email, password, firstName, lastName } = req.body;

            let dbData = await User.findById(id)

            if(dbData){
                if( businessName == dbData.businessName 
                    && email == dbData.email
                    && password == dbData.password
                    && firstName == dbData.firstName
                    && lastName == dbData.lastName
                    ){
                        res.status(400).json({ success: false, message: "Already found!" }) 
                    }
                else{
                    await User.findByIdAndUpdate(id, {  businessName: businessName, email : email, password: password, firstName:firstName, lastName:lastName})
                    res.status(200).json({ success: true, message: "Update Successfully!" }) 
                }
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }










        else{
            res.status(400).json({ success: false, message: "Internal server error !" }) 
        }  
    }
    else{
        res.status(400).json({ success: false, message: "Internal server error !" }) 
    }
}