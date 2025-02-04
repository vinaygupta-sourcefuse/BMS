"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
class Base {
    constructor(title, author, genre, isbn, price, pubDate) {
        this.title = this.validate(title);
        ;
        this.author = this.validate(author);
        ;
        this.genre = genre;
        this.isbn = isbn;
        this.price = price;
        this.pubDate = this.validatePublicationDate(pubDate);
        this.age = pubDate ? this.validateAge(pubDate) : null;
    }
    validate(searchTerm) {
        const validStringPattern = /^[a-zA-Z0-9\s]+$/;
        if (searchTerm && !validStringPattern.test(searchTerm)) { // Check if the title is valid  and not empty
            return 'Special Characters not allowed';
        }
        return searchTerm;
    }
    validatePublicationDate(newPubDate) {
        const pubDateObj = new Date(newPubDate);
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!pubDateObj || isNaN(pubDateObj.getTime()) || pubDateObj > new Date() || !regex.test(newPubDate)) {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0]; // Format the date to YYYY-MM-DD
            return formattedDate; // if the publication date is not provided or provided date is not valid, set it to the current date    
        }
        return newPubDate;
    }
    validateAge(pubDate) {
        const year = new Date(pubDate).getFullYear();
        return new Date().getFullYear() - year;
    }
}
exports.Base = Base;
