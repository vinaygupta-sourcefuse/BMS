import { Base } from './Book.js'; // Add `.js` extension after compiling to JS
import {BookUtilities} from './BookUtilities.js';
import {BookDOM} from './BookDOM.js';

export class BookManager {
    private apiUrl: string = './books.json';
    private books: Base[] = [];
    private form: HTMLFormElement | null;
    private categorizedBookListDiv : HTMLElement | null;
    private bookDOM!: BookDOM;
    
    constructor() {
      this.form = document.querySelector('#addBookForm');
      this.categorizedBookListDiv = document.getElementById('bookList1');
      this.initialize();
    }
    
    //this initialize method will help us to fetch the books from the API and after this display it on the screen
    // async and await will help us to wait for the fetchBooks method to complete and then display the books on the screen
    private async initialize(): Promise<void> {
      await this.fetchBooks();
      this.bookDOM = new BookDOM(this.books);  // has-a relationship with BookDOM
      this.bookDOM.updateBookDisplay();
      this.attachEventListeners();
    }
   
    private attachEventListeners(): void {
        document.getElementById('applyFilters')?.addEventListener('click', () => this.bookDOM.filterBooks());
        document.getElementById('resetFilters')?.addEventListener('click', () => this.bookDOM.resetFilters());
        this.form?.addEventListener('submit', (e) => this.addBook(e));
        document.querySelector('#editBookForm button')?.addEventListener('click', this.handleEdit.bind(this));  // bind helps to access the this keyword    
        document.querySelector('#deleteBookForm button')?.addEventListener('click', () => this.handleDelete()); // no need to call using bind() in arrow function
        document.querySelector('#categorizeBooksForm button')?.addEventListener('click', () => this.bookDOM.handleCategorize(this.categorizedBookListDiv));
        document.getElementById('remove')?.addEventListener('click', () => this.bookDOM.removeCategorizedBooks(this.categorizedBookListDiv));
    }

    private async fetchBooks(): Promise<void> {
        BookUtilities.showLoader("Fetching books...");
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const booksObject: Record<string, any> = await response.json();
            this.books = Object.values(booksObject).map((book: any) => new Base(book.title, book.author, book.genre, book.isbn, book.price, book.pubDate));
            toastr.success('Books fetched successfully');
        } catch (error) {
            toastr.error(`Error fetching books: ${error}`);
        } finally {
            BookUtilities.hideLoader();
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
      if(BookUtilities.validateTitle(title) === 'Special Characters not allowed') return;
      if(BookUtilities.validateAuthor(author) === 'Special Characters not allowed') return;
      if(BookUtilities.validateIsbn(isbn) === -1) return;
      if(BookUtilities.validatePrice(price) === -1) return;
      if(BookUtilities.validatePublicationDate(pubDate) === 'Invalid publication date') return;

      if (this.books.some(book => book.isbn === isbn)) {
          toastr.error('ISBN already exists.');
          return;
      }

      const book = new Base(title, author, genre, isbn, price, pubDate);
      this.books.push(book);
      BookDOM.closeForm();
      toastr.success(`${title} has been added.`);

      // reset the Add form fields
      const elementIds = ['title', 'author', 'isbn', 'price','pub_date', 'genre'];
      elementIds.forEach(id => {
        const element = document.getElementById(id) as HTMLInputElement;
        if (element) {
          element.value = '';
        }
      });
      
      // Update the book display with the new book change
      this.bookDOM.updateBookDisplay(this.books);
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
          
          BookDOM.closeForm();
          toastr.success('Book updated successfully.');
          this.bookDOM.updateBookDisplay(this.books);
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

      BookDOM.closeForm();
      this.books.splice(bookIndex, 1); // Remove the book from the books array
      toastr.success('Book deleted successfully.');
      this.bookDOM.updateBookDisplay(this.books);
    }
}