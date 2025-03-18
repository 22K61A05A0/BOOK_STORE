const API_URL = "http://localhost:5001/api/books";

// Fetch and display books
async function fetchBooks(query = "") {
    try {
        const response = await fetch(API_URL);
        const books = await response.json();
        const booksContainer = document.getElementById("booksList");
        booksContainer.innerHTML = ""; // Clear previous content

        // Filter books based on search query
        const filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredBooks.length === 0) {
            booksContainer.innerHTML = "<p>No books found</p>";
            return;
        }

        filteredBooks.forEach(book => {
            const bookElement = document.createElement("div");
            bookElement.innerHTML = `
                <p><strong>Title:</strong> ${book.title}</p>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Year:</strong> ${book.publishedYear}</p>
                <p><strong>Price:</strong> ${book.price}</p>
                <button onclick="editBook('${book._id}', '${book.title}', '${book.author}', '${book.publishedYear}', '${book.price}')">Edit</button>
                <button onclick="deleteBook('${book._id}')">Delete</button>
                <hr>
            `;
            booksContainer.appendChild(bookElement);
        });
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

// Function to handle search input
function searchBooks() {
    const searchQuery = document.getElementById("searchInput").value;
    fetchBooks(searchQuery); // Fetch and display books based on search
}

// Add or update a book
async function saveBook(event) {
    event.preventDefault();

    const bookId = document.getElementById("bookId").value;
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const publishedYear = document.getElementById("year").value;
    const price = document.getElementById("price").value;

    const bookData = { title, author, publishedYear, price };

    try {
        let response;
        if (bookId) {
            // Update existing book
            response = await fetch(`${API_URL}/${bookId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookData),
            });
        } else {
            // Add new book
            response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookData),
            });
        }

        if (response.ok) {
            alert(bookId ? "Book updated successfully!" : "Book added successfully!");
            document.getElementById("bookForm").reset();
            document.getElementById("bookId").value = ""; // Clear bookId
            fetchBooks();
        } else {
            alert("Error saving book!");
        }
    } catch (error) {
        console.error("Save Error:", error);
    }
}

// Delete a book
async function deleteBook(bookId) {
    try {
        const response = await fetch(`${API_URL}/${bookId}`, { method: "DELETE" });
        const data = await response.json();

        if (data.message.includes("deleted")) {
            alert("Book deleted successfully!");
            fetchBooks(); // Refresh list instead of reloading
        } else {
            alert("Error deleting book!");
        }
    } catch (error) {
        console.error("Delete Error:", error);
    }
}

// Edit a book (populate form for editing)
function editBook(bookId, title, author, publishedYear, price) {
    document.getElementById("bookId").value = bookId;
    document.getElementById("title").value = title;
    document.getElementById("author").value = author;
    document.getElementById("year").value = publishedYear;
    document.getElementById("price").value = price;
}

// Event listener for form submission
document.getElementById("bookForm").addEventListener("submit", saveBook);

// Load books on page load
window.onload = fetchBooks;