document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#addBookForm');
  const bookCountDiv = document.getElementById('bookCount');
  const bookListDiv = document.getElementById('bookList');

  const apiUrl = './books.json'; // Path to your JSON file
  
  let books = [];
  
  const fetchBooks = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const booksObject = await response.json();
      books = Object.values(booksObject);
      filteredBooks = [...books];
      updateBookDisplay();
    } catch (error) {
      console.error('Error fetching books:', error);
      bookListDiv.textContent = 'Failed to load book data.';
    }
  };

// Filter books based on user input
  const filterBooks = () => {
    const searchTerm = document.getElementById('searchTerm').value.toLowerCase();
    const filterGenre = document.getElementById('filterGenre').value;
    const filterYear = document.getElementById('filterYear').value;

    books = books.filter(book => {
      const matchesSearch = searchTerm
        ? book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm)
        : true;
      const matchesGenre = filterGenre ? book.genre === filterGenre : true;
      const matchesYear = filterYear
        ? new Date(book.pubDate).getFullYear() === parseInt(filterYear, 10)
        : true;

      return matchesSearch && matchesGenre && matchesYear;
    });

    updateBookDisplay();
  };
  // Add event listener for filters
  document.getElementById('applyFilters').addEventListener('click', filterBooks);

  // Reset filters and display all books
  const resetFilters = () => {
    document.getElementById('searchTerm').value = '';
    document.getElementById('filterGenre').value = '';
    document.getElementById('filterYear').value = '';
    fetchBooks();
    books = [...books];
    
    updateBookDisplay();
  };
  document.getElementById('resetFilters').addEventListener('click', resetFilters);
  // Initialize by fetching books
  fetchBooks();


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

      // Function to calculate the age of a book
      const calculateBookAge = (pubDate) => {
        const publicationYear = new Date(pubDate).getFullYear();
        const currentYear = new Date().getFullYear();
        return currentYear - publicationYear;
      };

      // Loop through the books array and add the age property
      books.forEach(book => {
        book.age = calculateBookAge(book.pubDate);
      });

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
      genre
    };
    books.push(book);

    alert(`${title} has been added.`);
    console.log('Books:', books);
    updateBookDisplay();
    form.reset();
  });

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