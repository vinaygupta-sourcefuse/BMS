import { Base } from './Book.js'; // Add `.js` extension after compiling to JS
import { BookUtilities } from './BookUtilities.js';
import { BookAgeCalculator } from './BookAgeCalculator';


class BookFactory {
    private apiUrl: string = './books.json';
    private books: Base[] = [];
    private originalBooks: Base[] = [];
    private bookCountDiv: HTMLElement | null;
    private bookListDiv: HTMLElement | null;
    private booksPerPage: number = 5;
    private form: HTMLFormElement | null;
    private sortAscButton: HTMLElement | null;
    private sortDescButton: HTMLElement | null;
    private categorizedBookListDiv : HTMLElement | null;

    constructor() {
        this.form = document.querySelector('#addBookForm');
        this.bookCountDiv = document.getElementById('bookCount');
        this.bookListDiv = document.getElementById('bookList');
        this.sortAscButton = document.getElementById('sortAsc');
        this.sortDescButton = document.getElementById('sortDesc');
        this.categorizedBookListDiv = document.getElementById('bookList1');

        this.initialize();
    }

    private async initialize(): Promise<void> {
        this.attachEventListeners();
        await this.fetchBooks();
        this.updateBookDisplay();
    }

    private attachEventListeners(): void {
        document.getElementById('applyFilters')?.addEventListener('click', () => this.filterBooks());
        document.getElementById('resetFilters')?.addEventListener('click', () => this.resetFilters());
        this.sortAscButton?.addEventListener('click', () => this.sortBooks('asc'));
        this.sortDescButton?.addEventListener('click', () => this.sortBooks('desc'));
        this.form?.addEventListener('submit', (e) => this.addBook(e));
        
        document.querySelector('#editBookForm button')?.addEventListener('click', this.handleEdit.bind(this));  // bind helps to access the this keyword
        (window as any).handleEdit = this.handleEdit; // make it globally available because i used type="module" with <script>
        
        document.querySelector('#deleteBookForm button')?.addEventListener('click', () => this.handleDelete()); // no need to call using bind() in arrow function
        (window as any).handleDelete = this.handleDelete; // make it globally available because i used type="module" with <script>
    
        document.querySelector('#categorizeBooksForm button')?.addEventListener('click', () => this.handleCategorize());    //   
        (window as any).handleCategorize = this.handleCategorize; // make it globally available because i used type="module" with <script>
    
        document.getElementById('remove')?.addEventListener('click', () => this.removeCategorizedBooks()); //also working
        (window as any).removeCategorizedBooks = this.removeCategorizedBooks; // make it globally available because i used type="module" with <script>
    

        document.getElementById('formContainer')?.addEventListener('click', (e) => {
            if (e.target && (e.target as HTMLElement).id === 'formContainer') {
              this.closeForm();
            }
        }); // Close the form container when the user clicks outside the form
    }

