const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Book Schema
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    publishedYear: Number,
    price: Number
});
const Book = mongoose.model("Book", bookSchema);

// Get all books
app.get("/api/books", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

// Add a new book
app.post("/api/books", async (req, res) => {
    try {
        const { title, author, publishedYear, price } = req.body;
        const newBook = new Book({ title, author, publishedYear, price });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: "Error adding book" });
    }
});

// Delete a book
app.delete("/api/books/:id", async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting book" });
    }
});

// Update a book
app.put("/api/books/:id", async (req, res) => {
    try {
        const { title, author, publishedYear, price } = req.body;
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { title, author, publishedYear, price },
            { new: true }
        );
        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: "Error updating book" });
    }
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));