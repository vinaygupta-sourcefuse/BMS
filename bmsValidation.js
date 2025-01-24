function showForm(formId) {
  document.getElementById('formContainer').classList.remove('hidden'); //show the Container
  document.querySelectorAll('#formContainer > div').forEach(div => div.classList.add('hidden')); // hide all the forms within the container
  document.getElementById(formId).classList.remove('hidden'); // show the specific form based on the formId
}

function closeForm() {
document.getElementById('formContainer').classList.add('hidden'); // hide the Container
document.querySelectorAll('#formContainer > div').forEach(div => div.classList.add('hidden')); // hide all the forms within the container
}

document.getElementById('formContainer').addEventListener('click', (e) => {
  if (e.target.id === 'formContainer') {
    closeForm();
  }
  }); // Close the form container when the user clicks outside the form
  
function scrollToTop() {
  window.scrollTo({
      top: 0,
      behavior: 'smooth'
  });
}

function scrollToBottom() {
  window.scrollTo({
    top: document.body.scrollHeight, // Scroll to the bottom
    behavior: 'smooth', // Smooth scrolling animation
  });
}

const calculateBookAge = (pubDate) => {
  const publicationYear = new Date(pubDate).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - publicationYear;
};

const showLoader = (message = "Loading...") => {
  const loader = document.createElement('div');
  loader.id = 'globalLoader'; // Add an ID to target the loader later for removal
  loader.classList.add(
    'fixed',
    'top-0',
    'left-0',
    'w-full',
    'h-screen',
    'bg-black',
    'bg-opacity-50',
    'flex',
    'justify-center',
    'items-center',
    'z-50'
  );

  loader.innerHTML = `
    <div class="flex items-center space-x-4">
      <svg class="w-12 h-12 animate-spin text-white" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <h1 class="text-white font-bold text-lg">${message}</h1>
    </div>
  `;

  document.body.appendChild(loader);
};

const hideLoader = () => {
  const loader = document.getElementById('globalLoader');
  if (loader) {
    loader.remove();
  }
};

function validate(searchTerm){
  // Regular expression to validate strings without special characters
  const validStringPattern = /^[a-zA-Z0-9\s]+$/;

  if (searchTerm && !validStringPattern.test(searchTerm)) { // Check if the title is valid  and not empty
    toastr.error(`${searchTerm} must only contain letters, numbers, and spaces.`);
    return 1;
  }
}

function DateValidation(newPubDate){
  // Validation for Pubdate fields
  if (newPubDate) {
    const pubDateObj = new Date(newPubDate);
    if (isNaN(pubDateObj.getTime())) {
      toastr.error('Invalid publication date.');
      return 1;
    }
    if (pubDateObj > new Date()) {
      toastr.error('Publication date must be in the past.');
      return 1;
    }
  }
}

function isbnValidation(isbn){
  // Validation for ISBN
  if (!isbn) {
    toastr.error('Please enter the ISBN of the book!');
    return 1;
  }

  if (isNaN(isbn)) {
    toastr.error('ISBN must be a number.');
    return 1;
  }
} 

function isISBNExist(isbn) {
  // Use Array.some() to check if any book's ISBN matches the input
  return books.some(book => book.isbn === isbn);
}

