document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#addBookForm');
    const bookCountDiv = document.getElementById('bookCount');
    const bookListDiv = document.getElementById('bookList');
  
    // const books = []; 
    const books = [
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "1234567890",
        pubDate: "1960-07-11",
        genre: "fiction",
        age: new Date().getFullYear() - 1960,
      },
      {
        title: "1984",
        author: "George Orwell",
        isbn: "2345678901",
        pubDate: "1949-06-08",
        genre: "fiction",
        age: new Date().getFullYear() - 1949,
      },
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "3456789012",
        pubDate: "1925-04-10",
        genre: "fiction",
        age: new Date().getFullYear() - 1925,
      },
      {
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        isbn: "4567890123",
        pubDate: "2011-01-01",
        genre: "non-fiction",
        age: new Date().getFullYear() - 2011,
      },
      {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        isbn: "5678901234",
        pubDate: "1937-09-21",
        genre: "fantasy",
        age: new Date().getFullYear() - 1937,
      },
    ];
    
  
    const updateBookDisplay = () => {
      bookCountDiv.textContent = `Number of books: ${books.length}`;
  
      if (books.length === 0) {
        bookListDiv.textContent = 'No books added yet.';
      } else {
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
          <th>Title</th>
          <th>Author</th>
          <th>ISBN</th>
          <th>Publication Date</th>
          <th>Genre</th>
          <th>Age</th>
        `;
        table.appendChild(headerRow);
  
        books.forEach(book => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${book.pubDate}</td>
            <td>${book.genre}</td>
            <td>${book.age}</td>
          `;
          table.appendChild(row);
        });
  
        bookListDiv.innerHTML = '';
        bookListDiv.appendChild(table);
      }
    };
  
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
      updateBookDisplay();
      form.reset();
    });
  
    const calculateBookAge = (pubDate) => {
      const publicationYear = new Date(pubDate).getFullYear();
      const currentYear = new Date().getFullYear();
      return currentYear - publicationYear;
    };
  
    window.handleEdit = () => {
      const isbn = document.getElementById('editIsbn').value.trim();
      const newTitle = document.getElementById('newTitle').value.trim();
      const newAuthor = document.getElementById('newAuthor').value.trim();
      const newPubDate = document.getElementById('newPubDate').value;
      const newGenre = document.getElementById('newGenre').value;
  
      const bookIndex = books.findIndex(book => book.isbn === isbn);
      if (bookIndex === -1) {
        alert('Book not found.');
        return;
      }
  
      const updatedDetails = {};
      if (newTitle) updatedDetails.title = newTitle;
      if (newAuthor) updatedDetails.author = newAuthor;
      if (newPubDate) updatedDetails.pubDate = newPubDate;
      if (newGenre) updatedDetails.genre = newGenre;
  
      books[bookIndex] = { ...books[bookIndex], ...updatedDetails };
  
      alert('Book updated successfully.');
      console.log('Books:', books);
      updateBookDisplay();
    };
  
    window.handleDelete = () => {
      const isbn = document.getElementById('deleteIsbn').value.trim();
      const bookIndex = books.findIndex(book => book.isbn === isbn);
      if (bookIndex === -1) {
        alert('Book not found.');
        return;
      }
  
      books.splice(bookIndex, 1);
      alert('Book deleted successfully.');
      console.log('Books:', books);
      updateBookDisplay();
    };
  
    window.handleCategorize = () => {
      const genres = books.reduce((acc, book) => {
        if (!acc[book.genre]) {
          acc[book.genre] = [];
        }
        acc[book.genre].push(book);
        return acc;
      }, {});
  
         // Generate HTML for categorized books
        const categorizedHTML = Object.keys(genres)
            .map(
            (genre) => `
            <h3>${genre.charAt(0).toUpperCase() + genre.slice(1)}</h3>
            <ul>
                ${genres[genre]
                .map(
                    (book) =>
                    `<li>${book.title} by ${book.author} (ISBN: ${book.isbn}, Published: ${book.pubDate})</li>`
                )
                .join('')}
            </ul>
            `
            )
            .join('');

        // Update UI
        const bookListDiv = document.getElementById('bookList1');
        bookListDiv.innerHTML = `
            <h2>Categorized Books</h2>
            ${categorizedHTML}
        `;
    };
        
    updateBookDisplay();
  });
