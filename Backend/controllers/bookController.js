const Book = require("../models/bookModel");

// Get all books
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// Add a new book
exports.addBook = async (req, res) => {
    try {
        const { title, author, publishedYear, price } = req.body;
        if (!title || !author || !publishedYear || !price) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const newBook = new Book({ title, author, publishedYear, price });
        await newBook.save();
        res.status(201).json({ message: "Book added successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to add book" });
    }
};

// Search books by title or author
exports.searchBooks = async (req, res) => {
    try {
        const { query } = req.query;
        const books = await Book.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { author: { $regex: query, $options: "i" } }
            ]
        });
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: "Search failed" });
    }
};

// Update book
exports.updateBook = async (req, res) => {
  try {
    const { title, author, publishedYear, price } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, publishedYear, price },
      { new: true }
    );
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: "Error Updating Book" });
  }
};

// Delete book
exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error Deleting Book" });
  }
};