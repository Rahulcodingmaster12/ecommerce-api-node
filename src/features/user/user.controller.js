import  UserModel  from "./user.model.js";

import jwt from 'jsonwebtoken';
import UserRepository from "./user.repository.js";
import { ApplicationError } from "../../error-handler/application.Error.js";
import bcrypt from 'bcrypt';
export default class UserController{

    constructor(){
        this.userRepository = new UserRepository();
    }

    async signUp(req, res){
        const {name, email, password, type} = req.body;
        const hashedPassword = await bcrypt.hash(password, 12)
       const user = new UserModel(name,email, hashedPassword, type);
        await this.userRepository.SignUp(user)
       res.status(200).send(user);
    }

    async signIn(req, res){
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
        console.log(err);
        res.status(200).send("Something went wrong")
    }
    }
}