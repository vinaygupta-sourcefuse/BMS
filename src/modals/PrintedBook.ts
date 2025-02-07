import { IBook } from './IBook.js';

// export class PrintedBook implements IBook {
//   title: string;
//   author: string;
//   genre: string;
//   isbn: number;
//   price: number | null;
//   pubDate: string;

//   constructor(title: string, author: string, genre: string, isbn: number, price: number | null, pubDate: string) {
//     this.title = title;
//     this.author = author;
//     this.genre = genre;
//     this.isbn = isbn;
//     this.price = price;
//     this.pubDate = pubDate;
//   }

//   getSummary(): string {
//     return `Printed Book: ${this.title} by ${this.author}`;
//   }
// }
export class PrintedBook implements IBook {
  constructor(
    public title: string,
    public author: string,
    public genre: string,
    public isbn: number,
    public price: number | null,
    public pubDate: string,
    public pages: number
  ) {}
}