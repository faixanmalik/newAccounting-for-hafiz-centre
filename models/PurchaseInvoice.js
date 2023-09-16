const mongoose = require('mongoose');

const PurchaseInvoiceSchema = new mongoose.Schema({
    inputList:{ type: Array },
    fullAmount:{ type: Number },
    fullTax:{ type: Number },
    totalAmount:{ type: Number },
    phoneNo:{ type: Number },
    email:{type: String},
    memo:{type: String},
    reference:{type: String},
    address:{type: String},
    city:{type: String},
    journalDate: {type: Date},
    dueDate: {type: Date},
    billNo: {type: String},
    name: {type: String},
    desc: {type: String},
    attachment: {type: Buffer},
    type:{type: String},
    billStatus: {type: String},
    amountPaid: {type: Number},
    amountReceived: {type: Number},
    discount: {type: Number},

},{timestamps:true});

mongoose.models={}
export default mongoose.model("PurchaseInvoice", PurchaseInvoiceSchema);