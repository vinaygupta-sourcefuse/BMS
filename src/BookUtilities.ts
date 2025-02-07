export class BookUtilities {
    private static validStringPattern = /^[a-zA-Z0-9\s]+$/;

    static validateTitle(title: string): string {
        if (title && !this.validStringPattern.test(title)) { // Check if the title is valid  and not empty
            toastr.error(`title must only contain letters, numbers, and spaces.`);
            return 'Special Characters not allowed';
        }
        return title;
    }
  
    static validateAuthor(author: string): string {
        if (author && !this.validStringPattern.test(author)) { // Check if the title is valid  and not empty
            toastr.error(`author must only contain letters, numbers, and spaces.`);
            return 'Special Characters not allowed';
        }
        return author;
    }

    static validateIsbn(isbn: number): number {
        if(isNaN(isbn)){
            toastr.error('isbn must be in Numbers')
            return -1;
        }
        return isbn>0 ? isbn : Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000;
    }

    static validatePrice(price: number): number | null {
        if(isNaN(price)){
            toastr.error('price must be in Numbers')
            return -1;
        }
        return price > 0 ? price : null;
    }

    static validatePublicationDate(pubDate?: string): string {
        if(!pubDate){  return '';}
        const pubDateObj = new Date(pubDate);
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        const currentDate = new Date().toISOString().split('T')[0];
        if (!pubDateObj || isNaN(pubDateObj.getTime()) || pubDateObj > new Date() || !regex.test(pubDate)){ 
          toastr.error('Invalid publication date.');
          return 'Invalid publication date';
        }

        return pubDateObj && !isNaN(pubDateObj.getTime()) && pubDateObj <= new Date() && regex.test(pubDate) 
            ? pubDate 
            : currentDate;
    }

    public static showLoader(message: string = "Loading..."): void {
   
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

    public static hideLoader(): void {
        document.getElementById('globalLoader')?.remove();
    }   
}
