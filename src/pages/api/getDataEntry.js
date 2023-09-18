// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import BankAccount from 'models/BankAccount';
import Contact from 'models/Contact';
import Product from 'models/Product';
import Charts from 'models/Charts'
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
import PaymentMethod from 'models/PaymentMethod';
import User from 'models/User';


export default async function handler(req, res) {

    if (req.method == 'POST'){

        const { path } = req.body;
        if( path === 'chartsOfAccounts'){
            const { id } = req.body;
            let charts = await Charts.findById(id)
            if(charts){
                res.status(200).json({ success: true, charts}) 
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }

        else if( path === 'contactList' ){
            const { id } = req.body;
            let contact = await Contact.findById(id)
            if(contact){
                res.status(200).json({ success: true, contact}) 
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }

        }
        else if( path === 'productAndServices' ){
            const { id } = req.body;
            let product = await Product.findById(id)
            if(product){
                res.status(200).json({ success: true, product}) 
            } 
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }

        }
        else if( path === 'bankAccount' ){
            const { id } = req.body;
            let bankAccount = await BankAccount.findById(id)
            if(bankAccount){
                res.status(200).json({ success: true, bankAccount}) 
            } 
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }

        }
        else if( path === 'PaymentMethod' ){
            const { id } = req.body;
            let data = await PaymentMethod.findById(id)

            if(data){
                res.status(200).json({ success: true, data}) 
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }
        else if( path === 'journalVoucher' ){
            const { id } = req.body;
            let data = await JournalVoucher.findById(id)

            if(data){
                res.status(200).json({ success: true, data}) 
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }
        else if( path === 'business' ){
            const { id } = req.body;
            let data = await Business.findById(id)

            if(data){
                res.status(200).json({ success: true, data}) 
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }
        else if( path === 'employees' ){
            const { id } = req.body;
            let data = await Employees.findById(id)

            if(data){
                res.status(200).json({ success: true, data}) 
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }
        else if( path === 'addRole' ){
            const { id } = req.body;
            let data = await Role.findById(id)

            if(data){
                res.status(200).json({ success: true, data}) 
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }
        else if( path === 'CreditSalesInvoice' ){
            const { id } = req.body;
            let data = await CreditSalesInvoice.findById(id)
            if(data){
                res.status(200).json({ success: true, data}) 
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }
        else if( path === 'PurchaseInvoice' ){
            const { id } = req.body;
            let data = await PurchaseInvoice.findById(id)
            if(data){
                res.status(200).json({ success: true, data}) 
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }
        else if( path === 'TaxRate' ){
            const { id } = req.body;
            let data = await TaxRate.findById(id)

            if(data){
                res.status(200).json({ success: true, data}) 
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }
        else if( path === 'CreditNote' ){
            const { id } = req.body;
            let data = await CreditNote.findById(id)
            if(data){
                res.status(200).json({ success: true, data}) 
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }
        else if( path === 'DebitNote' ){
            const { id } = req.body;
            let data = await DebitNote.findById(id)
            if(data){
                res.status(200).json({ success: true, data}) 
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }
        else if( path === 'SalesInvoice' ){
            const { id } = req.body;
            let data = await SalesInvoice.findById(id)
            if(data){
                res.status(200).json({ success: true, data}) 
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }
        else if( path === 'Expenses' ){
            const { id } = req.body;
            let data = await Expenses.findById(id)
            if(data){
                res.status(200).json({ success: true, data}) 
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }
        else if( path === 'PaymentVoucher' ){
            const { id } = req.body;
            let data = await PaymentVoucher.findById(id)
            if(data){
                res.status(200).json({ success: true, data}) 
            }
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }
        }

        else if( path === 'clients' ){
            const { id } = req.body;
            let data = await User.findById(id)
            if(data){
                res.status(200).json({ success: true, data}) 
            } 
            else{
                res.status(400).json({ success: false, message: "Internal server error!" }) 
            }

        }


        
        
    }
    else{
        res.status(400).json({ success: false, message: "Some Error Occured !" }) 
    }

}
