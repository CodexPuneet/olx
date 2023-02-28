const express = require("express");
const {connection}=require('./Config/db')
const {olxModel}= require('./Model/olx.model')

const app = express();
app.use(express.json());

app.get('/',async (req,res)=>{
  let page=req.query.page;
  try {
    let data = await olxModel.find().skip(page *1 -1).limit(4)
    res.send(data)
  } catch (err) {
    res.send("Something went wrong");
    console.log(err);
  }
})

app.post('/',async (req, res) => {
    const {name,description,category,image,location,postedAt,price} = req.body
    try {
      const Olx = new olxModel({name,description,category,image,location,postedAt,price});
      await Olx.save();
      res.send("Data Added successfull")
    } catch (err) {
      res.send("Something went wrong");
      console.log(err);
    }
  });

  app.get('/category',async (req, res) => {
    const category = req.query.category
    try {
      let data = await olxModel.find({category: category})
      res.send(data)
    } catch (err) {
      res.send("Something went wrong");
      console.log(err);
    }
  });

  app.get('/sort',async (req, res) => {
       const order = req.query.order
       console.log(order)
    try {
      let data = await olxModel.find().sort({postedAt:order})
      res.send(data)
    } catch (err) {
      res.send("Something went wrong");
      console.log(err);
    }
  });

  app.get('/search',async (req, res) => {
    const {search }= req.body
  
 try {
   let data = await olxModel.find({name: search})
   res.send(data)
 } catch (err) {
   res.send("Something went wrong");
   console.log(err);
 }
});

app.delete("/:id", async(req, res)=>{
  const id= req.params.id;
  try {
      await olxModel.findByIdAndDelete({"_id": id});
      res.send("Successfully Bought")
  } catch (error) {
      console.log({"error":error});
      res.send("Unable to buy the post")
  }
})

app.get("/search/:search", async (req, res) => {
  let search = req.params.search;
  try {
    let data = await olxModel.find({
      name: { $regex: search, $options: "i" },
    });
    res.send(data);
  } catch (err) {
    res.send("something went wrong");
  }
});



app.listen(process.env.PORT, async()=>{
    try{
        await connection
        console.log("Connected to database")
    }
    catch(err){
        console.log(err)
        console.log("Error while connecting to DB")
    }
    console.log(`Running on port ${process.env.PORT}`)
});