import express from "express"
import { registerUser } from "../auth.js";

export const app = express();
app.use(express.json());

app.post("/registration", async(req,res) => {

    try{
        const {username, user_password, first_name, last_name, address, postal_zip_code} = req.body;
        var result = await registerUser(username, user_password, first_name, last_name, address, postal_zip_code);
    
        if (result == 1){
            res.json("User created successfully!");
        }else if (result == -2){
            res.json("User already exists, pick another username!");
        }else{
            res.json("Failed to register user!");
        }

    }catch(err){
        res.json("Failed to register user!");
    } 
});


