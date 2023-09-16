const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    code:{type: String, required: true},
    name:{type: String},
    linkAccount: {type: String},
    desc: {type: String},
  },{timestamps:true});

mongoose.models={}
export default mongoose.model("Product", ProductSchema);