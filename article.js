const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let article = new Schema({
  title: String,
  content: String,
  category: String,
  subCategory: String,
  quote:String,
  publishedDate: String
});

const model = mongoose.model("article", article);

module.exports = model;