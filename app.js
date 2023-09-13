const express = require("express")
const { users } = require("./model/index")
const app = express()
const bcrypt = require("bcryptjs")
app.set("view engine","ejs")

// database connection 
require("./model/index")

// parse incoming form data
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/register",(req,res)=>{
    res.render("register")
})

// post api for handling user registration

app.post("/register", async (req,res)=>{
    console.log(req.body)
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password

    // validation from server side
    if(!email || !username || !password){
        return res.send("Please provide email,username,password")
    }

   await  users.create({
        email : email,
        username:username,
        password:bcrypt.hashSync(password,12)
    })
    res.send("User Registered Successfully")

})

app.listen(3000,function(){
    console.log("NodeJs project  started at port 3000")
})