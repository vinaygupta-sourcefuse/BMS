import { IBook } from './IBook.js';

// export class EBook implements IBook {
//   title: string;
//   author: string;
//   genre: string;
//   isbn: number;
//   price: number | null;
//   pubDate: string;
//   fileSize: number;  // Additional property specific to EBook

//   constructor(title: string, author: string, genre: string, isbn: number, price: number | null, pubDate: string, fileSize: number) {
//     this.title = title;
//     this.author = author;
//     this.genre = genre;
//     this.isbn = isbn;
//     this.price = price;
//     this.pubDate = pubDate;
//     this.fileSize = fileSize;
//   }

//   getSummary(): string {
//     return `E-Book: ${this.title} by ${this.author} (File size: ${this.fileSize}MB)`;
//   }
// }

export class EBook implements IBook {
  constructor(
    public title: string,
    public author: string,
    public genre: string,
    public isbn: number,
    public price: number | null,
    public pubDate: string,
    public fileSize: number,
    public format: string
  ) {}
}