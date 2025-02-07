import { IBook } from './IBook.js';

// export class ResearchPaper implements IBook {
//   title: string;
//   author: string;
//   genre: string;
//   isbn: number;
//   price: number | null;
//   pubDate: string;
//   citationCount: number;

//   constructor(title: string, author: string, genre: string, isbn: number, price: number | null, pubDate: string, citationCount: number) {
//     this.title = title;
//     this.author = author;
//     this.genre = genre;
//     this.isbn = isbn;
//     this.price = price;
//     this.pubDate = pubDate;
//     this.citationCount = citationCount;
//   }

//   getSummary(): string {
//     return `Research Paper: ${this.title} (Citations: ${this.citationCount})`;
//   }
// }

export class ResearchPaper implements IBook {
  constructor(
    public title: string,
    public author: string,
    public genre: string,
    public isbn: number,
    public price: number | null,
    public pubDate: string,
    public journal: string
  ) {}
}
