import { ObjectId } from "mongodb";
import { getDB, getClient } from "../../config/mongodb.js"
import { ApplicationError } from "../../error-handler/application.Error.js";
import OrderModel from "./order.model.js";


export default class OrderRepository{

    constructor(){
        this.collection = "orders";
    }

    async placeOrder(userId){
        try{
        const client = getClient();
        const session = client.startSession();
       const db = getDB();
       session.startTransaction();
       // 1. Get cartitems and calculate total amount
        const items = await this.getTotalAmount(userId, session);
        const finalTotalAmount = items.reduce((acc, item) => acc + item.totalAmount, 0);
        console.log(finalTotalAmount);
        
        // 2. Create an order record.
        const newOrder = new OrderModel(new ObjectId(userId), finalTotalAmount, new Date());
        await db.collection(this.collection).insertOne(newOrder, {session});
        
        // 3. Reduce the stock.
        for(let item of items){
            await db.collection("products").updateOne(
                {_id:item.productID},
                {$inc:{stock: -item.quantity}}, {session}
            )
        }
        throw new Error("Something is wrong in placeOrder");
        // 4. Clear the cart items.
        await db.collection("cartItems").deleteMany({
            userId: new ObjectId(userId)
        }, {session})
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async getTotalAmount(userId, session){
        const db = getDB();

        const items = await db.collection("cartItems").aggregate([
            // 1. Get cart items for user
            {
                $match:{userID: new ObjectId(userId)}
            },
            // 2. Get the products from products collection.
            {
                $lookup:{
                    from:"products",
                    localField:"productID",
                    foreignField:"_id",
                    as:"productInfo"
                }
            },
            // 3. unwind product info
            {
                $unwind:"$productInfo"
            },
            // 4. Calculate totalAmount for each cartitems.
            {
                $addFields:{
                    "totalAmount":{
                        $multiply:["$productInfo.price", "$quantity"]
                    }
                }
            }

        ], {session}).toArray();
        return items;
        // console.log(items);
        
        

    }
}