const mongoose = require('mongoose');

const JournalVoucherSchema = new mongoose.Schema({
    inputList:{ type: Array },
    userEmail:{type: String},
    totalDebit:{ type: Number },
    totalCredit:{ type: Number },
    memo:{type: String},
    journalDate: {type: Date},
    journalNo: {type: String, unique: true},
    name: {type: String},
    desc: {type: String},
    attachment: {type: Buffer},
    type:{type: String, required: true},

},{timestamps:true});

mongoose.models={}
export default mongoose.model("JournalVoucher", JournalVoucherSchema);