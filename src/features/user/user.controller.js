import  UserModel  from "./user.model.js";

import jwt from 'jsonwebtoken';
import UserRepository from "./user.repository.js";
import { ApplicationError } from "../../error-handler/application.Error.js";
import bcrypt from 'bcrypt';
export default class UserController{

    constructor(){
        this.userRepository = new UserRepository();
    }

    async signUp(req, res, next){
        const {name, email, password, type} = req.body;
       
        // Validate plain-text password
     const passwordRegex =
     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,12}$/;
   if (!passwordRegex.test(password)) {
     return res.status(400).json({
       message:
         "Password must be 8-12 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.",
     });
   }
        try{

            const hashedPassword = await bcrypt.hash(password, 12)
           const user = new UserModel(name,email, hashedPassword, type);
            await this.userRepository.SignUp(user)
           res.status(200).send(user);
        }catch(err){
            next(err);
            console.log(err);
            // res.status(200).send("Something went wrong");
        }
    }

    async signIn(req, res, next){
        try{
      
       const user = await this.userRepository.findByEmail(req.body.email);
        console.log(user);
       if(!user){
        return res.status(400).send("Invalid Credentials");
       }else{
        const result = await bcrypt.compare(req.body.password, user.password);
        if(result){
        // 1. create token
        const token = jwt.sign({
            userID: user._id,
            email : user.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        }
    );

    // 2. Send token
        return res.status(200).send(token);
    }else{
        return res.status(400).send("Incorrect Credentials");
    }
       }
    }catch(err){
        next(err);
        console.log(err);
        res.status(200).send("Something went wrong");
    }
    }

    async resetPassword(req, res, next){
        const {newPassword} = req.body;
        const userID = req.userID;
        console.log(newPassword);
        console.log(userID);
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        console.log(hashedPassword);
        try{
            await this.userRepository.resetPassword(userID, hashedPassword);
            res.status(200).send("Password is reset");
        }catch(err){
            console.log(err);
            console.log("Passing error to middleware");
            next(err);
        }
    }
}