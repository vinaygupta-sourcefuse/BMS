BookManager class should have only CRUD opration with genric type(why genric)
Why Book Class should be a interface?
there will an special class for Book Validation, Calculation, DOM, Utilities

**BookManager Class with Generic Type:**

Generic types allow the BookManager class to operate on a wide range of data types, making it highly versatile. This eliminates the need for creating separate manager classes for different types of entities, thereby enhancing code reusability and maintainability.

**Book Class as an Interface:**

Defining Book as an interface allows for the implementation of different functionalities in separate classes. This promotes loose coupling and facilitates the separation of concerns, making it easier to change or extend the functionality of books without impacting other components of the system.

**Separate Classes for Validation, Calculation, DOM, and Utilities:**

* **BookValidation:** Responsible for validating the data associated with books, ensuring its integrity before being processed.
* **BookCalculation:** Performs calculations related to books, such as calculating the average rating or the total number of pages.
* **BookDOM:** Handles the interactions with the Document Object Model (DOM), making it easier to manipulate and display book-related information in a user-friendly manner.
* **BookUtilities:** Provides general utility methods for tasks such as formatting data, generating unique identifiers, and handling exceptions.



1. BookManager Class is now fully working with SRP
2. make interface for Book which interface contracts can be implemented on Printed Book, E-Book, Magazine and Research Paper Class Models.

and Implement genrics on BookManager Class so that this class operation can be utilised for  Printed Book, E-Book, Magazine and Research Paper Class Models 


