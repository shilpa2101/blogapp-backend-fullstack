const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcrypt=require("bcryptjs")
const {blogmodel}=require("./models/blog")
const jwt=require("jsonwebtoken")


const app=express()
app.use(cors())
app.use(express.json())

// time consuming ,so use async
// genSalt=cost factor

const generateHashedPassword=async(password)=>{     
    const  salt=await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}
mongoose.connect("mongodb+srv://shilpa:shilpa123@cluster0.qb2ryzy.mongodb.net/blogapp?retryWrites=true&w=majority&appName=Cluster0")

app.post("/signup",async(req,res)=>{
    let input=req.body
    let hashedPassword=await generateHashedPassword(input.password) //key password
    console.log(hashedPassword)
    input.password=hashedPassword  //to store hashespassword in db
    let blog=new blogmodel(input)  //object creation and passing to the model
    blog.save()
    res.json({"status":" success"})
})

app.post("/signin",(req,res)=>{
   let input=req.body
   blogmodel.find({"email":req.body.email}).then(
    (response)=>{
        // console.log(response)
        if (response.length>0) {
            let dbPassword=response[0].password
            console.log(dbPassword)
            bcrypt.compare(input.password,dbPassword,(error,isMatch)=>{         //order mandatory in password checking
            if (isMatch) {
                //if login is success ,create a token
                jwt.sign({email:input.email},"blog-app",{expiresIn:"1d"},(error,token)=>{  //blog-app=token name
                if (error) {
                    res.json({"status":"unable to create token"})
                } else {
                    res.json({"status":"success","userId":response[0]._id,"token":token})
                }
                })
            } else {
                res.json({"status":"incorrect password"})
            }
            })   
        } else {
            res.json({"status":"user not found"})
        }
    }
   ).catch()
})

app.listen(8080,()=>{
    console.log("server started")
})