const mongoose = require('mongoose');

const PaymentMethodSchema = new mongoose.Schema({
    paymentType:{type: String},
    chartsOfAccount:{type: String},
    
  },{timestamps:true});

mongoose.models={}
export default mongoose.model("PaymentMethod", PaymentMethodSchema);