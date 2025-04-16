
import express from 'express';
import UserController from './user.controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';


// 1. create router
const userRouter = express.Router();

const usercontroller = new UserController()
userRouter.post('/signup', (req, res, next)=>{
    usercontroller.signUp(req, res, next)
});
userRouter.post('/signin', (req, res, next)=>{
    usercontroller.signIn(req, res, next)
});

userRouter.put('/resetpassword', jwtAuth, (req, res, next)=>{
    usercontroller.resetPassword(req, res, next)
})


export default userRouter;