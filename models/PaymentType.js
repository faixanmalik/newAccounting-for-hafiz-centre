const mongoose = require('mongoose');

const PaymentTypeSchema = new mongoose.Schema({
    paymentType:{type: String},
    product:{type: String},
    
  },{timestamps:true});

mongoose.models={}
export default mongoose.model("PaymentType", PaymentTypeSchema);