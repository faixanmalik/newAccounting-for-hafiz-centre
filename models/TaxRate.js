const mongoose = require('mongoose');

const TaxRateSchema = new mongoose.Schema({

    name:{type: String},
    userEmail:{type: String},
    taxRate:{type: Number},
    accountDesc:{type: String},
    chartsOfAccount: {type: String},
    isLocked:{type: Boolean, default: false}

  },{timestamps:true});

mongoose.models={}
export default mongoose.model("TaxRate", TaxRateSchema);