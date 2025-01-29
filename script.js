class BaseClass{   
    constructor(title, author, genre, isbn, price, pubDate){
        this.title = this.validate(title);
        this.author = this.validate(author);
        this.genre = genre;
        this.isbn = this.isbnAndPriceValidation(isbn);
        this.price = this.isbnAndPriceValidation(price);
        this.pubDate = this.validatePublicationDate(pubDate); 
        this.age = this.pubDate ? this.validateAge(pubDate) : null;
    }

    validate(searchTerm){
        const validStringPattern = /^[a-zA-Z0-9\s]+$/;

        if (searchTerm && !validStringPattern.test(searchTerm)) { // Check if the title is valid  and not empty
        //   toastr.error(`${searchTerm} must only contain letters, numbers, and spaces.`);
          return 'Special Characters not allowed';
        }
        return searchTerm;
    }

    isbnAndPriceValidation(searchTerm){
                
        if (isNaN(searchTerm)) {
            // toastr.error('ISBN must be a number.');
            return -1;
        }
        return searchTerm;
    }

    validatePublicationDate(newPubDate){
            const pubDateObj = new Date(newPubDate);
            const regex = /^\d{4}-\d{2}-\d{2}$/;

            if (!pubDateObj || isNaN(pubDateObj.getTime()) || pubDateObj > new Date() || !regex.test(newPubDate)) {
            //   toastr.error('Invalid publication date.');
              const currentDate = new Date();
              const formattedDate = currentDate.toISOString().split('T')[0]; // Format the date to YYYY-MM-DD
              return formattedDate; // if the publication date is not provided or provided date is not valid, set it to the current date    
            }
            
          return newPubDate;
    }

    validateWeightOrSize(searchTerm){
        
        if (searchTerm) {
            if (isNaN(searchTerm)) {
                // toastr.error('Weight must be a number.');
                return 1;
            }
            if (searchTerm < 0) {
                // toastr.error('Weight must be a positive number.');
                return 1;
            }
        }
    }

    validateAge(pubDate){
        const publicationYear = new Date(pubDate).getFullYear();
        const currentYear = new Date().getFullYear();
        return (currentYear - publicationYear);
    }
}


class PrintedBook extends BaseClass{
    constructor(title, author, genre, isbn, price, pubDate, weight){
        super(title, author, genre, isbn, price, pubDate);
        this.weight = this.validateWeightOrSize(weight);
    }
}

class EBook extends BaseClass{
    constructor(title, author, genre, isbn, price, pubDate, size){
        super(title, author, genre, isbn, price, pubDate);
        this.size = this.validateWeightOrSize(size);
    }

}


class BookManager {
    constructor() {
      this.apiUrl = './books.json';
      this.books = [];
      let originalBooks = []; // To store the original books fetched from the API
      this.booksPerPage = 5;
  
      // DOM elements
      this.form = document.querySelector('#addBookForm');
      this.bookCountDiv = document.getElementById('bookCount');
      this.bookListDiv = document.getElementById('bookList');
      this.categorizedBookListDiv = document.getElementById('bookList1');
      this.sortAscButton = document.getElementById('sortAsc');
      this.sortDescButton = document.getElementById('sortDesc');
  
      // Initialize the application
      this.initialize();
    }
  
    async initialize() {
        this.attachEventListeners();
        await this.fetchBooks();
      this.updateBookDisplay();
    }
  
    attachEventListeners() { // Attach event listeners to the form and buttons
      document.getElementById('applyFilters').addEventListener('click', () => this.filterBooks());
      document.getElementById('resetFilters').addEventListener('click', () => this.resetFilters());
      this.sortAscButton.addEventListener('click', () => this.sortBooks('asc'));
      this.sortDescButton.addEventListener('click', () => this.sortBooks('desc'));
      this.form.addEventListener('submit', (e) => this.addBook(e));
    //   document.getElementById('edit').addEventListener('click', () => this.handleEdit()); //also working
    document.querySelector('#editBookForm button').addEventListener('click', this.handleEdit.bind(this));  // bind helps to access the this keyword
    document.querySelector('#deleteBookForm button').addEventListener('click', () => this.handleDelete().bind(this));
    document.querySelector('#categorizeBooksForm button').addEventListener('click', () => this.handleCategorize().bind(this));    //   
    document.getElementById('remove').addEventListener('click', () => this.removeCategorizedBooks()); //also working
    document.getElementById('formContainer').addEventListener('click', (e) => {
        if (e.target.id === 'formContainer') {
          this.closeForm();
        }
    }); // Close the form container when the user clicks outside the form
            
    }
  