document.addEventListener('DOMContentLoaded', () => { // Wait for the DOM to load
    const form = document.querySelector('#addBookForm'); 
    const bookCountDiv = document.getElementById('bookCount');
    const bookListDiv = document.getElementById('bookList');
    const sortAscButton = document.getElementById('sortAsc');
    const sortDescButton = document.getElementById('sortDesc');

    const apiUrl = './books.json'; // Path to your JSON file
    
    let books = [];
    
    const fetchBooks = async () => {
      showLoader("Fetching books...");
      
      try {
        // Simulate a slower network request
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
    
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const booksObject = await response.json();
        books = Object.values(booksObject);
    
        updateBookDisplay();
      } catch (error) {
        toastr.error(`Error fetching books: ${error.message}`);
        bookListDiv.textContent = 'Failed to load book data.';
      } finally {
        hideLoader();
      }
    };
    // Initialize by fetching books
    fetchBooks();

    // Filter books based on user input
    const filterBooks = () => {
      const searchTerm = document.getElementById('searchTerm').value.toLowerCase();
      const filterGenre = document.getElementById('filterGenre').value;
      const filterYear = document.getElementById('filterYear').value;

      if(validate(searchTerm)){return;}

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

      toastr.success("fillter applied successfully")
      updateBookDisplay();
    };
    // Add event listener for filters
    document.getElementById('applyFilters').addEventListener('click', filterBooks);

    // Reset filters and display all books
    const resetFilters = () => {
      document.getElementById('searchTerm').value = '';
      document.getElementById('filterGenre').value = '';
      document.getElementById('filterYear').value = '';

      setTimeout(function() {
      toastr.success("reset successfully")
    }, 1000); // 1000 milliseconds = 1 second

      fetchBooks();
      updateBookDisplay();

      setTimeout(function() {
        scrollToTop();
      }, 1000); // 1000 milliseconds = 1 second
    
    };
    document.getElementById('resetFilters').addEventListener('click', resetFilters);

    const updateBookDisplay = (currentPage = 1) => {
      const booksPerPage = 5; // Number of books to display per page
    
      // Calculate the starting and ending indices for the current page
      const startIndex = (currentPage - 1) * booksPerPage;
      const endIndex = Math.min(startIndex + booksPerPage, books.length);
    
      // Update book count display
      bookCountDiv.textContent = `Number of books: ${books.length}`;
    
      // Clear previous content
      bookListDiv.innerHTML = '';
    
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
       
    
        // Loop through the books for the current page and add rows
        for (let i = startIndex; i < endIndex; i++) {
          const book = books[i];
          book.age = calculateBookAge(book.pubDate);
    
          const row = document.createElement('tr');
          row.classList.add('border-t', 'border-gray-200');
          row.innerHTML = `
            <td class="px-4 py-2"><span class="math-inline">${book.title}</td\>
    <td class\="px\-4 py\-2"\></span>${book.author}</td>
            <td class="px-4 py-2"><span class="math-inline">${book.isbn}</td\>
    <td class\="px\-4 py\-2"\></span>${book.pubDate}</td>
            <td class="px-4 py-2"><span class="math-inline">${book.genre}</td\>
    <td class\="px\-4 py\-2"\></span>${book.age}</td>
          `;
          table.appendChild(row);
        }
    
        bookListDiv.appendChild(table);
    
        // Add pagination buttons (if there are more than one page)
        if (books.length > booksPerPage) {
          const paginationDiv = document.createElement('div');
          paginationDiv.classList.add('flex', 'justify-center', 'mt-4');
    
          const prevButton = document.createElement('button');
          prevButton.textContent = 'Previous';
          prevButton.classList.add(
            'px-4',
            'py-2',
            'bg-gray-200',
            'hover:bg-gray-300',
            'disabled:opacity-50',
            'cursor-pointer'
          );
          prevButton.disabled = currentPage === 1;
          prevButton.addEventListener('click', () => updateBookDisplay(currentPage - 1));
          paginationDiv.appendChild(prevButton);
    
          const nextButton = document.createElement('button');
          nextButton.textContent = 'Next';
          nextButton.classList.add(
            'px-4',
            'py-2',
            'bg-gray-200',
            'hover:bg-gray-300',
            'disabled:opacity-50',
            'cursor-pointer'
          );
          nextButton.disabled = currentPage === Math.ceil(books.length / booksPerPage);
          nextButton.addEventListener('click', () => updateBookDisplay(currentPage + 1));
          paginationDiv.appendChild(nextButton);
    
          bookListDiv.appendChild(paginationDiv);
        }
      }
    };

    // Sorting function
    const sortBooks = (order) => {
      books.sort((a, b) => {
        if (a.title.toLowerCase() < b.title.toLowerCase()) return order === 'asc' ? -1 : 1;
        if (a.title.toLowerCase() > b.title.toLowerCase()) return order === 'asc' ? 1 : -1;
        return 0;
      });
      toastr.success(`${order} order.`);
      updateBookDisplay();
    };
    // Event listeners for sort buttons
    sortAscButton.addEventListener('click', () => sortBooks('asc'));
    sortDescButton.addEventListener('click', () => sortBooks('desc'));

    //addBookForm
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const title = document.getElementById('title').value.trim();
      const author = document.getElementById('author').value.trim();
      const isbn = document.getElementById('isbn').value.trim();
      const pubDate = document.getElementById('pub_date').value;
      const genre = document.getElementById('genre').value;

      if (!title || !author || !isbn || !pubDate || !genre) {
        toastr.error('Please fill out all fields.');
        return;
      }

      if(validate(title)){return;}
     
      if(validate(author)){return;}
  
      if (isbnValidation(isbn)){return;}
  
      const book = {
        title,
        author,
        isbn,
        pubDate,
        genre
      };

      const currentDate = new Date();
      const pubDateObj = new Date(pubDate);
      const isPubDateValid = pubDateObj <= currentDate;
      if (!isPubDateValid) {
        toastr.error('Publication date must be in the past.');
        return;
      }
  
      if (isISBNExist(isbn)) {
        toastr.error('ISBN already exists.');
        return;
      }
      else
      books.push(book);

      closeForm();
      toastr.success(`${title} has been added.`);

      document.getElementById('title').value = '';
      document.getElementById('author').value = '';
      document.getElementById('isbn').value = '';
      document.getElementById('pub_date').value = '';
      document.getElementById('genre').value = '';

      updateBookDisplay();
    });
  
    window.handleEdit = () => {
      const isbn = document.getElementById('editIsbn').value.trim();
      const newTitle = document.getElementById('newTitle').value.trim();
      const newAuthor = document.getElementById('newAuthor').value.trim();
      const newPubDate = document.getElementById('newPubDate').value;
      const newGenre = document.getElementById('newGenre').value;
    
      if (isbnValidation(isbn)){return;}
    
      // Validation for book existence
      const bookIndex = books.findIndex(book => book.isbn === isbn);
      if (bookIndex === -1) {
        toastr.error('Book not found.');
        return;
      }
        
      if(validate(newTitle)){return;}
      if(validate(newAuthor)){return;}
      //Date must be in the past
      if(DateValidation(newPubDate)){return;}
    
      // Update the book
      const updatedDetails = {};
      if (newTitle) updatedDetails.title = newTitle;
      if (newAuthor) updatedDetails.author = newAuthor;
      if (newPubDate) updatedDetails.pubDate = newPubDate;
      if (newGenre) updatedDetails.genre = newGenre;
    
      books[bookIndex] = { ...books[bookIndex], ...updatedDetails }; // Merge the updated details with the existing book details
      toastr.success('Book updated successfully.');
      closeForm();
      updateBookDisplay();
    };
    
    window.handleDelete = () => {
      const isbn = document.getElementById('deleteIsbn').value.trim();
    
      if (isbnValidation(isbn)){return;}
    
      // Check if the book exists
      const bookIndex = books.findIndex(book => book.isbn === isbn);
      if (bookIndex === -1) {
        toastr.error('Book not found.');
        return;
      }
    
      // Remove the book
      books.splice(bookIndex, 1);
      toastr.success('Book deleted successfully.');
      closeForm();
      updateBookDisplay();
    };

    window.handleCategorize = () => {
      closeForm();
      scrollToBottom();
    
      const genres = books.reduce((acc, book) => {
        // Traverse through the books array and categorize them by genre
        if (!acc[book.genre]) {
          acc[book.genre] = [];
        }
        acc[book.genre].push(book);
        return acc;
      }, {});
    
      // Generate HTML for categorized books
      const categorizedHTML = Object.keys(genres)
        .map((genre) => {
          const booksInGenre = genres[genre].slice(0, 5); // Limit to 5 books per genre
          return `
            <div class="border rounded-lg shadow-md bg-white p-4 m-4">
              <h3 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
                ${genre.charAt(0).toUpperCase() + genre.slice(1)}
              </h3>
              <ul class="list-disc pl-5 space-y-2">
                ${booksInGenre
                  .map(
                    (book) => `
                    <li>
                      <strong>${book.title}</strong> by <em>${book.author}</em>
                      <br />
                      <span class="text-sm text-gray-600">ISBN: ${book.isbn}, Published: ${book.pubDate}</span>
                    </li>
                  `
                  )
                  .join('')}
              </ul>
              ${
                genres[genre].length > 5
                  ? `<p class="text-sm text-blue-600 italic mt-3">And ${
                      genres[genre].length - 5
                    } more...</p>`
                  : ''
              }
            </div>
          `;
        })
        .join('');
    
      toastr.success('Categorized Successfully');
      // Update UI
      const bookListDiv = document.getElementById('bookList1');
      bookListDiv.innerHTML = `
        <h2 class="text-xl font-bold text-gray-900 mb-4">Categorized Books</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${categorizedHTML}
        </div>
      `;
    };
    
    window.removeCategorizedBooks = () => {
      closeForm();
      scrollToBottom();
      const bookListDiv = document.getElementById('bookList1');
      bookListDiv.innerHTML = `
        <h2 class="text-xl font-bold text-gray-900 mb-4">Categorized Books</h2>
        <p class="text-gray-600 italic">No categorized books available.</p>
      `;
      toastr.success("Categorized books removed successfully");
    };

    updateBookDisplay();
  });