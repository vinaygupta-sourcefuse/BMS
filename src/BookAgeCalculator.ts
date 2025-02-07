export class BookAgeCalculator {
    public static calculateAge(pubDate: string): number {
        return new Date().getFullYear() - new Date(pubDate).getFullYear();
    }
  }
  