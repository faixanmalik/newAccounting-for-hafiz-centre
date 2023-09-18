import User from 'models/User'
import connectDb from 'middleware/mongoose'
var CryptoJS = require("crypto-js");


const handler = async (req,res)=>{

    if (req.method == 'POST'){
        let user = await User.findOne({"email": req.body.email})
        if (user){
            if (req.body.email === user.email){
                res.status(400).json({ success: false, message: "Already have an account!"})
            }
        }
        else{
            const {firstName, lastName, email, businessName, country, industry, day,  month, password } = req.body;
            let newuser = new User( {firstName, lastName, email, businessName, country, industry, day,  month , password });
            await newuser.save();
            res.status(200).json({ success: true, message: "Succesfully!"})
        }
    }
    else{
        res.status(400).json({ success: false, message: "Internal Server Error!" }) 
    }
}


export default connectDb(handler);