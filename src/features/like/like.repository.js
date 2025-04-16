import { ObjectId } from "mongodb";
import { likeSchema } from "./like.schema.js";
import mongoose from "mongoose";

const likeModel = mongoose.model('Like', likeSchema);
export class LikeRepository{

    async likeProduct(userID, productID){
        try{
            const newLike = new likeModel({
                user: new ObjectId(userID),
                likeable: new ObjectId(productID),
                types: 'Product'
            });
            await newLike.save();
        }catch(err){
            throw new ApplicationError(
                "Something went wrong in database",
                500
            )
        }
    }

    async likeCategory(userID, categoryID){
        try{
            const newLike = new likeModel({
                user: new ObjectId(userID),
                likeable: new ObjectId(categoryID),
                types: 'Category'
            });
            await newLike.save();
        }catch(err){
            throw new ApplicationError(
                "Something went wrong in database",
                500
            )
        }
    }

    async getLikes(id, type){
        try{
            return await likeModel.find({
                likeable: new ObjectId(id),
                types: type
            }).populate('user').populate({path:'likeable', model:type})
        }catch(err){
            throw new ApplicationError(
                "Something went wrong in database",
                500
            )
        }
    }
}