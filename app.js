const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcrypt=require("bcryptjs")
const {blogmodel}=require("./models/blog")


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

app.listen(8080,()=>{
    console.log("server started")
})