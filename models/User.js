const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstname:{type: String, required: true},
    lastname:{type: String},
    name:{type: String},
    businessName:{type: String, required: true},
    country:{type: String},
    industry:{type: String},
    day:{type: Number },
    month:{type: String},
    phoneno:{type: Number },
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    streetAddress: {type: String },
    state: { type: String  },
    zip: { type: Number },

  },{timestamps:true});
   

mongoose.models = {}
export default mongoose.model("User", UserSchema);