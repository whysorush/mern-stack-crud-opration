const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.use(bodyparser.json());
app.use(cors());

const mongoURI = "mongodb://localhost:27017/crud";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const Item = mongoose.model("Item", itemSchema);

app.post("/items", async (req, res) => {
  try {
    console.log(req.body);
    bodyData = {
      name: req.body.name,
      description: req.body.description,
    };
    const item = new Item(bodyData);
    const itemSaved = await item.save();
    console.log("====>", itemSaved);
    res.json(itemSaved);
  } catch (err) {
    console.log("====>fail", err);
    res.status(400).json({ message: err.message });
  }
});

app.get("/items", async (req, res) => {
  console.log("call");
  const items = await Item.find();
  res.json(items);
});

app.put("/items/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Item.findByIdAndUpdate(id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/items/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const id = req.params.id;
    const item = await Item.findByIdAndDelete(id);
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(port, () => console.log(`server running on ${port}`));
