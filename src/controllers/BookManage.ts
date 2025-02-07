import { IBook } from '../modals/IBook';
import { BookUtilities } from './BookUtilities.js';
import { BookDOMe } from './BookDOMe.js';
import { PrintedBook } from '../modals/PrintedBook.js'; // Assuming Base is your book class (e.g., PrintedBook or EBook)

export class BookManage<T extends IBook> {
  private apiUrl: string = './books.json';
  private books: T[] = [];
  private form: HTMLFormElement | null;
  private categorizedBookListDiv: HTMLElement | null;
  private bookDOMe!: BookDOMe<T>;

  constructor() {
    this.form = document.querySelector('#addBookForm');
    this.categorizedBookListDiv = document.getElementById('bookList1');
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.fetchBooks();
    this.bookDOMe = new BookDOMe(this.books);
    this.bookDOMe.updateBookDisplay();
    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    if (this.form) {
      document.getElementById('applyFilters')?.addEventListener('click', () => this.bookDOMe.filterBooks());
      document.getElementById('resetFilters')?.addEventListener('click', () => this.bookDOMe.resetFilters());
      this.form.addEventListener('submit', (event) => this.addBook(event));
      document.querySelector('#categorizeBooksForm button')?.addEventListener('click', () => this.bookDOMe.handleCategorize(this.categorizedBookListDiv));
      document.getElementById('remove')?.addEventListener('click', () => this.bookDOMe.removeCategorizedBooks(this.categorizedBookListDiv));
      document.querySelector('#editBookForm button')?.addEventListener('click', this.handleEdit.bind(this));  // bind helps to access the this keyword    
      document.querySelector('#deleteBookForm button')?.addEventListener('click', () => this.handleDelete()); // no need to call using bind() in arrow function
    }
  }

  public addBook(event: Event): void {
    event.preventDefault();
    
    const title = (document.getElementById('title') as HTMLInputElement)?.value.trim();
    const author = (document.getElementById('author') as HTMLInputElement)?.value.trim();
    const isbn = Number((document.getElementById('isbn') as HTMLInputElement)?.value.trim());
    const price = Number((document.getElementById('price') as HTMLInputElement)?.value.trim());
    const pubDate = (document.getElementById('pub_date') as HTMLInputElement)?.value;
    const genre = (document.getElementById('genre') as HTMLInputElement)?.value;

    // Validate the input fields
    if (BookUtilities.validateTitle(title) === 'Special Characters not allowed') return;
    if (BookUtilities.validateAuthor(author) === 'Special Characters not allowed') return;
    if (BookUtilities.validateIsbn(isbn) === -1) return;
    if (BookUtilities.validatePrice(price) === -1) return;
    if (BookUtilities.validatePublicationDate(pubDate) === 'Invalid publication date') return;
    //'pages' still not added in html
    const pages = Number((document.getElementById('pages') as HTMLInputElement)?.value.trim());
    
    if (this.books.some(book => book.isbn === isbn)) {
      toastr.error('ISBN already exists.');
      return;
    }

    // Create a new book instance (modify this if you have different book types)
    const book = new PrintedBook(title, author, genre, isbn, price, pubDate, pages) as unknown as T;
    this.books.push(book);
    
    // Close the form (assuming BookDOMe has a closeForm method)
    BookDOMe.closeForm();  // Replace with your actual form-close logic
    toastr.success(`${title} has been added.`);

    // Reset the Add form fields
    const elementIds = ['title', 'author', 'isbn', 'price', 'pub_date', 'genre'];
    elementIds.forEach(id => {
      const element = document.getElementById(id) as HTMLInputElement;
      if (element) {
        element.value = '';
      }
    });

    // Update the book display with the new book
    this.bookDOMe.updateBookDisplay(this.books);
  }

  private async fetchBooks(): Promise<void> {
    BookUtilities.showLoader('Fetching books...');
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const booksObject: Record<string, any> = await response.json();
      this.books = Object.values(booksObject).map((book: any) => this.createBookInstance(book));
      toastr.success('Books fetched successfully');
    } catch (error) {
      toastr.error(`Error fetching books: ${error}`);
    } finally {
      BookUtilities.hideLoader();
    }
  }

  private createBookInstance(book: any): T {
    // Customize this method to return the correct instance type (EBook, PrintedBook, etc.)
    return book as T;
  }

   // Handle Edit functionality
      public handleEdit(): void {
        const isbn = Number((document.getElementById('editIsbn') as HTMLInputElement)?.value.trim());
        const newTitle = (document.getElementById('newTitle') as HTMLInputElement)?.value.trim();
        const newAuthor = (document.getElementById('newAuthor') as HTMLInputElement )?.value.trim();
        const newPubDate = (document.getElementById('newPubDate') as HTMLInputElement )?.value;
        const newGenre = (document.getElementById('newGenre') as HTMLInputElement )?.value;
        const newPrice = (document.getElementById('newPrice') as HTMLInputElement )?.value;
  
        // Validate the input fields
        if(BookUtilities.validateIsbn(isbn) === -1) return;
        if(BookUtilities.validatePrice(Number(newPrice)) === -1) return;
        if(BookUtilities.validateTitle(newTitle) === 'Special Characters not allowed') return;
        if(BookUtilities.validateAuthor(newAuthor) === 'Special Characters not allowed') return;
        if(BookUtilities.validatePublicationDate(newPubDate) === 'Invalid publication date') return;
        
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
            if (newPrice) this.books[bookIndex].price = Number(newPrice);
            
            BookDOMe.closeForm();
            toastr.success('Book updated successfully.');
            this.bookDOMe.updateBookDisplay(this.books);
      }
        
       // Handle Delete functionality
      public handleDelete() : void{
        const isbn = Number((document.getElementById('deleteIsbn') as HTMLInputElement)?.value.trim());
        if(BookUtilities.validateIsbn(isbn) === -1) return;
  
        // Find the index of the book to delete
        const bookIndex = this.books.findIndex((book) => book.isbn == Number(isbn));
        if (bookIndex === -1) {
        toastr.error('Book not found.');
        return;
        }
  
        BookDOMe.closeForm();
        this.books.splice(bookIndex, 1); // Remove the book from the books array
        toastr.success('Book deleted successfully.');
        this.bookDOMe.updateBookDisplay(this.books);
      }
}
