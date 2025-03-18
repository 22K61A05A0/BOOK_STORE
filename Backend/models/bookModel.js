const mongoose = require("mongoose"); // ✅ Correct spelling

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    publishedYear: Number,
    price: Number
});

module.exports = mongoose.model("Book", bookSchema);