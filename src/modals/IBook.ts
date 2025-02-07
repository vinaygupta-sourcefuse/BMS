export interface IBook {
    title: string;
    author: string;
    genre: string;
    isbn: number;
    price: number | null;
    pubDate: string;
    // getSummary(): string;  // Method to get a brief summary
  }
  