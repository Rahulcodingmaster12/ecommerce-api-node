
import express from 'express';
import UserController from './user.controller.js';


// 1. create router
const userRouter = express.Router();

const usercontroller = new UserController()
userRouter.post('/signup', (req, res)=>{
    usercontroller.signUp(req, res)
});
userRouter.post('/signin', (req, res)=>{
    usercontroller.signIn(req, res)
});


export default userRouter;