    async fetchBooks() {
      this.showLoader("Fetching books...");
  
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
        const response = await fetch(this.apiUrl);
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const booksObject = await response.json();
        // this.books = Object.values(booksObject);

        // Convert booksObject into an array of BaseClass instances
        this.books = Object.values(booksObject).map(book => 
            new BaseClass(
                book.title, 
                book.author, 
                book.genre, 
                book.isbn, 
                book.price || null, // Optional price (if it's not provided in the book object)
                book.pubDate
            )
        );
        this.originalBooks = [...this.books]; 
        toastr.success('Books fetched successfully');
      } catch (error) {
        toastr.error(`Error fetching books: ${error.message}`);
        this.bookListDiv.textContent = 'Failed to load book data.';
      } finally {
        this.hideLoader();
      }
    }
    
    showLoader = (message = "Loading...") => {
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

    hideLoader = () => {
        const loader = document.getElementById('globalLoader');
        if (loader) {
        loader.remove();
        }
    };

    closeForm() {
        document.getElementById('formContainer').classList.add('hidden'); // hide the Container
        document.querySelectorAll('#formContainer > div').forEach(div => div.classList.add('hidden')); // hide all the forms within the container
    }
         
    scrollToBottom() {
          window.scrollTo({
            top: document.body.scrollHeight, // Scroll to the bottom
            behavior: 'smooth', // Smooth scrolling animation
          });
        }
      
    scrollToTop() {
          window.scrollTo({
              top: 0,
              behavior: 'smooth'
          });
      }

    updateBookDisplay(currentPage = 1) {
      const startIndex = (currentPage - 1) * this.booksPerPage;
      const endIndex = Math.min(startIndex + this.booksPerPage, this.books.length);
  
      this.bookCountDiv.textContent = `Number of books: ${this.books.length}`;
      this.bookListDiv.innerHTML = '';
  
      if (this.books.length === 0) {
        this.bookListDiv.textContent = 'No Results';
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
          <th class="px-4 py-2">Price</th>
        `;
        table.appendChild(headerRow);
  
        for (let i = startIndex; i < endIndex; i++) {
          const book = this.books[i];
        //   book.age = this.validateAge(book.pubDate);
  
          const row = document.createElement('tr');
          row.classList.add('border-t', 'border-gray-200');
          row.innerHTML = `
            <td class="px-4 py-2">${book.title}</td>
            <td class="px-4 py-2">${book.author}</td>
            <td class="px-4 py-2">${book.isbn}</td>
            <td class="px-4 py-2">${book.pubDate}</td>
            <td class="px-4 py-2">${book.genre}</td>
            <td class="px-4 py-2">${book.age}</td>
            <td class="px-4 py-2">${book.price}</td>
          `;
          table.appendChild(row);
        }
  
        this.bookListDiv.appendChild(table);
  
        if (this.books.length > this.booksPerPage) {
          this.addPaginationButtons(currentPage);
        }
      }
    }
  
    addPaginationButtons(currentPage) {
      const paginationDiv = document.createElement('div');
      paginationDiv.classList.add('flex', 'justify-center', 'mt-4');
  
      const prevButton = document.createElement('button');
      prevButton.textContent = 'Previous';
      prevButton.classList.add('px-4', 'py-2', 'bg-gray-200', 'hover:bg-gray-300', 'disabled:opacity-50', 'cursor-pointer');
      prevButton.disabled = currentPage === 1;
      prevButton.addEventListener('click', () => this.updateBookDisplay(currentPage - 1));
      paginationDiv.appendChild(prevButton);
  
      const nextButton = document.createElement('button');
      nextButton.textContent = 'Next';
      nextButton.classList.add('px-4', 'py-2', 'bg-gray-200', 'hover:bg-gray-300', 'disabled:opacity-50', 'cursor-pointer');
      nextButton.disabled = currentPage === Math.ceil(this.books.length / this.booksPerPage);
      nextButton.addEventListener('click', () => this.updateBookDisplay(currentPage + 1));
      paginationDiv.appendChild(nextButton);
  
      this.bookListDiv.appendChild(paginationDiv);
    }
  
    filterBooks() {
      const searchTerm = document.getElementById('searchTerm').value.toLowerCase();
      const filterGenre = document.getElementById('filterGenre').value;
      const filterYear = document.getElementById('filterYear').value;
  
      this.books = [...this.originalBooks]; // Reset the books array to the original books fetched from the API
      this.books = this.books.filter(book => {
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
  
      toastr.success("Filter applied successfully");
      this.updateBookDisplay();
    }
  
    // resetFilters() {  // Not working as expected
    //   document.getElementById('searchTerm').value = '';
    //   document.getElementById('filterGenre').value = '';
    //   document.getElementById('filterYear').value = '';
  
      
    //   this.fetchBooks();
    //   setTimeout(() => toastr.success("Reset successfully"), 1000);
    //   this.updateBookDisplay();
    // }
    
    resetFilters() {
        // Clear the filter inputs
        document.getElementById('searchTerm').value = '';
        document.getElementById('filterGenre').value = '';
        document.getElementById('filterYear').value = '';
      
        this.books = [...this.originalBooks]; // Reset the books array to the original state
        this.updateBookDisplay();

        // setTimeout(function() { // not working because function has its own this keyword
        //   this.scrollToTop();  // this refers to the window object
        //   toastr.success('Filters reset successfully.');
        // }, 1000);


        // setTimeout(() => {   // working because arrow function does not have its own this keyword
        //   this.scrollToBottom(); // this refers to the BookManager object
        //   toastr.success('Filters reset successfully.');
        // }, 1000); 

        // Use .bind() to explicitly bind 'this'
        setTimeout(function() {
          this.scrollToBottom();
          toastr.success('Filters reset successfully.');
        }.bind(this), 1000); // 1000 milliseconds = 1 second

      }

    sortBooks(order) {
      this.books.sort((a, b) => {
        if (a.title.toLowerCase() < b.title.toLowerCase()) return order === 'asc' ? -1 : 1;
        if (a.title.toLowerCase() > b.title.toLowerCase()) return order === 'asc' ? 1 : -1;
        return 0;
      });
      toastr.success(`${order} order.`);
      this.updateBookDisplay();
    }
  
    addBook(event) {
      event.preventDefault();
  
      const title = document.getElementById('title').value.trim();
      const author = document.getElementById('author').value.trim();
      const isbn = document.getElementById('isbn').value.trim();
      const pubDate = document.getElementById('pub_date').value;
      const genre = document.getElementById('genre').value;
  
      if (!title || !author || !isbn || !pubDate || !genre) {
        toastr.error('Please fill out all fields.');
        return;
      } 
  
      if (this.books.some(book => book.isbn === isbn)) {
        toastr.error('ISBN already exists.');
        return;
      }

        const book = new BaseClass(title, author, genre, isbn, null, pubDate);
        this.books.push(book);

      this.closeForm();
      toastr.success(`${title} has been added.`);

      document.getElementById('title').value = '';
      document.getElementById('author').value = '';
      document.getElementById('isbn').value = '';
      document.getElementById('pub_date').value = '';
      document.getElementById('genre').value = '';

      updateBookDisplay();
    }

    // Handle Edit functionality
    handleEdit() {
        const isbn = document.getElementById('editIsbn').value.trim();
        const newTitle = document.getElementById('newTitle').value.trim();
        const newAuthor = document.getElementById('newAuthor').value.trim();
        const newPubDate = document.getElementById('newPubDate').value;
        const newGenre = document.getElementById('newGenre').value;

        if (!isbn) {
        toastr.error('Please enter a valid ISBN.');
        return;
        }

        // Find the book to edit
        const bookIndex = this.books.findIndex((book) => book.isbn === isbn);
        if (bookIndex === -1) {
        toastr.error('Book not found.');
        return;
        }

        // Update the book's details
        if (newTitle) this.books[bookIndex].title = newTitle;
        if (newAuthor) this.books[bookIndex].author = newAuthor;
        if (newPubDate) this.books[bookIndex].pubDate = newPubDate;
        if (newGenre) this.books[bookIndex].genre = newGenre;

        this.closeForm();
        toastr.success('Book updated successfully.');
        this.updateBookDisplay();
    }

    // Handle Delete functionality
    handleDelete() {
        const isbn = document.getElementById('deleteIsbn').value.trim();

        if (!isbn) {
        toastr.error('Please enter a valid ISBN.');
        return;
        }

        // Find and remove the book
        const bookIndex = this.books.findIndex((book) => book.isbn === isbn);
        if (bookIndex === -1) {
        toastr.error('Book not found.');
        return;
        }

        this.closeForm();
        this.books.splice(bookIndex, 1);
        toastr.success('Book deleted successfully.');
        this.updateBookDisplay();
    }

    // Handle Categorize functionality
    handleCategorize() {
        const genres = this.books.reduce((acc, book) => {
        if (!acc[book.genre]) {
            acc[book.genre] = [];
        }
        acc[book.genre].push(book);
        return acc;
        }, {});

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
                        <span class="text-sm text-gray-600">ISBN: ${book.isbn}, Published: ${book.pubDate}, Price: ${book.price}</span>
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

        this.categorizedBookListDiv.innerHTML = `
        <h2 class="text-xl font-bold text-gray-900 mb-4">Categorized Books</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            ${categorizedHTML}
        </div>
        `;
        
        this.closeForm();
        this.scrollToBottom();

        toastr.success('Books categorized successfully.');
    }

    // Remove categorized books
    removeCategorizedBooks() {
        this.categorizedBookListDiv.innerHTML = `
        <h2 class="text-xl font-bold text-gray-900 mb-4">Categorized Books</h2>
        <p class="text-gray-600 italic">No categorized books available.</p>
        `;
        this.closeForm();
        toastr.success('Categorized books removed successfully.');
    }

}  

const bookManager = new BookManager();

function showForm(formId) {
    document.getElementById('formContainer').classList.remove('hidden'); //show the Container
    document.querySelectorAll('#formContainer > div').forEach(div => div.classList.add('hidden')); // hide all the forms within the container
    document.getElementById(formId).classList.remove('hidden'); // show the specific form based on the formId
}

