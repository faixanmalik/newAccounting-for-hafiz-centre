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
            const { userEmail, code, name, availableQty, costPrice, desc, row, importEntries  } = req.body;

            if(importEntries){
                Product.insertMany(row);
                res.status(200).json({ success: true, message: "Entry Added !" }) 
            }
            else{
                let newProduct = new Product( { userEmail, code, name, availableQty, costPrice, desc  } );
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

            // this is for increasing the qty of the inventory
            // for (const newItem of inputList) {
            //     await Product.findOneAndUpdate({name: newItem.product}, { $inc: { availableQty: newItem.qty } })
            // }

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

            // this is for decreasing the qty of the inventory
            // for (const newItem of inputList) {
            //     await Product.findOneAndUpdate({name: newItem.products}, { $inc: { availableQty: -newItem.qty } })
            // }

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
            const { businessName, email, password, firstName, lastName } = req.body;

            try {

                let preDefiendCOA = [
                  { isLocked: true, userEmail: email, accountCode: 100, accountName: 'Sales', account: 'Incomes', subAccount: 'Revenue', balance: 0, desc: 'Income from any normal business activity'},
                  { isLocked: true, userEmail: email, accountCode: 200, accountName: 'Purchases', account: 'Expenses', subAccount: 'Cost of sales', balance: 0, desc: 'Purchase description refers to the words mentioned in solicitation in order to describe the supplies or services to be acquired and comprises terms and conditions'},
                  { isLocked: true, userEmail: email, accountCode: 300, accountName: 'Accounts Receivable', account: 'Assets', subAccount: 'Current Assets', balance: 0, desc: 'he balance of money due to a firm for goods or services delivered or used but not yet paid for by customers'},
                  { isLocked: true, userEmail: email, accountCode: 400, accountName: 'Accounts Payable', account: 'Liabilities', subAccount: 'Current Liability', balance: 0, desc: 'Outstanding invoices the company has received from suppliers but has not yet paid at balance date'},
                  { isLocked: true, userEmail: email, accountCode: 500, accountName: 'Cost of Goods Sold', account: 'Expenses', subAccount: 'Cost of sales', balance: 0, desc: 'Cost of goods sold by the business'},
                  { isLocked: true, userEmail: email, accountCode: 600, accountName: 'Cash', account: 'Assets', subAccount: 'Current Assets', balance: 0, desc: 'Cash is legal tender—currency or coins—that can be used to exchange goods, debt, or services.'},
                  { isLocked: true, userEmail: email, accountCode: 700, accountName: 'Bank', account: 'Assets', subAccount: 'Current Assets', balance: 0, desc: 'This account represents the funds you have in your bank account.'},
                  { isLocked: true, userEmail: email, accountCode: 800, accountName: 'Owner A Share Capital', account: 'Equity', subAccount: 'Equity', balance: 0, desc: 'The value of shares purchased by the shareholders'},
                  { isLocked: true, userEmail: email, accountCode: 900, accountName: 'Retained Earnings', account: 'Equity', subAccount: 'Equity', balance: 0, desc: 'Accumulated Profit'},
                  { isLocked: true, userEmail: email, accountCode: 1000, accountName: 'Tax Payable', account: 'Liabilities', subAccount: 'Current Liability', balance: 0, desc: 'Income tax payable" is a liability reported for financial accounting purposes that indicates the amount that an organization expects to pay in income taxes within 12 months.'},
                  { isLocked: true, userEmail: email, accountCode: 1100, accountName: 'Stock', account: 'Assets', subAccount: 'Current Assets', balance: 0, desc: 'A stock is a general term used to describe the ownership certificates of any company' },
                  { isLocked: true, userEmail: email, accountCode: 1200, accountName: 'Sales Return', account: 'Incomes', subAccount: 'Revenue', balance: 0, desc: 'A sales return is a commodity or good that a customer returns to a seller for a full refund.' },
                  { isLocked: true, userEmail: email, accountCode: 1300, accountName: 'Sales Discount', account: 'Expenses', subAccount: 'Discount', balance: 0, desc: 'The sales discounts account appears in the income statement and is a contra revenue account, which means that it offsets gross sales, resulting in a smaller net sales figure' },
                  { isLocked: true, userEmail: email, accountCode: 1400, accountName: 'Purchase Return', account: 'Expenses', subAccount: 'Cost of sales', balance: 0, desc: 'when the buyer of merchandise, inventory, fixed assets, or other items sends these goods back to the seller' },
                  { isLocked: true, userEmail: email, accountCode: 1500, accountName: 'Office Expenses', account: 'Expenses', subAccount: 'Administration Expenses', balance: 0, desc: 'General expenses related to the running of the business office.' },
                  { isLocked: true, userEmail: email, accountCode: 1600, accountName: 'Wages and Salaries', account: 'Expenses', subAccount: 'Administration Expenses', balance: 0, desc: 'Payment to employees in exchange for their resources' },
                  { isLocked: true, userEmail: email, accountCode: 1700, accountName: 'Rent', account: 'Expenses', subAccount: 'Administration Expenses', balance: 0, desc: 'The payment to lease a building or area.' },
                  { isLocked: true, userEmail: email, accountCode: 1800, accountName: 'Finance Cost', account: 'Expenses', subAccount: 'Finance Cost', balance: 0, desc: 'the cost, interest, and other charges involved in the borrowing of money to build or purchase assets' },
                  { isLocked: true, userEmail: email, accountCode: 1900, accountName: 'Office Equipment', account: 'Assets', subAccount: 'Fixed Assets', balance: 0, desc: 'Office equipment that is owned and controlled by the business' },
                ]

                let preDefiendTaxRate = [
                  { isLocked: true, userEmail: email, name: 'Output Vat', taxRate: 0, chartsOfAccount: 'Tax Payable' },
                ]

                let preDefiendPaymentMethod = [
                  { isLocked: true, userEmail: email, paymentType: 'Cash', chartsOfAccount: 'Cash' },
                  { isLocked: true, userEmail: email, paymentType: 'Bank', chartsOfAccount: 'Bank' },
                ]

                const userCOA = preDefiendCOA.map(item => ({
                    userEmail: item.userEmail,
                    accountCode: item.accountCode,
                    accountName: item.accountName,
                    account: item.account,
                    subAccount: item.subAccount,
                    balance: item.balance,
                    desc: item.desc,
                }));
                await Charts.create(userCOA);

                
                const userTaxRate = preDefiendTaxRate.map(item => ({
                    userEmail: item.userEmail,
                    name: item.name,
                    taxRate: item.taxRate,
                    chartsOfAccount: item.chartsOfAccount,
                }));
                await TaxRate.create(userTaxRate);


                const userPaymentMethod = preDefiendPaymentMethod.map(item => ({
                    userEmail: item.userEmail,
                    paymentType: item.paymentType,
                    chartsOfAccount: item.chartsOfAccount,
                }));
                await PaymentMethod.create(userPaymentMethod);

                
                let newEntry = new User( { businessName, email, password, firstName, lastName, } );
                await newEntry.save();
                
                res.status(200).json({ success: true, message: "Entry Added!" }) 

            } catch (error) {
                console.log(error)
                res.status(400).json({ success: false, message: "Internal Server Error !" }) 
            }
        }
        
        else{
            res.status(400).json({ success: false, message: "Internal Server Error !" }) 
        }
    }
    else{
        res.status(400).json({ success: false, message: "Internal Server Error !" }) 
    }
}