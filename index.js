import express from "express"
import { registerUser } from "./auth.js";

var app = express();
app.use(express.json());

app.post("/registration", async(req,res) => {

    try{
        const {username, user_password, first_name, last_name, address, postal_zip_code} = req.body;
        var result = await registerUser(username, user_password, first_name, last_name, address, postal_zip_code);
    
        res.json(result);
    }catch(err){
        res.json("Failed");
    } 
});

app.listen(5000, () => {
    console.log("Server started");
})
