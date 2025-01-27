import { ApplicationError } from "../../error-handler/application.Error.js";
import UserModel from "../user/user.model.js";

export default class ProductModel{

    constructor(name, desc, price, imageUrl, category, sizes, id){
        this.name = name;
        this.desc = desc;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category;
        this.sizes = sizes;
        this._id = id;
    }

    // static getAll(){
    //     return products;
    // }

    // static add(product){
    //   product.id = products.length + 1;
    //   products.push(product);
    //   return product;
    // }

    // static get(id){
    //   return products.find(p => p.id == id);
    // }

    static filter(minPrice, maxPrice, category){
     const result =  products.filter((product)=>{

     return (
      (!minPrice || product.price >= minPrice) && 
      (!maxPrice || product.price <= maxPrice) && 
      (!category || product.category == category)
    );
     });
     return result;
    }

    static rateProduct(userID, productID, rating){
      // 1. Validate user and product
      const user = UserModel.getAll().find(
        (u)=> u.id == userID
      );
      if(!user){
        // user-defined error.
        // throw new Error('User not found') ;
        throw new ApplicationError('User not found', 404)
      }
      const product = products.find(
        (p)=> p.id == productID
      );
      if(!product){
        throw new ApplicationError('Product not found', 404);
      }

      // 2. check if there are any ratings and if not then add ratings array

      if(!product.ratings){
        product.ratings = [];
        product.ratings.push({
          userID: userID,
          rating: rating,
        });
      }else{
        // check if the rating is already availabe.
        const existingRatingIndex = product.ratings.findIndex(
          (r) => r.userID == userID
        );
        if(existingRatingIndex >= 0){
          product.ratings[existingRatingIndex] = {
            userID: userID,
            rating: rating
          }
        }else{
          // if no existing rating then add new rating
          product.ratings.push({
            userID: userID,
            rating: rating
          })
        }
      }
    }

    // Validate Product
}

var products = [
    new ProductModel(
        1,
        'Product 1',
        'Description for Product 10',
        19.99,
        'https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg',
        'Category1',
      ),
      new ProductModel(
        2,
        'Product 2',
        'Description for Product 2',
        29.99,
        'https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg',
        'Category2',
        ['S', 'M']
      ),
      new ProductModel(
        3,
        'Product 3',
        'Description for Product 3',
        39.99,
        'https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg',
        'Category3',
        ['S', 'M', 'XL']
      ),
]