// The array is our single source of truth. Every book lives here.
// The DOM is just a view of this array — when this changes, we re-render.
const myLibrary = [];

// Constructor for a single book. Call with `new Book(...)`.
// Capitalized name signals "use with new" (forgetting `new` fails silently).
function Book(author, title, pages, isRead = false) {
  // Generated inside the constructor so uniqueness is guaranteed in one place,
  // never fumbled by the caller. Used later to find/delete specific books.
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead; // boolean; defaults to false (a new book is unread)
}

// A method shared by ALL Book instances via the prototype.
// `this` refers to whichever book the method is called on.
Book.prototype.toggleRead = function () {
  this.isRead = !this.isRead; // flip the boolean: true→false, false→true
};

// Separate from the constructor on purpose: the constructor only *builds* a book,
// this function builds one AND stores it. Keeps responsibilities separated.
function addBookToLibrary(author, title, pages, isRead) {
  const newBook = new Book(author, title, pages, isRead);
  myLibrary.push(newBook);
}

// Grab the container once, up front, so render() can reuse it.
const libraryContainer = document.querySelector("#library");

// Wipes the screen and rebuilds every card from the array.
// "UI is a function of state": call this after ANY change to myLibrary.
function render() {
  // Clear first, then rebuild — otherwise re-rendering would stack duplicate
  // cards on top of the old ones.
  libraryContainer.textContent = "";

  myLibrary.forEach((book) => {
    const card = document.createElement("div");

    // Stamp the card with this book's unique id, stored in a data-attribute.
    // This is the link between the DOM element and the object in the array.
    card.dataset.id = book.id;

    // A separate element for the text, so the buttons sit apart from it.
    const info = document.createElement("p");
    info.textContent = `${book.title} by ${book.author}, ${book.pages} pages — ${book.isRead ? "Read" : "Not read yet"}`;

    // --- Delete button ---
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      // Find where this book sits in the array by its id...
      const index = myLibrary.findIndex((b) => b.id === book.id);
      // ...remove 1 element at that position...
      myLibrary.splice(index, 1);
      // ...then re-render so the screen matches the updated array.
      render();
    });

    // --- Toggle Read button ---
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "Toggle Read";
    toggleBtn.addEventListener("click", () => {
      book.toggleRead(); // flip this book's isRead via the prototype method
      render();          // rebuild the view so the change shows
    });

    card.append(info, deleteBtn, toggleBtn);
    libraryContainer.append(card);
  });
}

// Grab the dialog-related elements once, up front, so handlers can reuse them.
const newBookBtn = document.querySelector("#new-book-btn");
const bookDialog = document.querySelector("#book-dialog");
const bookForm = document.querySelector("#book-form");
const cancelBtn = document.querySelector("#cancel-btn");

// Open the dialog when "New Book" is clicked.
// showModal() (not show()) dims the background and traps focus for accessibility.
newBookBtn.addEventListener("click", () => {
  bookDialog.showModal();
});

// Close the dialog when "Cancel" is clicked, without adding a book.
cancelBtn.addEventListener("click", () => {
  bookDialog.close();
});

// Runs when the form is submitted (Add Book clicked, or Enter pressed).
bookForm.addEventListener("submit", (event) => {
  // Stop the browser's default submit-and-reload, which would wipe myLibrary.
  event.preventDefault();

  // Read the values the user typed. .value is always a STRING.
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  // Pages comes in as a string ("310"), so convert to a real number.
  const pages = Number(document.querySelector("#pages").value);
  // A checkbox has no meaningful .value — we read .checked, which is a boolean.
  const isRead = document.querySelector("#isRead").checked;

  // Update the data (source of truth)...
  addBookToLibrary(author, title, pages, isRead);
  // ...then update the view.
  render();

  // Clear the fields so the form is fresh next time, and close the dialog.
  bookForm.reset();
  bookDialog.close();
});

// Initial render (empty library on load, until the user adds books).
render();