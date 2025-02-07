import {BookManager} from './BookManager.js';

document.addEventListener('DOMContentLoaded', () => {
  new BookManager(); // has-a relationship with BookManager

    //it will help us to show the form when we click on the add, edit, delete and categorize button
    (window as any).showForm = (formId: string) => {
      const formContainer = document.getElementById('formContainer');
      if (formContainer) {
        formContainer.classList.remove('hidden');
        document.querySelectorAll('#formContainer > div').forEach(div => div.classList.add('hidden'));
        document.getElementById(formId)?.classList.remove('hidden');
      }
    };
});
