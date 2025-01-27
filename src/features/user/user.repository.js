import { ApplicationError } from "../../error-handler/application.Error.js";
import { getDB } from "../../config/mongodb.js";

class UserRepository{
    constructor(){
        this.collection = "users"
    }
     async SignUp(newUser){
            try{
            // 1. Get the database
            const db = getDB();
            // 2. Get the collection
            const collection = db.collection(this.collection)
           
            // newUser.id = users.length + 1;
            // users.push(newUser);
    
            // 3. Insert the document.
            await collection.insertOne(newUser);
            return newUser;
            }catch(err){
                console.log(err);
            throw new ApplicationError(
                "Something went wrong in the database",
                500
            )
            }
           
        }
     async findByEmail(email){
            try{
            // 1. Get the database
            const db = getDB();
            // 2. Get the collection
            const collection = db.collection(this.collection)
           
            // newUser.id = users.length + 1;
            // users.push(newUser);
                
            // 3. Insert the document.
            return await collection.findOne({email});
            
            }catch(err){
                console.log(err);
            throw new ApplicationError(
                "Something went wrong in the database",
                500
            )
            }
           
        }
}

export default UserRepository;