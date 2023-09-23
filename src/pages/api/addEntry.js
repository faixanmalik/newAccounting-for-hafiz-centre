// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import BankAccount from 'models/BankAccount';
import Charts from 'models/Charts';
import Contact from 'models/Contact';
import Employees from 'models/Employees';
import Product from 'models/Product';
import Role from 'models/Role';
import PurchaseInvoice from 'models/PurchaseInvoice';
import TaxRate from 'models/TaxRate';
import DebitNote from 'models/DebitNote';
import CreditNote from 'models/CreditNote';
import SalesInvoice from 'models/SalesInvoice';
import Expenses from 'models/Expenses';
import PaymentVoucher from 'models/PaymentVoucher';
import ReceiptVoucher from 'models/ReceiptVoucher';
import PaymentMethod from 'models/PaymentMethod';
import CreditSalesInvoice from 'models/CreditSalesInvoice';
import User from 'models/User';


export default async function handler(req, res) {

    if (req.method == 'POST'){
        const { path } = req.body;

        if( path === 'employees'){
            const { userEmail, name, fatherName, dob, email, cnic,  phoneNo, citizenship, gender, maritalStatus, designation, department, workShift, workHour, employmentMode, payPolicy, basicPay, paymentMode, status, hireDate, siteName, joiningDate, country, streetAddress, city, state, zip, row, importEntries  } = req.body;
            if(importEntries){
                await Employees.insertMany(row);
                res.status(200).json({ success: true, message: "Entry Added!" }) 
            }
            else{
                let newEntry = new Employees( { userEmail, name, fatherName, dob, email, cnic,  phoneNo, citizenship, gender, maritalStatus, designation, department, workShift, workHour, employmentMode, payPolicy, basicPay, paymentMode, status, hireDate, siteName, joiningDate, country, streetAddress, city, state, zip } );
                await newEntry.save();
                res.status(200).json({ success: true, message: "Entry Added!" }) 
            }

        }
        else if( path === 'chartsOfAccounts'){
            const { userEmail, accountCode, accountName, account, balance , asof, desc, subAccount, row, importEntries  } = req.body;

            let dbChart = await Charts.findOne({accountCode})
            if(dbChart){
                res.status(400).json({ success: false, message: "Already Found!" }) 
            }
            else{
                if(importEntries){
                    await Charts.insertMany(row);
                    res.status(200).json({ success: true, message: "Entry Added!" }) 
                }
                else{
                    let newCharts = new Charts( { userEmail, account, accountCode, accountName, balance , asof, desc, subAccount } );
                    await newCharts.save();
                    res.status(200).json({ success: true, message: "Entry Added!" }) 
                }
            }
        }
        else if( path === 'bankAccount'){
            const { userEmail, bankBranch, accountNo, accountType, accountDesc, accountTitle, chartsOfAccount,  borrowingLimit, importEntries, row } = req.body;

            if(importEntries){
                await BankAccount.insertMany(row);
                res.status(200).json({ success: true, message: "Entry Added !" }) 
            }
            else{
                let newBankAccount = new BankAccount( { userEmail, bankBranch, accountNo, accountType, accountDesc, accountTitle, chartsOfAccount,  borrowingLimit } );
                await newBankAccount.save();
                res.status(200).json({ success: true, message: "Entry Added !" }) 
            }
        }
        else if( path === 'contactList'){
            const { userEmail, name, type, email, phoneNo, country, streetAddress, city, state, zip, taxRigNo, paymentMethod, terms , openingBalance, date, row, importEntries } = req.body;

            if(importEntries){
                await Contact.insertMany(row);
                res.status(200).json({ success: true, message: "Entry Added !" }) 
            }
            else{
                let newContact = new Contact( { userEmail, name, type, email, phoneNo, country, streetAddress, city, state, zip, taxRigNo, paymentMethod, terms , openingBalance, date } );
                await newContact.save();
                res.status(200).json({ success: true, message: "Entry Added !" }) 
            }

        }
        else if( path === 'productAndServices'){
            const { userEmail, code, name, availableQty, linkAccount, desc, row, importEntries  } = req.body;

            if(importEntries){
                Product.insertMany(row);
                res.status(200).json({ success: true, message: "Entry Added !" }) 
            }
            else{
                let newProduct = new Product( { userEmail, code, name, availableQty, linkAccount, desc  } );
                await newProduct.save();
                res.status(200).json({ success: true, message: "Entry Added !"}) 
            }
        }
        else if( path === 'addRole'){
            const { userEmail, roleName, roleDesc } = req.body;
            
            let newEntry = new Role( { userEmail, roleName, roleDesc } );
            await newEntry.save();
            res.status(200).json({ success: true, message: "Entry Added!" }) 
        }
        else if( path === 'PaymentMethod'){
            const { userEmail, paymentType, chartsOfAccount } = req.body;
            
            let newEntry = new PaymentMethod( { userEmail, paymentType, chartsOfAccount } );
            await newEntry.save();
            res.status(200).json({ success: true, message: "Entry Added!" }) 
        }




        // Credit Sales Invoice
        else if( path === 'CreditSalesInvoice'){
            const { userEmail, phoneNo, email, discount, billStatus, amountPaid, amountReceived, city, address, reference, dueDate, inputList, name,  memo, journalDate, billNo, fullAmount, fullTax, totalAmount, attachment, path, importEntries, row } = req.body;

            for (const newItem of inputList) {
                await Product.findOneAndUpdate({name: newItem.products}, { $inc: { availableQty: -newItem.qty } })
            }

            let newEntry = new CreditSalesInvoice( { userEmail, phoneNo, email, discount, billStatus, amountPaid, amountReceived, city, address, reference, dueDate, inputList, name,  memo, journalDate, billNo, fullAmount, fullTax, totalAmount, attachment, type:path } );
            await newEntry.save();
            res.status(200).json({ success: true, message: "Entry Added !" }) 
        }

        // Purchase Invoice
        else if( path === 'PurchaseInvoice'){
            const { userEmail, phoneNo, email, discount, billStatus, amountPaid, amountReceived, city, address, reference, dueDate, inputList, name,  memo, journalDate, billNo, fullAmount, fullTax, totalAmount, attachment, path, importEntries, row } = req.body;

            for (const newItem of inputList) {
                await Product.findOneAndUpdate({name: newItem.product}, { $inc: { availableQty: newItem.qty } })
            }

            let newEntry = new PurchaseInvoice( { userEmail, phoneNo, email, discount, billStatus, amountPaid, amountReceived, city, address, reference, dueDate, inputList, name,  memo, journalDate, billNo, fullAmount, fullTax, totalAmount, attachment, type:path } );
            await newEntry.save();
            res.status(200).json({ success: true, message: "Entry Added !" }) 
        }
        
        // Tax Rate
        else if( path === 'TaxRate'){
            const { userEmail, name, taxRate, chartsOfAccount } = req.body;
            
            let newEntry = new TaxRate( { userEmail, name, taxRate, chartsOfAccount } );
            await newEntry.save();
            res.status(200).json({ success: true, message: "Entry Added!" }) 
        }

        // Sales Invoice
        else if( path === 'SalesInvoice'){
            const { userEmail, discount, phoneNo, email, city, fromAccount, receivedBy, project, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, fullTax, totalAmount, attachment, path, importEntries, row } = req.body;

            for (const newItem of inputList) {
                await Product.findOneAndUpdate({name: newItem.products}, { $inc: { availableQty: -newItem.qty } })
            }

            let newEntry = new SalesInvoice( { userEmail, discount, phoneNo, email, city, fromAccount, receivedBy, project, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, fullTax, totalAmount, attachment, type:path } );
            await newEntry.save();
            res.status(200).json({ success: true, message: "Entry Added !" }) 
        }

        // Expenses Invoice
        else if( path === 'Expenses'){
            const { userEmail, phoneNo, email, city, fromAccount, paidBy, project, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, fullTax, totalAmount, attachment, path, importEntries, row } = req.body;

            let newEntry = new Expenses( { userEmail, phoneNo, email, city, fromAccount, paidBy, project, dueDate, inputList, name,  memo, journalDate, journalNo, fullAmount, fullTax, totalAmount, attachment, type:path } );
            await newEntry.save();
            res.status(200).json({ success: true, message: "Entry Added !" }) 
        }






        // Payment Voucher Invoice
        else if( path === 'PaymentVoucher'){
            const { userEmail, phoneNo, email, city, reference, fromAccount, paidBy, amount, dueDate, inputList, name,  memo, journalDate, journalNo, totalPaid, totalBalance, attachment, path, importEntries, row } = req.body;

        
            for (const newItem of inputList) {
                await PurchaseInvoice.findByIdAndUpdate(newItem.id, { $inc: { amountPaid: newItem.paid } });
            }
            
            let purchaseInvoices = await PurchaseInvoice.find()

            for (const item of purchaseInvoices) {

                if(item.amountPaid > 0) {
                    if(item.amountPaid === item.totalAmount){
                        await PurchaseInvoice.findByIdAndUpdate(item.id, { billStatus: 'paid' });
                    }
                    else{
                        await PurchaseInvoice.findByIdAndUpdate(item.id, { billStatus: 'Partially Paid' });
                    }
                }
                else {
                    await PurchaseInvoice.findByIdAndUpdate(item.id, { billStatus: 'unpaid' });
                }
            }
            
            let newEntry = new PaymentVoucher( { userEmail, phoneNo, email, city, reference, fromAccount, paidBy, amount, dueDate, inputList, name,  memo, journalDate, journalNo, totalPaid, totalBalance, attachment, type:path } );
            await newEntry.save();

            res.status(200).json({ success: true, message: "Entry Added !" }) 
        }


        // Receipt Voucher Invoice
        else if( path === 'ReceiptVoucher'){
            const { userEmail, phoneNo, email, city, reference, amount, inputList, name,  memo, journalDate, journalNo, totalPaid, totalBalance, attachment, path, importEntries, row } = req.body;

        
            for (const newItem of inputList) {
                await CreditSalesInvoice.findByIdAndUpdate(newItem.id, { $inc: { amountReceived: newItem.paid } });
            }
            
            let invoices = await CreditSalesInvoice.find()

            for (const item of invoices) {

                if(item.amountReceived > 0) {
                    if(item.amountReceived === item.totalAmount){
                        await CreditSalesInvoice.findByIdAndUpdate(item.id, { billStatus: 'paid' });
                    }
                    else{
                        await CreditSalesInvoice.findByIdAndUpdate(item.id, { billStatus: 'Partially Paid' });
                    }
                }
                else {
                    await CreditSalesInvoice.findByIdAndUpdate(item.id, { billStatus: 'unpaid' });
                }
            }
            
            let newEntry = new ReceiptVoucher( { userEmail, phoneNo, email, city, reference, amount, inputList, name,  memo, journalDate, journalNo, totalPaid, totalBalance, attachment, type:path } );
            await newEntry.save();

            res.status(200).json({ success: true, message: "Entry Added !" }) 
        }




        // Debit Note Invoice
        else if( path === 'DebitNote'){
            const { userEmail, phoneNo, email, city, fromAccount, paidBy, amount, dueDate, inputList, name,  memo, journalDate, journalNo, totalReceived, totalBalance, attachment, path, importEntries, row } = req.body;

            for (const newItem of inputList) {
                await PurchaseInvoice.findByIdAndUpdate(newItem.id, { $inc: { amountReceived: newItem.received } });
            }
            
            let purchaseInvoices = await PurchaseInvoice.find()

            for (const item of purchaseInvoices) {

                if(item.amountReceived > 0) {
                    if(item.amountReceived === item.totalAmount){
                        await PurchaseInvoice.findByIdAndUpdate(item.id, { billStatus: 'returned' });
                    }
                    else{
                        await PurchaseInvoice.findByIdAndUpdate(item.id, { billStatus: 'Partially Paid' });
                    }
                }
                else {
                    await PurchaseInvoice.findByIdAndUpdate(item.id, { billStatus: 'unpaid' });
                }
            }
            
            let newEntry = new DebitNote( { userEmail, phoneNo, email, city, fromAccount, paidBy, amount, dueDate, inputList, name,  memo, journalDate, journalNo, totalReceived, totalBalance, attachment, type:path } );
            await newEntry.save();

            res.status(200).json({ success: true, message: "Entry Added !" })
        }


        // Credit Note Invoice
        else if( path === 'CreditNote'){
            const { userEmail, phoneNo, email, city, paidBy, amount, dueDate, inputList, name,  memo, journalDate, journalNo, totalReceived, totalBalance, attachment, path, importEntries, row } = req.body;

            for (const newItem of inputList) {
                await CreditSalesInvoice.findByIdAndUpdate(newItem.id, { $inc: { amountPaid: newItem.received } });
            }
            
            let dbInvoice = await CreditSalesInvoice.find()

            for (const item of dbInvoice) {

                if(item.amountPaid > 0) {
                    if(item.amountPaid === item.totalAmount){
                        await CreditSalesInvoice.findByIdAndUpdate(item.id, { billStatus: 'returned' });
                    }
                    else{
                        await CreditSalesInvoice.findByIdAndUpdate(item.id, { billStatus: 'Partially Paid' });
                    }
                }
                else {
                    await CreditSalesInvoice.findByIdAndUpdate(item.id, { billStatus: 'unpaid' });
                }
            }
            
            let newEntry = new CreditNote( { userEmail, phoneNo, email, city, paidBy, amount, dueDate, inputList, name,  memo, journalDate, journalNo, totalReceived, totalBalance, attachment, type:path } );
            await newEntry.save();

            res.status(200).json({ success: true, message: "Entry Added !" })
        }

        else if( path === 'clients'){
            const { userEmail, businessName, email, password, firstName, lastName } = req.body;
            
            let newEntry = new User( { userEmail, businessName, email, password, firstName, lastName, } );
            await newEntry.save();
            res.status(200).json({ success: true, message: "Entry Added!" }) 
        }
        

        else{
            res.status(400).json({ success: false, message: "Internal Server Error !" }) 
        }
    }
    else{
        res.status(400).json({ success: false, message: "Internal Server Error !" }) 
    }
}