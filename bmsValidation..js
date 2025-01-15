document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
  
    const books = [];
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const title = document.getElementById('title').value.trim();
      const author = document.getElementById('author').value.trim();
      const isbn = document.getElementById('isbn').value.trim();
      const pubDate = document.getElementById('pub_date').value;
      const genre = document.getElementById('genre').value;
  
      if (!title || !author || !isbn || !pubDate || !genre) {
        alert('Please fill out all fields.');
        return;
      }
  
      if (isNaN(isbn)) {
        alert('ISBN must be a number.');
        return;
      }
  
      // Add book to the list
      const book = {
        title,
        author,
        isbn,
        pubDate,
        genre,
        age: calculateBookAge(pubDate)
      };
      books.push(book);
  
      alert(`${title} has been added.`);
      console.log('Books:', books);
      form.reset();
    });
  
    // Function to calculate the age of the book
    const calculateBookAge = (pubDate) => {
      const publicationYear = new Date(pubDate).getFullYear();
      const currentYear = new Date().getFullYear();
      return currentYear - publicationYear;
    };
  
    // Function to categorize books by genre
    const categorizeBooks = () => {
      const genres = books.reduce((acc, book) => {
        if (!acc[book.genre]) {
          acc[book.genre] = [];
        }
        acc[book.genre].push(book);
        return acc;
      }, {});
  
      console.log('Books categorized by genre:', genres);
      return genres;
    };
  
    // Add functionality to edit and delete books (simplified example)
    const editBook = (isbn, updatedDetails) => {
      const bookIndex = books.findIndex(book => book.isbn === isbn);
      if (bookIndex === -1) {
        alert('Book not found.');
        return;
      }
      books[bookIndex] = { ...books[bookIndex], ...updatedDetails };
      alert('Book updated successfully.');
      console.log('Books:', books);
    };
  
    const deleteBook = (isbn) => {
      const bookIndex = books.findIndex(book => book.isbn === isbn);
      if (bookIndex === -1) {
        alert('Book not found.');
        return;
      }
      books.splice(bookIndex, 1);
      alert('Book deleted successfully.');
      console.log('Books:', books);
    };
  
   //now, it can be access globally
    window.editBook = editBook;
    window.deleteBook = deleteBook;
    window.categorizeBooks = categorizeBooks;
  });
  