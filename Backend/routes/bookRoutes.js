const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

router.get("/books", bookController.getAllBooks);
router.post("/books", bookController.addBook);
router.get("/books/search", bookController.searchBooks);

router.put("/:id", bookController.updateBook);
router.delete("/:id", bookController.deleteBook);

module.exports = router;