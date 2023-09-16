const mongoose = require('mongoose');

const PaymentInvoiceSchema = new mongoose.Schema({
     
    inputList:{ type: Array },
    totalPaid:{ type: Number },
    totalBalance:{ type: Number },
    phoneNo:{ type: Number },
    email:{type: String},
    fromAccount:{type: String},
    receivedBy:{type: String},
    paidBy:{type: String},
    memo:{type: String},
    amount:{type: Number},
    address:{type: String},
    city:{type: String},
    journalDate: {type: Date},
    dueDate: {type: Date},
    journalNo: {type: String},
    name: {type: String},
    desc: {type: String},
    attachment: {type: Buffer},
    type:{type: String, required: true},

},{timestamps:true});

mongoose.models={}
export default mongoose.model("PaymentInvoice", PaymentInvoiceSchema);