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
      const { name, price, sizes, desc, category } = req.body;
      const newProduct = new ProductModel(
        name,
        desc,
        parseFloat(price),
        req.file.filename,
        category,
        sizes.split(','),
    );
      const createdRecord = await this.productRepository.add(newProduct);
      res.status(201).send(createdRecord);
    }catch(err){
        console.log(err);
        return res.status(200).send("Something went wrong");
    }
    }


    async rateProduct(req, res, next){
        try{
        console.log(req.query);
        const userID = req.userID;
        const productID = req.query.productID;
        const rating = req.query.rating;
        try{
        const error = await this.productRepository.rate(
            userID,
            productID,
            rating
        );
    }
        // console.log(error);
        catch(err){
            return res.status(400).send(err.message);
        }
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

    
}