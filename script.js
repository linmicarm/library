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
    // Ternary turns the boolean into human-readable text inside the template literal.
    card.textContent = `${book.title} by ${book.author}, ${book.pages} pages — ${book.isRead ? "Read" : "Not read yet"}`;
    libraryContainer.append(card);
  });
}

// --- Manual test data + initial render (temporary, for development) ---
addBookToLibrary("Tolkien", "The Hobbit", 310, true);
addBookToLibrary("Andy Weir", "Project Hail Mary", 496, false);

render();