// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Charts from 'models/Charts';
import Contact from 'models/Contact';
import Product from 'models/Product';
import BankAccount from 'models/BankAccount'
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
import PaymentVoucher from 'models/PaymentVoucher';
import ReceiptVoucher from 'models/ReceiptVoucher';
import PaymentMethod from 'models/PaymentMethod';
import User from 'models/User';


export default async function handler(req, res) {

    if (req.method == 'POST'){
        const { path } = req.body;

        if(path === 'chartsOfAccounts'){
            const { selectedIds } = req.body;
            await Charts.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'bankAccount'){
            const { selectedIds } = req.body;
            await BankAccount.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
            
        }
        else if (path === 'contactList'){
            const { selectedIds } = req.body;
            await Contact.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'productAndServices'){
            const { selectedIds } = req.body;
            await Product.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'journalVoucher'){
            const { selectedIds } = req.body;
            await JournalVoucher.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'employees'){
            const { selectedIds } = req.body;
            await Employees.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'addRole'){
            const { selectedIds } = req.body;
            await Role.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'CreditSalesInvoice'){
            const { selectedIds } = req.body;

            try {
                selectedIds.forEach( async(newItem) => {
                    let data = await CreditSalesInvoice.findById(newItem);
                    
                    if(data.inputList.length > 0){
                        
                        let inputList = data.inputList;
                        for (const newItem of inputList) {
                            await Product.findOneAndUpdate({name: newItem.products}, { $inc: { availableQty: newItem.qty } })
                        }
                    }
                });

                await CreditSalesInvoice.deleteMany( { _id: { $in: selectedIds } } )
                res.status(200).json({ success: true, message: "Deleted Successfully !" })  
                
            } catch (error) {
                res.status(400).json({ success: false, message: "Internal Server Error !" }) 
            }

        }
        else if (path === 'PurchaseInvoice'){
            const { selectedIds } = req.body;
            await PurchaseInvoice.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'PaymentMethod'){
            const { selectedIds } = req.body;
            await PaymentMethod.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'TaxRate'){
            const { selectedIds } = req.body;
            await TaxRate.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'SalesInvoice'){
            const { selectedIds } = req.body;

            try {
                selectedIds.forEach( async(newItem) => {
                    let data = await SalesInvoice.findById(newItem);
                    
                    if(data.inputList.length > 0){
                        
                        let inputList = data.inputList;
                        for (const newItem of inputList) {
                            await Product.findOneAndUpdate({name: newItem.products}, { $inc: { availableQty: newItem.qty } })
                        }
                    }
                });

                await SalesInvoice.deleteMany( { _id: { $in: selectedIds } } )
                res.status(200).json({ success: true, message: "Deleted Successfully !" })  
                
            } catch (error) {
                res.status(400).json({ success: false, message: "Internal Server Error !" }) 
            }

        }
        else if (path === 'Expenses'){
            const { selectedIds } = req.body;
            await Expenses.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }
        else if (path === 'PaymentVoucher'){
            const { selectedIds } = req.body;

            try {
                selectedIds.forEach( async(newItem) => {
                    let data = await PaymentVoucher.findById(newItem);

                    if(data.inputList.length > 0){

                        let inputList = data.inputList;
    
                        for (const newItem of inputList) {
                            await PurchaseInvoice.findByIdAndUpdate(newItem.id, { $inc: { amountPaid: -newItem.paid } });
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

                        await PaymentVoucher.deleteMany( { _id: { $in: selectedIds } } )
                        res.status(200).json({ success: true, message: "Deleted Successfully !" }) 

                    }
                }); 
                
            } catch (error) {
                res.status(400).json({ success: false, message: "Internal Server Error !" }) 
            }
            
        }
        else if (path === 'ReceiptVoucher'){
            const { selectedIds } = req.body;

            try {
                selectedIds.forEach( async(newItem) => {
                    let data = await ReceiptVoucher.findById(newItem);

                    if(data.inputList.length > 0){

                        let inputList = data.inputList;
    
                        for (const newItem of inputList) {
                            await CreditSalesInvoice.findByIdAndUpdate(newItem.id, { $inc: { amountReceived: -newItem.paid } });
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

                        await ReceiptVoucher.deleteMany( { _id: { $in: selectedIds } } )
                        res.status(200).json({ success: true, message: "Deleted Successfully !" }) 

                    }
                }); 
                
            } catch (error) {
                res.status(400).json({ success: false, message: "Internal Server Error !" }) 
            }
            
        }



        else if (path === 'DebitNote'){
            const { selectedIds } = req.body;

            try {
                selectedIds.forEach( async(newItem) => {

                    let data = await DebitNote.findById(newItem);

                    if(data.inputList.length > 0){

                        let inputList = data.inputList;

                        for (const newItem of inputList) {
                            let dbData = await PurchaseInvoice.findById(newItem.id);
                            if(dbData.amountReceived != 0){
                                await PurchaseInvoice.findByIdAndUpdate(newItem.id, { $inc: { amountReceived: -newItem.received } });
                            }
                        }

                        let purchaseInvoices = await PurchaseInvoice.find()
                        for (const item of purchaseInvoices) {
                            
                            if(item.amountPaid === item.totalAmount) {
                                await PurchaseInvoice.findByIdAndUpdate(item.id, { billStatus: 'paid' });
                            }
                            else if(item.amountPaid > item.totalAmount) {
                                await PurchaseInvoice.findByIdAndUpdate(item.id, { billStatus: 'Advance' });
                            }
                            else if (item.amountReceived === item.totalAmount) {
                                await PurchaseInvoice.findByIdAndUpdate(item.id, { billStatus: 'returned' });
                            }
                            else {
                                await PurchaseInvoice.findByIdAndUpdate(item.id, { billStatus: 'unpaid' });
                            }
                        }

                        await DebitNote.deleteMany( { _id: { $in: selectedIds } } )
                        res.status(200).json({ success: true, message: "Deleted Successfully !" }) 

                    }
                });

            } catch (error) {
                res.status(400).json({ success: false, message: "Internal Server Error !" }) 
            }
        }
        else if (path === 'CreditNote'){
            const { selectedIds } = req.body;

            try {
                selectedIds.forEach( async(newItem) => {

                    let data = await CreditNote.findById(newItem);

                    if(data.inputList.length > 0){

                        let inputList = data.inputList;

                        for (const newItem of inputList) {
                            let dbData = await CreditSalesInvoice.findById(newItem.id);
                            if(dbData.amountReceived != 0){
                                await CreditSalesInvoice.findByIdAndUpdate(newItem.id, { $inc: { amountReceived: -newItem.received } });
                            }
                        }

                        let invoices = await CreditSalesInvoice.find()
                        for (const item of invoices) {
                            
                            if (item.amountReceived === item.totalAmount) {
                                await CreditSalesInvoice.findByIdAndUpdate(item.id, { billStatus: 'returned' });
                            }
                            else if(item.amountPaid > 0) {
                                await CreditSalesInvoice.findByIdAndUpdate(item.id, { billStatus: 'Partially Paid' });
                            }
                            else if(item.amountReceived > 0) {
                                await CreditSalesInvoice.findByIdAndUpdate(item.id, { billStatus: 'Partially Received' });
                            }
                            else if(item.amountPaid > item.totalAmount) {
                                await CreditSalesInvoice.findByIdAndUpdate(item.id, { billStatus: 'Advance' });
                            }
                            else {
                                await CreditSalesInvoice.findByIdAndUpdate(item.id, { billStatus: 'unpaid' });
                            }
                        }

                        await CreditNote.deleteMany( { _id: { $in: selectedIds } } )
                        res.status(200).json({ success: true, message: "Deleted Successfully !" }) 

                    }
                });

            } catch (error) {
                res.status(400).json({ success: false, message: "Internal Server Error !" }) 
            }
        }

        else if (path === 'clients'){
            const { selectedIds } = req.body;
            await User.deleteMany( { _id: { $in: selectedIds } } )
            res.status(200).json({ success: true, message: "Deleted Successfully !" }) 
        }

        




        else{
            res.status(400).json({ success: false, message: "Internal Server Error!" }) 
        }
    }
    else{
        res.status(400).json({ success: false, message: "Internal Server Error!" }) 
    }
}