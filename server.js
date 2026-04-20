const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MongoDB Connected"));

const User = mongoose.model("User", {
  name:String,
  number:String,
  password:String,
  balance:{type:Number, default:0}
});

app.get("/", (req,res)=>{
  res.send("Backend Running ✅");
});

app.post("/register", async (req,res)=>{
  const {name,number,password}=req.body;

  const exist = await User.findOne({number});
  if(exist) return res.json({status:"exist"});

  await User.create({name,number,password});
  res.json({status:"ok"});
});

app.post("/login", async (req,res)=>{
  const {number,password}=req.body;

  const user = await User.findOne({number,password});
  if(user) res.json({status:"ok",user});
  else res.json({status:"fail"});
});

app.post("/deposit", async (req,res)=>{
  const {number}=req.body;

  const user = await User.findOne({number});
  user.balance += 1000;
  await user.save();

  res.json({balance:user.balance});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("Server running"));