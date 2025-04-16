import CartItemModel from "./cartItems.model.js";
import CartItemsRepository from "./cartItems.repository.js";

export default class CartItemsController{

    constructor(){
        this.CartItemsRepository = new CartItemsRepository()
    }

    async add(req, res){
        try{
        const {productID, quantity} = req.body;
        const userID = req.userID;
        console.log(req.body);
        // const newCartItem = new CartItemModel(productID, userID, quantity);
        await this.CartItemsRepository.add(productID, userID, quantity);
        // console.log(cartItem);
       
        res.status(201).send("Cart is updated successfully");
        }catch(err){
            res.status(200).send("Something went wrong");
        }
    }

    async get(req, res){
        try{
        const cartItems = await this.CartItemsRepository.get(req.userID);
      
        return  res.status(200).send(cartItems);
        }catch(err){
        res.status(200).send("Something went wrong");
        }
    }

    async delete(req, res){
        const userID = req.userID;
        const cartItemId = req.params.id;
        const isDeleted = this.CartItemsRepository.delete(cartItemId, userID);

        if(!isDeleted){
            return res.status(404).send("Item not found");
        }
        return res.status(200).send('Cart item removed');
    }

   
}