function showForm(formId) {
  document.getElementById('formContainer').classList.remove('hidden');
  document.querySelectorAll('#formContainer > div').forEach(div => div.classList.add('hidden'));
  document.getElementById(formId).classList.remove('hidden');
}

function closeForm() {
document.getElementById('formContainer').classList.add('hidden');
document.querySelectorAll('#formContainer > div').forEach(div => div.classList.add('hidden'));
}

document.getElementById('formContainer').addEventListener('click', (e) => {
if (e.target.id === 'formContainer') {
  closeForm();
}
});

// Event listeners for buttons
document.querySelectorAll('#formContainer button').forEach(button => {
button.addEventListener('click', () => {
  // Close the form container after the button is clicked
  closeForm();
});
});


document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#addBookForm');
    const bookCountDiv = document.getElementById('bookCount');
    const bookListDiv = document.getElementById('bookList');
    const sortAscButton = document.getElementById('sortAsc');
    const sortDescButton = document.getElementById('sortDesc');

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
        updateBookDisplay();
      } catch (error) {
        toastr.error('Error fetching books:', error);
        bookListDiv.textContent = 'Failed to load book data.';
      }
    };

// Filter books based on user input
    const filterBooks = () => {
      const searchTerm = document.getElementById('searchTerm').value.toLowerCase();
      const filterGenre = document.getElementById('filterGenre').value;
      const filterYear = document.getElementById('filterYear').value;
      
      // Regular expression to validate strings without special characters
      const validStringPattern = /^[a-zA-Z0-9\s]+$/;


      if (searchTerm && !validStringPattern.test(searchTerm)) {
        toastr.error('Title must only contain letters, numbers, and spaces.');
        return;
      }

      toastr.success("fillter applied successfully")
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
      toastr.success("reset successfully")
      fetchBooks();
      books = [...books];
      
      updateBookDisplay();
    };
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    // Initialize by fetching books
    fetchBooks();


    
  // const updateBookDisplay = () => {
  //     bookCountDiv.textContent = `Number of books: ${books.length}`;
  
  //     if (books.length === 0) {
  //       bookListDiv.textContent = 'No Results';
  //     } else {
  //       const table = document.createElement('table');
  //       table.classList.add('min-w-full', 'table-auto', 'bg-white', 'shadow-lg', 'rounded-lg', 'overflow-hidden');
        
  //       const headerRow = document.createElement('tr');
  //       headerRow.classList.add('bg-gray-200', 'text-left');
  //       headerRow.innerHTML = `
  //         <th class="px-4 py-2">Title</th>
  //         <th class="px-4 py-2">Author</th>
  //         <th class="px-4 py-2">ISBN</th>
  //         <th class="px-4 py-2">Publication Date</th>
  //         <th class="px-4 py-2">Genre</th>
  //         <th class="px-4 py-2">Age</th>
  //       `;
  //       table.appendChild(headerRow);
  
  //       // Function to calculate the age of a book
  //       const calculateBookAge = (pubDate) => {
  //         const publicationYear = new Date(pubDate).getFullYear();
  //         const currentYear = new Date().getFullYear();
  //         return currentYear - publicationYear;
  //       };

  //       // Loop through the books array and add the age property
  //       books.forEach(book => {
  //         book.age = calculateBookAge(book.pubDate);
  //       });

  //       books.forEach(book => {
  //         const row = document.createElement('tr');
  //         row.classList.add('border-t', 'border-gray-200');
  //         row.innerHTML = `
  //           <td class="px-4 py-2">${book.title}</td>
  //           <td class="px-4 py-2">${book.author}</td>
  //           <td class="px-4 py-2">${book.isbn}</td>
  //           <td class="px-4 py-2">${book.pubDate}</td>
  //           <td class="px-4 py-2">${book.genre}</td>
  //           <td class="px-4 py-2">${book.age}</td>
  //         `;
  //         table.appendChild(row);
  //       });
  
  //       bookListDiv.innerHTML = '';
  //       bookListDiv.appendChild(table);
  //     }
  //   };

  const updateBookDisplay = () => {
    bookCountDiv.textContent = `Number of books: ${books.length}`;
  
    if (books.length === 0) {
      bookListDiv.textContent = 'No Results';
    } else {
      const table = document.createElement('table');
      table.classList.add(
        'min-w-full', 
        'table-auto', 
        'bg-white', 
        'shadow-lg', 
        'rounded-lg', 
        'overflow-hidden', 
        'block', 
        'w-full', 
        'overflow-x-auto', 
        'sm:table'
      );
  
      const headerRow = document.createElement('tr');
      headerRow.classList.add('bg-gray-200', 'text-left');
      headerRow.innerHTML = `
        <th class="px-4 py-2">Title</th>
        <th class="px-4 py-2">Author</th>
        <th class="px-4 py-2">ISBN</th>
        <th class="px-4 py-2">Publication Date</th>
        <th class="px-4 py-2">Genre</th>
        <th class="px-4 py-2">Age</th>
      `;
      table.appendChild(headerRow);
  
      // Function to calculate the age of a book
      const calculateBookAge = (pubDate) => {
        const publicationYear = new Date(pubDate).getFullYear();
        const currentYear = new Date().getFullYear();
        return currentYear - publicationYear;
      };
  
      // Loop through the books array and add the age property
      books.forEach((book) => {
        book.age = calculateBookAge(book.pubDate);
      });
  
      books.forEach((book) => {
        const row = document.createElement('tr');
        row.classList.add('border-t', 'border-gray-200');
        row.innerHTML = `
          <td class="px-4 py-2">${book.title}</td>
          <td class="px-4 py-2">${book.author}</td>
          <td class="px-4 py-2">${book.isbn}</td>
          <td class="px-4 py-2">${book.pubDate}</td>
          <td class="px-4 py-2">${book.genre}</td>
          <td class="px-4 py-2">${book.age}</td>
        `;
        table.appendChild(row);
      });
  
      bookListDiv.innerHTML = '';
      bookListDiv.appendChild(table);
    }
  };
  


    // Sorting function
    const sortBooks = (order) => {
      toastr.success(`${order} order.`);
      books.sort((a, b) => {
        if (a.title.toLowerCase() < b.title.toLowerCase()) return order === 'asc' ? -1 : 1;
        if (a.title.toLowerCase() > b.title.toLowerCase()) return order === 'asc' ? 1 : -1;
        return 0;
      });
      updateBookDisplay();
    };

    // Event listeners for sort buttons
    sortAscButton.addEventListener('click', () => sortBooks('asc'));
    sortDescButton.addEventListener('click', () => sortBooks('desc'));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const title = document.getElementById('title').value.trim();
      const author = document.getElementById('author').value.trim();
      const isbn = document.getElementById('isbn').value.trim();
      const pubDate = document.getElementById('pub_date').value;
      const genre = document.getElementById('genre').value;
  
     // Regular expression to validate strings without special characters
      const validStringPattern = /^[a-zA-Z0-9\s]+$/;

      if (!title || !author || !isbn || !pubDate || !genre) {
        toastr.error('Please fill out all fields.');
        return;
      }

      if (!validStringPattern.test(title)) {
        toastr.error('Title must only contain letters, numbers, and spaces.');
        return;
      }

      if (!validStringPattern.test(author)) {
        toastr.error('Author must only contain letters, numbers, and spaces.');
        return;
      }
  
      if (isNaN(isbn)) {
        toastr.error('ISBN must be a number.');
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
  
      toastr.success(`${title} has been added.`);
      updateBookDisplay();
      form.reset();
    });
  
    window.handleEdit = () => {
      const isbn = document.getElementById('editIsbn').value.trim();
      const newTitle = document.getElementById('newTitle').value.trim();
      const newAuthor = document.getElementById('newAuthor').value.trim();
      const newPubDate = document.getElementById('newPubDate').value;
      const newGenre = document.getElementById('newGenre').value;
  
      // Regular expression to validate strings without special characters
      const validStringPattern = /^[a-zA-Z0-9\s]+$/;


      if (newTitle && !validStringPattern.test(newTitle)) {
        toastr.error('Title must only contain letters, numbers, and spaces.');
        return;
      }
    
      if (newAuthor && !validStringPattern.test(newAuthor)) {
        toastr.error('Author must only contain letters, numbers, and spaces.');
        return;
      }

      const bookIndex = books.findIndex(book => book.isbn === isbn);
      if (bookIndex === -1) {
        toastr.error('Book not found.');
        return;
      }
  
      const updatedDetails = {};
      if (newTitle) updatedDetails.title = newTitle;
      if (newAuthor) updatedDetails.author = newAuthor;
      if (newPubDate) updatedDetails.pubDate = newPubDate;
      if (newGenre) updatedDetails.genre = newGenre;
  
      books[bookIndex] = { ...books[bookIndex], ...updatedDetails };
  
      toastr.success('Book updated successfully.');
    
      updateBookDisplay();
    };
  
    window.handleDelete = () => {
      const isbn = document.getElementById('deleteIsbn').value.trim();
      const bookIndex = books.findIndex(book => book.isbn === isbn);
      if (bookIndex === -1) {
        toastr.error('Book not found.');
        return;
      }
  
      books.splice(bookIndex, 1);
      toastr.success('Book deleted successfully.');
     
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

        toastr.success("Categorize Successfully")
        // Update UI
        const bookListDiv = document.getElementById('bookList1');
        bookListDiv.innerHTML = `
            <h2>Categorized Books</h2>
            ${categorizedHTML}
        `;
    };
    
    // Function to remove categorized books
    window.removeCategorizedBooks = () => {
      const bookListDiv = document.getElementById('bookList1');
      bookListDiv.innerHTML = `
          <h2>Categorized Books</h2>
          <p>No categorized books available.</p>
      `;
      toastr.success("Categorized books removed successfully");
    };

    updateBookDisplay();
  });