    private async fetchBooks(): Promise<void> {
        this.showLoader("Fetching books...");
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const booksObject: Record<string, any> = await response.json();
            this.books = Object.values(booksObject).map((book: any) => new Base(book.title, book.author, book.genre, book.isbn, book.price, book.pubDate));
            this.originalBooks = [...this.books];
            toastr.success('Books fetched successfully');
        } catch (error) {
            toastr.error(`Error fetching books: ${error}`);
        } finally {
            document.getElementById('globalLoader')?.remove();
        }
    }

    private showLoader(message: string = "Loading..."): void {
        const loader = document.createElement('div');
        loader.id = 'globalLoader';
        loader.classList.add('fixed', 'top-0', 'left-0', 'w-full', 'h-screen', 'bg-black', 'bg-opacity-50', 'flex', 'justify-center', 'items-center', 'z-50');        
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
    }

    // Update the display with books and pagination
    private updateBookDisplay(currentPage: number = 1): void {
        const startIndex: number = (currentPage - 1) * this.booksPerPage;
        const endIndex: number = Math.min(startIndex + this.booksPerPage, this.books.length);

        // Update the book count display
        if (this.bookCountDiv) {
            this.bookCountDiv.textContent = `Number of books: ${this.books.length}`;
        }
        if (this.bookListDiv) {
            this.bookListDiv.innerHTML = '';
        }

        if (this.books.length === 0 && this.bookListDiv) {
            this.bookListDiv.textContent = 'No Results';
        } else {
        // Create a table to display books
        const table: HTMLTableElement = document.createElement('table');
        table.classList.add('min-w-full',  'table-auto', 'bg-white', 'shadow-lg', 'rounded-lg', 'overflow-hidden', 'block', 'w-full', 'overflow-x-auto', 'sm:table');

        // Create table header
        const headerRow: HTMLTableRowElement = document.createElement('tr');
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

        // Loop through books and add them to the table
        for (let i = startIndex; i < endIndex; i++) {
            const book: Base = this.books[i];
            const row: HTMLTableRowElement = document.createElement('tr');
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

        // Append the table to the book list div
        if (this.bookListDiv) 
            this.bookListDiv.appendChild(table);

        // Add pagination buttons if needed
        if (this.books.length > this.booksPerPage) 
            this.addPaginationButtons(currentPage);
        }
    }

    // Method to add pagination buttons (you can implement this method)
    private addPaginationButtons(currentPage: number): void {
        const paginationDiv: HTMLDivElement = document.createElement('div');
        paginationDiv.classList.add('flex', 'justify-center', 'mt-4');

        const prevButton: HTMLButtonElement = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.classList.add('px-4', 'py-2', 'bg-gray-200', 'hover:bg-gray-300', 'disabled:opacity-50', 'cursor-pointer');
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => this.updateBookDisplay(currentPage - 1));
        paginationDiv.appendChild(prevButton);

        const nextButton: HTMLButtonElement = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.classList.add('px-4', 'py-2', 'bg-gray-200', 'hover:bg-gray-300', 'disabled:opacity-50', 'cursor-pointer');
        nextButton.disabled = currentPage === Math.ceil(this.books.length / this.booksPerPage);
        nextButton.addEventListener('click', () => this.updateBookDisplay(currentPage + 1));
        paginationDiv.appendChild(nextButton);

        // Append the pagination div to the book list div
        if(this.bookListDiv){
        this.bookListDiv.appendChild(paginationDiv);
        }
    }
    
    private filterBooks() : void{
        const searchTerm = (document.getElementById('searchTerm') as HTMLInputElement)?.value.toLowerCase();
        const filterGenre = (document.getElementById('filterGenre') as HTMLInputElement)?.value;
        const filterYear = (document.getElementById('filterYear') as HTMLInputElement)?.value;
        const validStringPattern = /^[a-zA-Z0-9\s]+$/;

        if (searchTerm && !validStringPattern.test(searchTerm)) { // Check if the title is valid  and not empty
          toastr.error(`${searchTerm} must only contain letters, numbers, and spaces.`);
        }
        if(filterYear){
            const currentYear = new Date().getFullYear();
            if (parseInt(filterYear, 10) > currentYear) {
                toastr.error('Filter year cannot be greater than the current year.');
                return;
            }
        }

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
      
    private resetFilters() : void{ // Clear the filter inputs
          (document.getElementById('searchTerm') as HTMLInputElement).value = '';
          (document.getElementById('filterGenre') as HTMLInputElement).value = '';
          (document.getElementById('filterYear') as HTMLInputElement).value = '';      
    
          this.books = [...this.originalBooks]; // Reset the books array to the original state
          this.updateBookDisplay();

          this.scrollToBottom();
          toastr.success('Filters reset successfully.');
    }
  
    private sortBooks(order: 'asc' | 'desc'): void {
        this.books.sort((a, b) => order === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
        this.updateBookDisplay();
    }

    private closeForm() : void {
        document.getElementById('formContainer')?.classList.add('hidden'); // hide the Container
        document.querySelectorAll('#formContainer > div').forEach(div => div.classList.add('hidden')); // hide all the forms within the container
    }

    private addBook(event: Event): void {
        event.preventDefault();
        const title = (document.getElementById('title') as HTMLInputElement)?.value.trim();
        const author = (document.getElementById('author') as HTMLInputElement)?.value.trim();
        const isbn = Number((document.getElementById('isbn') as HTMLInputElement)?.value.trim());
        const price = Number((document.getElementById('price') as HTMLInputElement)?.value.trim());
        const pubDate = (document.getElementById('pub_date') as HTMLInputElement)?.value;
        const genre = (document.getElementById('genre') as HTMLInputElement)?.value;
        
        const validStringPattern = /^[a-zA-Z0-9\s]+$/;
        if (title && !validStringPattern.test(title)) { // Check if the title is valid  and not empty
            toastr.error(`title must only contain letters, numbers, and spaces.`);
        }
        if (author && !validStringPattern.test(author)) { // Check if the title is valid  and not empty
            toastr.error(`author must only contain letters, numbers, and spaces.`);
        }
        if(isNaN(isbn) || isNaN(price)){
            toastr.error('isbn and price must be in Numbers')
        }
        if(pubDate){
            const pubDateObj = new Date(pubDate);
            const regex = /^\d{4}-\d{2}-\d{2}$/;
            if (!pubDateObj || isNaN(pubDateObj.getTime()) || pubDateObj > new Date() || !regex.test(pubDate))
              toastr.error('Invalid publication date.');
        }

        if (this.books.some(book => book.isbn === isbn)) {
            toastr.error('ISBN already exists.');
            return;
        }

        const book = new Base(title, author, genre, isbn, price, pubDate);
        this.books.push(book);
        this.originalBooks = this.books;
        this.closeForm();
        toastr.success(`${title} has been added.`);

        const elementIds = ['title', 'author', 'isbn', 'price','pub_date', 'genre'];
        elementIds.forEach(id => {
          const element = document.getElementById(id) as HTMLInputElement;
          if (element) {
            element.value = '';
          }
        });
        
      this.updateBookDisplay();
    }
    // console.log(this.books); //why this will not work in this scope?

    // Handle Edit functionality
    private handleEdit() :void{
        const isbn = Number((document.getElementById('editIsbn') as HTMLInputElement)?.value.trim());
        const newTitle = (document.getElementById('newTitle') as HTMLInputElement)?.value.trim();
        const newAuthor = (document.getElementById('newAuthor') as HTMLInputElement )?.value.trim();
        const newPubDate = (document.getElementById('newPubDate') as HTMLInputElement )?.value;
        const newGenre = (document.getElementById('newGenre') as HTMLInputElement )?.value;

        if (!isbn && isNaN(isbn)) {
        toastr.error('Please enter a valid ISBN.');
        return;
        }
        const validStringPattern = /^[a-zA-Z0-9\s]+$/;
        if (newTitle && !validStringPattern.test(newTitle)) { // Check if the title is valid  and not empty
            toastr.error(`title must only contain letters, numbers, and spaces.`);
        }
        if (newAuthor && !validStringPattern.test(newAuthor)) { // Check if the title is valid  and not empty
            toastr.error(`author must only contain letters, numbers, and spaces.`);
        }
        
          if(newPubDate){
            const pubDateObj = new Date(newPubDate);
            const regex = /^\d{4}-\d{2}-\d{2}$/;

            if (!pubDateObj || isNaN(pubDateObj.getTime()) || pubDateObj > new Date() || !regex.test(newPubDate))
              toastr.error('Invalid publication date.');
          }

        // Find the book to edit
        const bookIndex = this.books.findIndex((book) => book.isbn == Number(isbn));
        if (bookIndex === -1) {
        toastr.error('Book not found.');
        return;
    }
    
    // Update the book's details
    if (newTitle) this.books[bookIndex].title = newTitle;
        if (newAuthor) this.books[bookIndex].author = newAuthor;
        if (newPubDate) this.books[bookIndex].pubDate = newPubDate;
        if (newGenre) this.books[bookIndex].genre = newGenre;

        this.originalBooks = this.books;
        this.closeForm();
        toastr.success('Book updated successfully.');
        this.updateBookDisplay();
    }

    // Handle Delete functionality
    private handleDelete() : void{
        const isbn = Number((document.getElementById('deleteIsbn') as HTMLInputElement)?.value.trim());
        if (!isbn && isNaN(isbn)) {
            toastr.error('Please enter a valid ISBN.');
            return;
        }

        // Find and remove the book
        const bookIndex = this.books.findIndex((book) => book.isbn == Number(isbn));
        if (bookIndex === -1) {
        toastr.error('Book not found.');
        return;
        }

        this.closeForm();
        this.books.splice(bookIndex, 1);
        toastr.success('Book deleted successfully.');
        this.originalBooks = this.books;
        this.updateBookDisplay();
    }

     // Handle Categorize functionality
    private handleCategorize() : void{
       if(this.books.length === 0){
        toastr.error('No books available')
        return;
       }
        const genres: { [key: string]: Base[] } = (this.books ?? []).reduce((acc, book) => { 
            //If this.books is undefined or null, this.books ?? [] ensures it falls back to an empty array.
            if (!acc[book.genre]) {
                acc[book.genre] = [];
            }
            acc[book.genre].push(book);
            return acc;
        }, {} as { [key: string]: Base[] });
        

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

        if(this.categorizedBookListDiv)
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
  
    private scrollToBottom(): void {
        window.scrollTo({
          top: document.body.scrollHeight, // Scroll to the bottom
          behavior: 'smooth', // Smooth scrolling animation
        });
      }
    
    // Remove categorized books
    private removeCategorizedBooks() :void{
        if(this.categorizedBookListDiv)
        this.categorizedBookListDiv.innerHTML = ``;
        this.closeForm();
        toastr.success('Categorized books removed successfully.');
    }
}

function showForm(formId: string): void {
    const formContainer = document.getElementById('formContainer');
        formContainer?.classList.remove('hidden'); //show the Container
        document.querySelectorAll('#formContainer > div').forEach(div => div.classList.add('hidden')); // hide all the forms within the container
        document.getElementById(formId)?.classList.remove('hidden');
}
(window as any).showForm = showForm; // make it globally available because i used type="module" with <script>

document.addEventListener('DOMContentLoaded', () => { 
    new BookFactory();
});
