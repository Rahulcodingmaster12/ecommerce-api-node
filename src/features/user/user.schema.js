
import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    name:String,
    email:{type:String, unique: true, 
        match:[/.+\@.+\../, "Please enter a valid email"]
    },
    // password:{
    //     type:String,
    //     validate: {
    //         validator: function(value){
    //             return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(value);
    //         },
    //         message:"Password should be between 8-12 characters and should have a special character"
    //     }
    
    
    // },
    // type:{type:String, enum:['Customer', 'Seller']}
    
      password: {
      type: String,
      required: true, // No custom validation here; handle validation in the controller
    },
    type: { type: String, enum: ["seller", "customer"] },
})