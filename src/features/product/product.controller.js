import ProductModel from "./product.model.js";
import ProductRepository from './product.repository.js'

export default class ProductController{

    constructor(){
        this.productRepository = new ProductRepository();
    }

    async getAllProducts(req, res){
        try{
        const products = await this.productRepository.getAll();
        res.status(200).send(products);
        }catch(err){
            console.log(err);
            return res.status(200).send("Something went wrong");
        }
    }

    async addProduct(req, res){
      try{
      const { name, price, sizes, description, categories } = req.body;
      const newProduct = new ProductModel(
        name,
        description,
        parseFloat(price),
        req?.file?.filename,
        categories,
        sizes?.split(','),
    );
    const createdRecord = await this.productRepository.add(newProduct);
    console.log(createdRecord);
      res.status(201).send(createdRecord);
    }catch(err){
        console.log(err);
        return res.status(200).send("Something went wrong");
    }
    }


    async rateProduct(req, res, next){
        try{
        // console.log(req.query);
        console.log(req.body);
        const userID = req.userID;
        const productID = req.body.productID;
        const rating = req.body.rating;
        
        await this.productRepository.rate(
            userID,
            productID,
            rating
        );
        // console.log(error);
    
        // console.log(error);
       
        return res.status(200).send("Rating has been added");
    }catch(err){
        console.log(err);
        next(err);
    }
    }

    async getOneProduct(req, res){
        try{
        const id = req.params.id;
        const productFound = await this.productRepository.get(id);
        if(!productFound){
            res.status(404).send('Product not found');
        }else{
            return res.status(200).send(productFound);
        }
    }catch(err){
        console.log(err);
        return res.status(200).send("Something went wrong");
    }
    }

    async filterProducts(req, res){
        try{
        const maxPrice = req.query.maxPrice;
        const minPrice = req.query.minPrice;
        const category = req.query.category;

       const result = await this.productRepository.filter(minPrice, maxPrice, category);
       res.status(200).send(result);
    }catch(err){
        console.log(err);
        return res.status(200).send("Something went wrong");
    }
    }

    async averagePrice(req, res, next){
        try{
            const result = await this.productRepository.averageProductPricePerCategory();
            res.status(200).send(result);
        }catch(err){
                console.log(err);
                throw new ApplicationError(
                    "Something went wrong in the database",
                    500
                )
            }
    }
}