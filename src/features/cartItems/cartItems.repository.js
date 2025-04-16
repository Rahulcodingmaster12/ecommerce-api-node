import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/application.Error.js";
import userRouter from "../user/user.routes.js";


export default class CartItemsRepository{

    constructor(){
        this.collection = 'cartItems';
    }
     
    async add(productID, userID, quantity){
        try{
        const db = getDB();
        const collection = db.collection(this.collection);
        const id = await this.getNextCounter(db);
        // console.log(collection);
        await collection.updateOne({
            productID:new ObjectId(productID), userID: new ObjectId(userID)
        },
        {
            $setOnInsert: {_id:id},
            $inc:{
            quantity:quantity
        }},
        {upsert: true});
        return "Cart is updated successfully";
        }
        catch(err){
            throw new ApplicationError(
                "Something went wrong in database",
                500
            )
        }
    }

    async getNextCounter(db){
       const resultDocument = await db.collection("counters").findOneAndUpdate(
            {_id:'cartItemId'},
            {$inc:{value:1}},
            {returnDocument:'after'}
            )
            console.log(resultDocument.value);
            return resultDocument.value;
    }

    async get(userID){ 
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            return await collection.find({userID:new ObjectId(userID)}).toArray();
        }catch(err){
            console.log(err);
            throw new ApplicationError(
                "Something went wrong in database",
                500
            )
        }
    }

    async delete(cartItemID, userID){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);

            const result = await collection.deleteOne({_id: new ObjectId(cartItemID), userID:new ObjectId(userID)});
            return result.deletedCount>0;
        }catch(err){
            console.log(err);
            throw new ApplicationError(
                "Something went wrong in database",
                500
            )
        }
    }

  
}