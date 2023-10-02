const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    code:{type: String, required: true},
    name:{type: String},
    userEmail:{type: String},
    availableQty:{type: Number},
    costPrice: {type: Number},
    desc: {type: String},
    type: {type: String, default: 'Product'},
  },{timestamps:true});

mongoose.models={}
export default mongoose.model("Product", ProductSchema);