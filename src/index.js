const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const route = require("./route/route");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://Ankita220296:Ankita704696@cluster0.d9vvv.mongodb.net/group6Database?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});
