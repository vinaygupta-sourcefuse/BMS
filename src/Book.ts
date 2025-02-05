// export class Base {
//     title: string;
//     author: string;
//     genre: string;
//     isbn: number;
//     price: number | null;
//     pubDate: string;
//     age: number | null;

//     constructor(title: string, author: string, genre: string, isbn: number, price: number | null, pubDate: string) {
//         this.title = this.validate(title);;
//         this.author = this.validate(author);;
//         this.genre = genre;
//         this.isbn = isbn;
//         this.price = price;
//         this.pubDate = this.validatePublicationDate(pubDate); 
//         this.age = pubDate ? this.validateAge(pubDate) : null;
//     }
   
//     private validate(searchTerm :string): string{
//         const validStringPattern = /^[a-zA-Z0-9\s]+$/;

//         if (searchTerm && !validStringPattern.test(searchTerm)) { // Check if the title is valid  and not empty
//           return 'Special Characters not allowed';
//         }
//         return searchTerm;
//     }

//     private validatePublicationDate(newPubDate:string):string{
//             const pubDateObj = new Date(newPubDate);
//             const regex = /^\d{4}-\d{2}-\d{2}$/;

//             if (!pubDateObj || isNaN(pubDateObj.getTime()) || pubDateObj > new Date() || !regex.test(newPubDate)) {
//               const currentDate = new Date();
//               const formattedDate = currentDate.toISOString().split('T')[0]; // Format the date to YYYY-MM-DD
//               return formattedDate; // if the publication date is not provided or provided date is not valid, set it to the current date    
//             }            
//           return newPubDate;
//     }
  
//     private validateAge(pubDate: string): number {
//         const year = new Date(pubDate).getFullYear();
//         return new Date().getFullYear() - year;
//     }
// }

export class Base {
    title: string;
    author: string;
    genre: string;
    isbn: number;
    price: number | null;
    pubDate: string;
    age: number | undefined;

  constructor(title: string, author: string, genre: string, isbn: number, price: number | null, pubDate: string, age?: number) {
      this.title = title;
      this.author = author;
      this.genre = genre;
      this.isbn = isbn;
      this.price = price;
      this.pubDate = pubDate;
      this.age = age;
  }
}

class BookValidator {
  private static validStringPattern = /^[a-zA-Z0-9\s]+$/;

  static validateTitle(title: string): string {
      return title && this.validStringPattern.test(title) ? title : 'Special Characters not allowed';
  }

  static validatePublicationDate(pubDate: string): string {
      const pubDateObj = new Date(pubDate);
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      const currentDate = new Date().toISOString().split('T')[0];

      return pubDateObj && !isNaN(pubDateObj.getTime()) && pubDateObj <= new Date() && regex.test(pubDate) 
          ? pubDate 
          : currentDate;
  }
}

class BookAgeCalculator {
  static calculateAge(pubDate: string): number {
      return new Date().getFullYear() - new Date(pubDate).getFullYear();
  }
}


class BookFactory {
  static createBook(title: string, author: string, genre: string, isbn: number, price: number | null, pubDate: string): Base {
      const validatedTitle = BookValidator.validateTitle(title);
      const validatedPubDate = BookValidator.validatePublicationDate(pubDate);
      const book = new Base(validatedTitle, author, genre, isbn, price, validatedPubDate);
      console.log(`Book Age: ${BookAgeCalculator.calculateAge(validatedPubDate)}`);
      return book;
  }
}
