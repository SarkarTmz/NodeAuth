const express = require("express")
const { users } = require("./model/index")
const app = express()
const bcrypt = require("bcryptjs")
const { where } = require("sequelize")
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


                  // aako ko email ko kohi xa ki nae find garnu paryo 
            const emailExist =    await users.findAll({
                where  : {
                    email : email,
                }
            })
            if(emailExist.length > 0 ){
                res.send("User with that email already registered")
            }else{
                
                // validation from server sid
            await  users.create({
                    email : email,
                    username:username,
                    password:bcrypt.hashSync(password,12)
                })
                res.redirect("/login")
            }
            

})

//login
app.get("/login",(req,res)=>{
    res.render("login")
})


app.post("/login", async (req,res)=>{
    // console.log(req.body)
    const email = req.body.email
    const password = req.body.password

    const userExist = await users.findAll({
        where: {
            email: email
        }
    });


    if(userExist.length > 0){
        // pass check gane 
        const isMatch = bcrypt.compareSync(password, userExist[0].password)
        console.log(isMatch)
        if(isMatch){
            res.send("Login successfully")
        }else{
            res.send("Invalid Password")
        }
    }else{
        res.send("Invalid Email")
    }
})


app.listen(3000,function(){
    console.log("NodeJs project  started at port 3000")
})