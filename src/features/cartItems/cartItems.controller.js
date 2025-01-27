import CartItemModel from "./cartItems.model.js";

export default class CartItemsController{

    add(req, res){
        const {productID, quantity} = req.query;
        const userID = req.userID;

        CartItemModel.add(productID, userID, quantity);
        res.status(201).send('Cart is updated');
    }

    get(req, res){
        const cartItems = CartItemModel.get(req.userID);
      
        return   res.status(200).send(cartItems);
    }

    delete(req, res){
        const userID = req.userID;
        const cartItemId = req.params.id;
        const error = CartItemModel.delete(cartItemId, userID);

        if(error){
            return res.status(404).send(error);
        }
        return res.send('Cart item removed');
    }
}