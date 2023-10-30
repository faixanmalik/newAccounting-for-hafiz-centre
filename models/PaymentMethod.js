const mongoose = require('mongoose');

const PaymentMethodSchema = new mongoose.Schema({
    paymentType:{type: String},
    userEmail:{type: String},
    chartsOfAccount:{type: String},
    isLocked:{type: Boolean, default: false}
    
  },{timestamps:true});

mongoose.models={}
export default mongoose.model("PaymentMethod", PaymentMethodSchema);