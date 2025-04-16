import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/application.Error.js";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import mongoose from "mongoose";
import { categorySchema } from "./category.schema.js";

const ProductModel = mongoose.model('Product', productSchema);
const ReviewModel =  mongoose.model('Review', reviewSchema);
const CategoryModel = mongoose.model('Category', categorySchema);
class ProductRepository{

    constructor(){
        this.collection = "products"
    }

    async add(productData){
        try{
        // const db = getDB();

        // const collection = db.collection(this.collection);

        // await collection.insertOne(newProduct);
        // return newProduct;
        
        // 1. Add the product
        
        productData.categories = productData.category.split(',').map(e => e.trim());
        console.log(productData);
            const newProduct = new ProductModel(productData);
           
            const savedProduct = await newProduct.save();
          
        // 2. update the categories    
            await CategoryModel.updateMany(
            {_id: {$in: productData.categories}},
            {
                $push :{products: new ObjectId(savedProduct._id)}
            }
                )
        }catch(err){
            throw new ApplicationError(
                "Something went wrong in the database",
                500
            )
        }
    }

    async getAll(){
        try{
            const db = getDB();
    
            const collection = db.collection(this.collection);
    
           return await collection.find().toArray();
           
            }catch(err){
                throw new ApplicationError(
                    "Something went wrong in the database",
                    500
                )
            }
    }

    async get(id){
        try{
            const db = getDB();
    
            const collection = db.collection(this.collection);
    
           return await collection.findOne({_id: new ObjectId(id)});
           
            }catch(err){
                console.log(err);
                throw new ApplicationError(
                    "Something went wrong in the database",
                    500
                )
            }
    }

    async filter(minPrice, maxPrice, category){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            let filterExpression ={};
            if(minPrice){
                filterExpression.price = {$gte: parseFloat(minPrice)}
            }
            if(maxPrice){
                filterExpression.price = {...filterExpression.price,  $lte: parseFloat(maxPrice)}
            }
            if(category){
                filterExpression.category = {$eq: category}
            }
            return collection.find(filterExpression).project({price:1, _id:0, name:1}).toArray();
        }catch(err){
                console.log(err);
                throw new ApplicationError(
                    "Something went wrong in the database",
                    500
                )
            }
    }

    async rate(userID, productID, rating){
        try{
            // const db = getDB();
            // const collection = db.collection(this.collection);
           
            // // 1. Removes existing entry 
            // await collection.updateOne({_id: new ObjectId(productID)},
            // {$pull:{ratings:{userID: new ObjectId(userID)}}})
            // // 2. Add new entry
            // await collection.updateOne({
            //     _id: new ObjectId(productID)},
            // {
            //     $push:{ratings: {userID: new ObjectId(userID), rating}}
                
            // })
            const productToUpdate = await ProductModel.findById(productID);
            if(!productToUpdate){
                throw new Error("Product not found");
            }
            const userReview = await ReviewModel.findOne({product: new ObjectId(productID), user: new ObjectId(userID)});
            if(userReview){
                userReview.rating = rating;
                await userReview.save();
            }else{
                const newReview = new ReviewModel({
                    product: new ObjectId(productID),
                    user: new ObjectId(userID),
                    rating: rating
                })
                newReview.save();
            }
        }catch(err){
                console.log(err);
                throw new ApplicationError(
                    "Something went wrong in the database",
                    500
                )
            }
    }

    async averageProductPricePerCategory(){
        try{
            const db = getDB();
           return await db.collection(this.collection)
            .aggregate([
                {
                    // Stage 1: Get average price per category
                    $group:{
                        _id:"$category",
                        averagePrice:{$avg:"$price"}
                    }
                }
            ]).toArray();
        }catch(err){
            console.log(err);
            throw new ApplicationError(
                "Something went wrong in database",
                500
            )
        }
    }

   
}

export default ProductRepository;

const arr = [12, 23, 24, 63, 64, 83];

