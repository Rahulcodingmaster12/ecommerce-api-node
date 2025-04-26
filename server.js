// 1. Import express
import "./env.js"
import express from 'express';
import swagger from 'swagger-ui-express';
import productRouter from './src/features/product/product.routes.js';
import userRouter from './src/features/user/user.routes.js';

// import basicAuthorizer from './src/middlewares/basicAuth.middleware.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import cartRouter from './src/features/cartItems/cartItems.routes.js';

import apiDocs from './swagger.json' with {type: 'json'};
import cors from 'cors';
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import { ApplicationError } from './src/error-handler/application.Error.js';
import {connectToMongoDB} from './src/config/mongodb.js';
import orderRouter from "./src/features/order/order.routes.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import mongoose from "mongoose";
import likesRouter from "./src/features/like/like.routes.js";
import dotenv from 'dotenv';
dotenv.config();

const PORT = 3200;
// const apiDocs = await import('./swagger.json', { assert: { type: 'json' } });
// 2. create server
const server = express();

// load all the environments variables in application


// for all request related to Products, redirect to product routes
// localhost:3200/api/products

// CORS policy configuration
var corsOptions = {
    origin:'http://localhost:5501'
}

server.use(cors(corsOptions));
// server.use((req, res, next)=>{
//     res.header('Access-Control-Allow-Origin', 'http://localhost:5500');
//     res.header('Access-Control-Allow-Headers', '*');
//     res.header('Access-Control-Allow-Mehtods', '*');
//     // return ok for preflight request.
//     if(req.method=='OPTIONS'){
//         return res.sendStatus(200);
//     }
//     next();
// })
server.use(express.json());



server.use('/api-docs', swagger.serve, swagger.setup(apiDocs));
server.use(loggerMiddleware);
server.use('/api/orders', jwtAuth, orderRouter);
server.use('/api/products',jwtAuth, productRouter);
server.use('/api/cartItems',loggerMiddleware, jwtAuth, cartRouter);
server.use('/api/users', userRouter);
server.use('/api/likes', jwtAuth, likesRouter)

// 3. default request handler
server.get('/', (req, res)=>{
    res.send('Welcome to E-commerce API');
});

// Error handler middleware
server.use((err, req, res, next)=>{
    console.log(err);

    if(err instanceof mongoose.Error.ValidationError){
        return res.status(400).send(err.message);
    }
    if(err instanceof ApplicationError){
       return res.status(err.code).send(err.message);
    }
    // server errors.
    res.status(500).send(
        "Something went wrong, please try later"
    );
});


(async function start(){
    try{
        await connectUsingMongoose();
        server.listen(PORT, ()=>{
            console.log(`server is running at ${PORT}`);
        });
    }catch(err){
        console.error("Failed to start server", err);
        process.exit(1);
    }
})();
// server.use((req, res)=>{
//     res.status(404).send("API not found.Please check our documentation for more information at localhost:3200/api-docs")
// })
// server.listen(3200, ()=>{

//     console.log('server is running at 3200');
//     // connectToMongoDB();
//     connectUsingMongoose();
// });
